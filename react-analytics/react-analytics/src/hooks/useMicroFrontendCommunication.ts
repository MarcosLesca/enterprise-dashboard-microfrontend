import { useEffect, useRef, useCallback, useState } from "react";

interface MicroFrontendMessage {
  type: "READY" | "DATA_UPDATE" | "USER_ACTION" | "ERROR" | "NAVIGATION";
  payload?: any;
  timestamp: number;
  source: "angular" | "react";
}

interface SharedContext {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token?: string;
  theme?: "light" | "dark";
  locale?: string;
}

interface UseMicroFrontendCommunicationReturn {
  sharedContext: SharedContext | null;
  isConnected: boolean;
  sendMessage: (
    message: Omit<MicroFrontendMessage, "timestamp" | "source">,
  ) => void;
  notifyAngular: (action: string, data?: any) => void;
  reportError: (error: string, details?: any) => void;
}

export const useMicroFrontendCommunication =
  (): UseMicroFrontendCommunicationReturn => {
    const [sharedContext, setSharedContext] = useState<SharedContext | null>(
      null,
    );
    const [isConnected, setIsConnected] = useState(false);
    const heartbeatTimerRef = useRef<number>();
    const messageListenerRef = useRef<(event: MessageEvent) => void>();

    // Enviar mensaje al Angular shell
    const sendMessage = useCallback(
      (message: Omit<MicroFrontendMessage, "timestamp" | "source">) => {
        const fullMessage: MicroFrontendMessage = {
          ...message,
          timestamp: Date.now(),
          source: "react",
        };

        if (window.parent !== window) {
          window.parent.postMessage(JSON.stringify(fullMessage), "*");
          console.log("📤 Message sent to Angular:", fullMessage);
        }
      },
      [],
    );

    // Notificar al shell sobre acciones del usuario
    const notifyAngular = useCallback(
      (action: string, data?: any) => {
        sendMessage({
          type: "USER_ACTION",
          payload: { action, data },
        });
      },
      [sendMessage],
    );

    // Reportar errores al shell
    const reportError = useCallback(
      (error: string, details?: any) => {
        sendMessage({
          type: "ERROR",
          payload: { message: error, details },
        });
      },
      [sendMessage],
    );

    // Manejar mensajes del Angular shell
    const handleMessage = useCallback((event: MessageEvent) => {
      try {
        const message: MicroFrontendMessage = JSON.parse(event.data);

        if (message.source !== "angular") {
          return;
        }

        console.log("📨 Message from Angular:", message);

        switch (message.type) {
          case "DATA_UPDATE":
            if (message.payload?.heartbeat) {
              // Heartbeat - mantener conexión viva
              setIsConnected(true);
              return;
            }

            if (message.payload?.resize) {
              // Resize notification
              console.log("📏 Resize detected:", message.payload.resize);
              return;
            }

            // Actualizar contexto compartido
            setSharedContext(message.payload);
            break;

          case "NAVIGATION":
            // Manejar navegación solicitada por Angular
            console.log("🧭 Navigation from Angular:", message.payload);
            break;

          default:
            console.warn("⚠️ Unknown message type:", message.type);
        }
      } catch (error) {
        console.warn("⚠️ Invalid message format:", event.data);
      }
    }, []);

    // Inicializar comunicación
    useEffect(() => {
      // Configurar listener para mensajes del parent
      messageListenerRef.current = handleMessage;
      window.addEventListener("message", messageListenerRef.current);

      // Notificar que estamos ready
      setTimeout(() => {
        sendMessage({
          type: "READY",
        });
      }, 100); // Pequeño delay para asegurar que el listener está listo

      // Cleanup
      return () => {
        if (messageListenerRef.current) {
          window.removeEventListener("message", messageListenerRef.current);
        }
      };
    }, [handleMessage, sendMessage]);

    // Heartbeat para mantener conexión
    useEffect(() => {
      heartbeatTimerRef.current = window.setInterval(() => {
        if (isConnected) {
          sendMessage({
            type: "DATA_UPDATE",
            payload: { heartbeat: true, timestamp: Date.now() },
          });
        }
      }, 30000); // Cada 30 segundos

      return () => {
        if (heartbeatTimerRef.current) {
          clearInterval(heartbeatTimerRef.current);
        }
      };
    }, [isConnected, sendMessage]);

    // Detectar pérdida de conexión
    useEffect(() => {
      const connectionCheck = window.setInterval(() => {
        const wasConnected = isConnected;
        setIsConnected(false); // Se pone en true con el heartbeat

        setTimeout(() => {
          if (!isConnected && wasConnected) {
            console.warn("⚠️ Connection lost with Angular shell");
          }
        }, 1000);
      }, 35000); // Un poco más que el heartbeat

      return () => window.clearInterval(connectionCheck);
    }, [isConnected]);

    return {
      sharedContext,
      isConnected,
      sendMessage,
      notifyAngular,
      reportError,
    };
  };

// Hook simplificado para componentes que solo necesitan notificar
export const useNotifyAngular = () => {
  const { notifyAngular } = useMicroFrontendCommunication();
  return notifyAngular;
};

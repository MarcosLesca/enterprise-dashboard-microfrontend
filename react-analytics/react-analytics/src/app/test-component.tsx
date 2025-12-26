const TestComponent = () => {
  return (
    <div style={{ padding: "20px", background: "#f0f0f0", height: "100vh" }}>
      <h1>🎯 TEST COMPONENT</h1>
      <p>Este es un componente de prueba SIMPLE</p>
      <p>Si esto se ve, el problema está en el componente original</p>
      <p>Si esto NO se ve, el problema es más profundo</p>
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2>✅ React está funcionando!</h2>
        <p>Timestamp: {new Date().toLocaleString()}</p>
        <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
      </div>
    </div>
  );
};

export default TestComponent;

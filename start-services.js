#!/usr/bin/env node

const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Detectar el SO
const isWindows = process.platform === "win32";
const shell = isWindows ? "cmd.exe" : "bash";

// Colores para consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para ejecutar comandos
function runCommand(command, cwd, name, port) {
  return new Promise((resolve, reject) => {
    log(`\n🚀 Starting ${name} on port ${port}...`, "cyan");

    const args = isWindows ? ["/c", command] : ["-c", command];
    const child = spawn(shell, args, {
      cwd: cwd || __dirname,
      stdio: "pipe",
      shell: true,
    });

    child.stdout.on("data", (data) => {
      const output = data.toString();
      if (
        output.includes("ready") ||
        output.includes("listening") ||
        output.includes("serving") ||
        output.includes("localhost")
      ) {
        log(`✅ ${name} is READY!`, "green");
        log(`📱 Access at: http://localhost:${port}`, "blue");
      }
      process.stdout.write(`[${name}] ${output}`);
    });

    child.stderr.on("data", (data) => {
      const output = data.toString();
      if (!output.includes("WARN") && !output.includes("DEPRECATED")) {
        process.stderr.write(`[${name}] ${colors.red}${output}${colors.reset}`);
      }
    });

    child.on("error", (error) => {
      log(`❌ Failed to start ${name}: ${error.message}`, "red");
      reject(error);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        log(`${name} exited with code ${code}`, "yellow");
      }
    });

    // Para desarrollo, guardamos referencia
    if (name === "Django API") {
      child.pythonProcess = child;
    }

    resolve(child);
  });
}

// Función para verificar si Python y Node están instalados
function checkDependencies() {
  log("\n🔍 Checking dependencies...", "yellow");

  const checks = [
    { cmd: "node --version", name: "Node.js" },
    { cmd: "npm --version", name: "npm" },
    {
      cmd: isWindows ? "python --version" : "python3 --version",
      name: "Python",
    },
  ];

  return Promise.all(
    checks.map(
      (check) =>
        new Promise((resolve) => {
          exec(check.cmd, (error, stdout) => {
            if (error) {
              log(`❌ ${check.name} not found`, "red");
              process.exit(1);
            } else {
              log(`✅ ${check.name}: ${stdout.trim()}`, "green");
              resolve();
            }
          });
        }),
    ),
  );
}

// Función para instalar dependencias
function installDependencies() {
  return new Promise((resolve) => {
    log("\n📦 Installing dependencies...", "yellow");

    const npmInstall = spawn("npm", ["install"], { stdio: "inherit" });

    npmInstall.on("close", (code) => {
      if (code === 0) {
        log("✅ Dependencies installed", "green");
        resolve();
      } else {
        log("❌ Failed to install dependencies", "red");
        process.exit(1);
      }
    });
  });
}

// Función para configurar entorno virtual de Python
function setupPythonEnv() {
  return new Promise((resolve) => {
    const venvCmd = isWindows
      ? "if not exist venv python -m venv venv && venv\\Scripts\\activate && pip install -r requirements.txt"
      : "test ! -d venv && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt";

    log("\n🐍 Setting up Python environment...", "yellow");

    const pythonSetup = spawn(
      shell,
      isWindows ? ["/c", venvCmd] : ["-c", venvCmd],
      {
        cwd: path.join(__dirname, "django-api"),
        stdio: "inherit",
      },
    );

    pythonSetup.on("close", (code) => {
      if (code === 0) {
        log("✅ Python environment ready", "green");
        resolve();
      } else {
        log("❌ Failed to setup Python environment", "red");
        process.exit(1);
      }
    });
  });
}

// Función principal
async function main() {
  const command = process.argv[2];

  log(
    "\n🎯 Enterprise Dashboard - Micro-frontend Development Server",
    "bright",
  );
  log("=".repeat(60), "cyan");

  switch (command) {
    case "start":
    case "dev":
      await checkDependencies();
      await installDependencies();
      await setupPythonEnv();

      log("\n🚀 Starting all services...", "bright");
      log("⏳ This will take a moment...", "yellow");

      // Iniciar Django API
      const djangoCmd = isWindows
        ? "venv\\Scripts\\activate && python manage.py runserver 0.0.0.0:8000"
        : "source venv/bin/activate && python manage.py runserver 0.0.0.0:8000";

      await runCommand(
        djangoCmd,
        path.join(__dirname, "django-api"),
        "Django API",
        8000,
      );

      // Esperar un poco para que Django inicie
      setTimeout(async () => {
        // Iniciar Angular Shell
        await runCommand(
          "npx ng serve",
          path.join(__dirname, "angular-shell"),
          "Angular Shell",
          4200,
        );

        // Iniciar React Analytics
        await runCommand(
          "npx nx serve react-analytics-react-analytics",
          __dirname,
          "React Analytics",
          4201,
        );
      }, 3000);

      // Mostrar resumen
      setTimeout(() => {
        log("\n" + "=".repeat(60), "cyan");
        log("🎉 ALL SERVICES RUNNING!", "bright");
        log("\n📱 Access your applications:", "blue");
        log("   • Angular Shell: http://localhost:4200", "blue");
        log("   • React Analytics: http://localhost:4201", "blue");
        log("   • Django API: http://localhost:8000", "blue");
        log("   • Django Admin: http://localhost:8000/admin/", "blue");
        log("\n🔑 Default credentials:", "yellow");
        log("   Email: admin@enterprise.com", "yellow");
        log("   Password: Enterprise123!", "yellow");
        log("\n💡 Press Ctrl+C to stop all services", "cyan");
        log("=".repeat(60), "cyan");
      }, 8000);

      // Manejar cierre limpio
      process.on("SIGINT", () => {
        log("\n\n🛑 Stopping all services...", "yellow");
        process.exit(0);
      });

      break;

    case "stop":
      log("\n🛑 Stopping all services...", "yellow");

      const killCmd = isWindows
        ? 'taskkill /F /IM node.exe /IM python.exe 2>nul || echo "No processes found"'
        : 'pkill -f "ng serve" || pkill -f "nx serve" || pkill -f "manage.py runserver" || echo "No processes found"';

      exec(killCmd, (error, stdout, stderr) => {
        log("✅ All services stopped", "green");
      });
      break;

    case "build":
      log("\n🔨 Building all applications...", "yellow");
      runCommand("npm run build", __dirname, "Build Process", null);
      break;

    default:
      log("\n📖 Usage:", "bright");
      log(
        "  node start-services.js start   - Start all development services",
        "cyan",
      );
      log("  node start-services.js stop    - Stop all services", "cyan");
      log("  node start-services.js build   - Build all applications", "cyan");
      log("\n💡 Quick start: npm run dev", "green");
      break;
  }
}

main().catch(console.error);

const { spawn } = require("child_process");
const path = require("path");

console.log("\x1b[36m%s\x1b[0m", "==================================================");
console.log("\x1b[36m%s\x1b[0m", " Starting Comparely Backend (5000) & Frontend (5173)");
console.log("\x1b[36m%s\x1b[0m", "==================================================");

const backend = spawn("npm", ["run", "dev"], {
  cwd: path.join(__dirname, "backend"),
  shell: true,
  stdio: "pipe",
});

const frontend = spawn("npm", ["run", "dev"], {
  cwd: path.join(__dirname, "frontend"),
  shell: true,
  stdio: "pipe",
});

function pipeOutput(proc, prefix, color) {
  proc.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}[${prefix}]\x1b[0m ${line}`);
      }
    }
  });

  proc.stderr.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${color}[${prefix}]\x1b[0m ${line}`);
      }
    }
  });
}

pipeOutput(backend, "BACKEND", "\x1b[35m");
pipeOutput(frontend, "FRONTEND", "\x1b[34m");

function cleanup() {
  console.log("\n\x1b[33mStopping servers...\x1b[0m");
  backend.kill();
  frontend.kill();
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);

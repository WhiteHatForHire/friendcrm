import { spawn } from "node:child_process";

const port = process.env.FRIEND_CRM_DEMO_PORT ?? "5176";
const baseUrl = `http://127.0.0.1:${port}`;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const coveredPath = [
  "first load",
  "People",
  "note capture",
  "Review Panel",
  "Plot Board",
  "Poster Lab",
  "Evidence Locker export",
  "saved-export restore",
  "sample restore"
].join(" -> ");

console.log("# Friend CRM Demo Readiness Check\n");
console.log("Provider mode: disabled for baseline demo validation");
console.log(`Target: ${baseUrl}`);
console.log(`Covered path: ${coveredPath}`);
console.log("");

await run("npm", ["test"]);
await run("npm", ["run", "build"]);

const server = spawn(npmCommand, ["run", "dev", "--", "--host", "127.0.0.1", "--port", port], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    FRIEND_CRM_DISABLE_PROVIDER: "1"
  },
  stdio: ["ignore", "pipe", "pipe"]
});

let serverReady = false;

try {
  await waitForServer(server, baseUrl);
  serverReady = true;
  await run("npm", ["run", "smoke:ui"], { FRIEND_CRM_BASE_URL: baseUrl, FRIEND_CRM_DISABLE_PROVIDER: "1" });
  await run("npm", ["run", "regression:browser"], { FRIEND_CRM_BASE_URL: baseUrl, FRIEND_CRM_DISABLE_PROVIDER: "1" });
  await run("npm", ["run", "regression:mobile"], { FRIEND_CRM_BASE_URL: baseUrl, FRIEND_CRM_DISABLE_PROVIDER: "1" });
  await run("npm", ["run", "regression:tablet"], { FRIEND_CRM_BASE_URL: baseUrl, FRIEND_CRM_DISABLE_PROVIDER: "1" });
  console.log("\nDemo readiness baseline passed.");
} finally {
  if (!server.killed) {
    server.kill("SIGTERM");
  }

  if (!serverReady) {
    console.error("\nDemo readiness server did not become ready.");
  }
}

async function run(label, args, extraEnv = {}) {
  console.log(`\n> ${label} ${args.join(" ")}`);

  await new Promise((resolve, reject) => {
    const child = spawn(label === "npm" ? npmCommand : label, args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ...extraEnv
      },
      stdio: "inherit"
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${label} ${args.join(" ")} failed with exit code ${code}.`));
      }
    });

    child.on("error", reject);
  });
}

async function waitForServer(server, url) {
  const startedAt = Date.now();
  const timeoutMs = 30000;
  let output = "";

  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });

  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  while (Date.now() - startedAt < timeoutMs) {
    if (server.exitCode !== null) {
      throw new Error(`Vite server exited early.\n${output}`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for Vite server at ${url}.\n${output}`);
}

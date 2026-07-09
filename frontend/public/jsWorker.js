/**
 * jsWorker.js — Sandboxed JavaScript execution Web Worker.
 * Placed in /public so Vite serves it as a static file.
 *
 * Receives: { code: string, id: string }
 * Sends back: { id, stdout: string[], stderr: string | null, done: true }
 *
 * The main thread handles the 5-second timeout by calling Worker.terminate().
 */

// Proxy console so we can capture log output
const logs = [];
const capturedConsole = {
  log:   (...args) => logs.push(args.map(safeStringify).join(" ")),
  info:  (...args) => logs.push(args.map(safeStringify).join(" ")),
  warn:  (...args) => logs.push("[warn] " + args.map(safeStringify).join(" ")),
  error: (...args) => logs.push("[error] " + args.map(safeStringify).join(" ")),
  dir:   (obj)     => logs.push(safeStringify(obj)),
  table: (data)    => logs.push("[table] " + safeStringify(data)),
};

function safeStringify(val) {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  if (typeof val === "string") return val;
  if (typeof val === "function") return val.toString();
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
}

self.onmessage = function (e) {
  const { code, id } = e.data;
  logs.length = 0; // reset

  let stderr = null;

  try {
    // Create a new Function with console shadowed by our proxy.
    // We also provide a minimal safe environment.
    const fn = new Function(
      "console",
      `"use strict";\n${code}`
    );
    fn(capturedConsole);
  } catch (err) {
    stderr = `${err.name}: ${err.message}`;
    if (err.stack) {
      // Only include the first two lines of the stack to reduce noise
      stderr = err.stack.split("\n").slice(0, 3).join("\n");
    }
  }

  self.postMessage({ id, stdout: [...logs], stderr, done: true });
};

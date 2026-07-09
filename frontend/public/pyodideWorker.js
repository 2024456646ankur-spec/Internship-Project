/**
 * pyodideWorker.js — Pyodide Python execution Web Worker.
 * Placed in /public so Vite serves it as a static file.
 *
 * Receives: { code: string, id: string }
 * Sends back:
 *   { type: "loading" }               — Pyodide is downloading
 *   { type: "ready" }                 — Pyodide loaded and ready
 *   { type: "result", id, stdout, stderr, done: true }
 *   { type: "error",  id, message }   — fatal load error
 *
 * KNOWN LIMITATION (documented):
 * If user code contains an infinite synchronous loop, it will block this
 * worker thread indefinitely. The main thread can call Worker.terminate()
 * as a kill switch, but the Python code itself cannot be interrupted from
 * within the same thread. A future version could use SharedArrayBuffer +
 * Atomics for cooperative interruption.
 */

importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

let pyodide = null;
let loadError = null;

// Load Pyodide eagerly when the worker starts
async function loadPyodideRuntime() {
  try {
    self.postMessage({ type: "loading" });
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
    self.postMessage({ type: "ready" });
  } catch (err) {
    loadError = err.message;
    self.postMessage({ type: "error", message: err.message });
  }
}

const initPromise = loadPyodideRuntime();

self.onmessage = async function (e) {
  const { code, id } = e.data;

  // Wait for Pyodide to be ready
  await initPromise;

  if (loadError) {
    self.postMessage({
      type: "result",
      id,
      stdout: [],
      stderr: `Failed to load Python environment: ${loadError}`,
      done: true,
    });
    return;
  }

  let stdout = "";
  let stderr = null;

  try {
    // Redirect Python stdout/stderr to StringIO buffers
    await pyodide.runPythonAsync(`
import sys
import io
_stdout_capture = io.StringIO()
_stderr_capture = io.StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
`);

    // Run the user's code
    await pyodide.runPythonAsync(code);

    // Collect output
    stdout = await pyodide.runPythonAsync("_stdout_capture.getvalue()");
    const stderrOut = await pyodide.runPythonAsync("_stderr_capture.getvalue()");
    if (stderrOut) stderr = stderrOut;

  } catch (err) {
    // Python runtime errors come through here
    stderr = err.message || String(err);
  } finally {
    // Restore sys.stdout/stderr so subsequent runs start clean
    try {
      await pyodide.runPythonAsync(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);
    } catch {
      // Ignore restore errors
    }
  }

  self.postMessage({
    type: "result",
    id,
    stdout: stdout ? stdout.split("\n").filter((_, i, arr) => i < arr.length - 1 || arr[i] !== "") : [],
    stderr,
    done: true,
  });
};

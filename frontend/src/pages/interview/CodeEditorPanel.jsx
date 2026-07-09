/**
 * CodeEditorPanel.jsx
 * Right panel: Monaco editor, language toggle (JS | Python),
 * Run Code button, and output console.
 *
 * JAVASCRIPT: runs in jsWorker.js (Web Worker), 5s timeout via Worker.terminate()
 * PYTHON:     runs in pyodideWorker.js (Web Worker + Pyodide)
 *
 * Props:
 *   question    {object}  — current question (has starterCode.js + starterCode.python)
 *   visible     {boolean} — panel is visible (coding question only)
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Terminal, AlertTriangle, RefreshCw, Mic } from "lucide-react";

// ── Custom Monaco theme matching app dark palette ───────────────────────────
const APP_DARK_THEME = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment",   foreground: "4a5568", fontStyle: "italic" },
    { token: "keyword",   foreground: "a78bfa" },
    { token: "string",    foreground: "6ee7b7" },
    { token: "number",    foreground: "fca5a5" },
    { token: "type",      foreground: "93c5fd" },
    { token: "function",  foreground: "fbbf24" },
    { token: "variable",  foreground: "e2e8f0" },
  ],
  colors: {
    "editor.background":           "#0d0d14",
    "editor.foreground":           "#e2e8f0",
    "editor.lineHighlightBackground": "#1a1a2e",
    "editorLineNumber.foreground": "#374151",
    "editorLineNumber.activeForeground": "#6366f1",
    "editor.selectionBackground":  "#312e81",
    "editorCursor.foreground":     "#8b5cf6",
    "editor.inactiveSelectionBackground": "#1e1b4b",
    "scrollbar.shadow":            "#00000080",
    "scrollbarSlider.background":  "#1e1b4b",
    "scrollbarSlider.hoverBackground": "#312e81",
    "editorWidget.background":     "#0f0f1a",
    "editorSuggestWidget.background": "#0f0f1a",
    "editorSuggestWidget.border":  "#1e1b4b",
    "dropdown.background":         "#0f0f1a",
    "input.background":            "#1a1a2e",
  },
};

// ── Output line component ───────────────────────────────────────────────────
function OutputLine({ line, isStderr }) {
  return (
    <div
      className="font-mono text-xs leading-relaxed py-0.5"
      style={{ color: isStderr ? "#fca5a5" : "#a3e635" }}
    >
      {isStderr ? (
        <span className="text-red-400/60 mr-1 select-none">✕</span>
      ) : (
        <span className="text-emerald-500/40 mr-1 select-none">›</span>
      )}
      {line}
    </div>
  );
}

// ── Output console ──────────────────────────────────────────────────────────
function OutputConsole({ lines, stderrText, running }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, stderrText]);

  return (
    <div
      className="flex-shrink-0 h-36 rounded-b-xl border border-t-0 border-white/[0.08] overflow-y-auto p-3"
      style={{ background: "#080810" }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Terminal size={11} className="text-slate-600" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Output
        </span>
        {running && (
          <Loader2 size={10} className="text-indigo-400 animate-spin ml-1" />
        )}
      </div>

      {lines.length === 0 && !stderrText && !running && (
        <p className="text-xs text-slate-700 italic">Run your code to see output here.</p>
      )}

      {lines.map((line, i) => (
        <OutputLine key={i} line={line} isStderr={false} />
      ))}

      {stderrText &&
        stderrText.split("\n").map((line, i) => (
          <OutputLine key={`e-${i}`} line={line} isStderr />
        ))}

      <div ref={bottomRef} />
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CodeEditorPanel({ question, visible }) {
  const [language, setLanguage] = useState("javascript"); // "javascript" | "python"

  // Per-language code state — persists when toggling
  const [jsCode, setJsCode] = useState("");
  const [pyCode, setPyCode] = useState("");

  // Output state
  const [outputLines, setOutputLines] = useState([]);
  const [stderrText, setStderrText] = useState(null);
  const [running, setRunning] = useState(false);

  // Pyodide Worker state
  const [pyWorkerReady, setPyWorkerReady] = useState(false);
  const [pyLoading, setPyLoading] = useState(false);

  // Worker refs (persistent across renders)
  const jsWorkerRef = useRef(null);
  const pyWorkerRef = useRef(null);
  const jsTimeoutRef = useRef(null);

  // ── Initialise starter code when question changes ──────────────────────
  useEffect(() => {
    if (!question?.starterCode) return;
    setJsCode(question.starterCode.js || "");
    setPyCode(question.starterCode.python || "");
    setOutputLines([]);
    setStderrText(null);
  }, [question?.id]);

  // ── Pyodide Worker: lazy-init on first Python run ─────────────────────
  const initPyWorker = useCallback(() => {
    if (pyWorkerRef.current) return; // already created

    setPyLoading(true);
    const worker = new Worker("/pyodideWorker.js");

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "loading") {
        setPyLoading(true);
        setPyWorkerReady(false);
      } else if (msg.type === "ready") {
        setPyLoading(false);
        setPyWorkerReady(true);
      } else if (msg.type === "error") {
        setPyLoading(false);
        setStderrText(`Failed to load Python environment: ${msg.message}`);
        setRunning(false);
      } else if (msg.type === "result") {
        clearTimeout(jsTimeoutRef.current);
        setRunning(false);
        setOutputLines(msg.stdout || []);
        setStderrText(msg.stderr || null);
      }
    };

    worker.onerror = (e) => {
      setRunning(false);
      setPyLoading(false);
      setStderrText(`Worker error: ${e.message}`);
    };

    pyWorkerRef.current = worker;
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      jsWorkerRef.current?.terminate();
      pyWorkerRef.current?.terminate();
      clearTimeout(jsTimeoutRef.current);
    };
  }, []);

  // ── Run Code ───────────────────────────────────────────────────────────
  const handleRunCode = useCallback(() => {
    setOutputLines([]);
    setStderrText(null);
    setRunning(true);

    const code = language === "javascript" ? jsCode : pyCode;

    if (language === "javascript") {
      // Terminate any previous JS worker
      jsWorkerRef.current?.terminate();

      const worker = new Worker("/jsWorker.js");
      jsWorkerRef.current = worker;

      const runId = Date.now().toString();

      // 5-second hard timeout via Worker.terminate()
      jsTimeoutRef.current = setTimeout(() => {
        worker.terminate();
        jsWorkerRef.current = null;
        setRunning(false);
        setStderrText("TimeoutError: Code execution exceeded 5 seconds — possible infinite loop.");
      }, 5000);

      worker.onmessage = (e) => {
        if (e.data.id !== runId) return;
        clearTimeout(jsTimeoutRef.current);
        setRunning(false);
        setOutputLines(e.data.stdout || []);
        setStderrText(e.data.stderr || null);
        worker.terminate();
        jsWorkerRef.current = null;
      };

      worker.onerror = (e) => {
        clearTimeout(jsTimeoutRef.current);
        setRunning(false);
        setStderrText(`Worker error: ${e.message}`);
        worker.terminate();
        jsWorkerRef.current = null;
      };

      worker.postMessage({ code, id: runId });

    } else {
      // Python via Pyodide Worker
      if (!pyWorkerRef.current) {
        initPyWorker();
        // Worker will set pyLoading=true; we need to wait for ready before running
        // Re-queue run after a short wait — the worker's onmessage will handle the result
        // once it's ready (runPythonAsync runs when message is received)
      }

      // Pyodide worker handles queuing internally; just post the message.
      // If the worker isn't ready yet, messages are queued by the browser.
      const runId = Date.now().toString();

      // 30s timeout for Python (including Pyodide load time on first run)
      jsTimeoutRef.current = setTimeout(() => {
        setRunning(false);
        setStderrText(
          "TimeoutError: Python execution exceeded 30 seconds.\n" +
          "⚠️ Known limitation: synchronous infinite loops in Python cannot be interrupted — " +
          "the page may need to be reloaded."
        );
      }, 30000);

      if (!pyWorkerRef.current) initPyWorker();
      pyWorkerRef.current.postMessage({ code, id: runId });
    }
  }, [language, jsCode, pyCode, initPyWorker]);

  // ── Language toggle ────────────────────────────────────────────────────
  const currentCode = language === "javascript" ? jsCode : pyCode;
  const setCurrentCode = language === "javascript" ? setJsCode : setPyCode;
  const monacoLang = language === "javascript" ? "javascript" : "python";

  if (!visible) return null;

  return (
    <div className="flex flex-col h-full gap-0">
      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] flex-shrink-0"
        style={{ background: "rgba(13,13,20,0.95)" }}
      >
        {/* Language toggle */}
        <div
          className="flex rounded-lg overflow-hidden border border-white/[0.08]"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {["javascript", "python"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className="px-3 py-1.5 text-xs font-semibold transition-all duration-150"
              style={{
                background: language === lang
                  ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                  : "transparent",
                color: language === lang ? "#ffffff" : "#64748b",
              }}
            >
              {lang === "javascript" ? "JavaScript" : "Python"}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Pyodide loading indicator */}
          {language === "python" && pyLoading && !pyWorkerReady && (
            <span className="flex items-center gap-1.5 text-xs text-indigo-400">
              <Loader2 size={12} className="animate-spin" />
              Loading Python environment…
            </span>
          )}

          {/* Reset code */}
          <button
            onClick={() => {
              const starter = question?.starterCode;
              if (starter) {
                if (language === "javascript") setJsCode(starter.js || "");
                else setPyCode(starter.python || "");
              }
            }}
            title="Reset to starter code"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all"
          >
            <RefreshCw size={13} />
          </button>

          {/* Run Code */}
          <button
            onClick={handleRunCode}
            disabled={running || (language === "python" && pyLoading && !pyWorkerReady)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              boxShadow: running ? "none" : "0 0 12px rgba(22,163,74,0.4)",
            }}
          >
            {running ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Play size={13} fill="currentColor" />
            )}
            {running ? "Running…" : "Run Code"}
          </button>
        </div>
      </div>

      {/* ── Python limitation notice (first time) ─────────────────────── */}
      {language === "python" && !pyWorkerReady && !pyLoading && !pyWorkerRef.current && (
        <div className="flex items-start gap-2 px-4 py-2 text-xs text-amber-300/80 border-b border-amber-500/10 bg-amber-500/5 flex-shrink-0">
          <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
          <span>
            First Python run downloads ~10MB WASM (Pyodide). Subsequent runs are fast.
            <span className="text-amber-300/50 ml-1">
              ⚠ v1 limitation: synchronous infinite loops cannot be interrupted.
            </span>
          </span>
        </div>
      )}

      {/* ── Monaco Editor ─────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0">
        <Editor
          language={monacoLang}
          value={currentCode}
          onChange={(val) => setCurrentCode(val ?? "")}
          theme="app-dark"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("app-dark", APP_DARK_THEME);
          }}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            lineHeight: 1.7,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "line",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            tabSize: 2,
            insertSpaces: true,
            automaticLayout: true,
            suggest: { showKeywords: true },
          }}
          height="100%"
        />
      </div>

      {/* ── Output console ─────────────────────────────────────────────── */}
      <OutputConsole
        lines={outputLines}
        stderrText={stderrText}
        running={running}
      />
    </div>
  );
}

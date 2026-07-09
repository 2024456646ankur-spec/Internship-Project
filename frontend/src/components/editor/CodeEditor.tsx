/**
 * CodeEditor — Monaco editor + xterm.js terminal for coding rounds.
 * Language selector, run button, diff view toggle (post-submit).
 */
import { useRef, useEffect, useState } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import ReactDiffViewer from 'react-diff-viewer-continued'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'
import { useSessionStore } from '@/store/sessionStore'
import '@xterm/xterm/css/xterm.css'

const LANGUAGES = ['python', 'javascript', 'java', 'cpp', 'go', 'rust']
const DEFAULT_STARTERS: Record<string, string> = {
  python:     '# Write your solution here\ndef solution():\n    pass\n',
  javascript: '// Write your solution here\nfunction solution() {\n  \n}\n',
  java:       'public class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  cpp:        '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
  go:         'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello")\n}\n',
  rust:       'fn main() {\n    println!("Hello, world!");\n}\n',
}

interface CodeEditorProps {
  starterCode?: string
  idealCode?:   string
  questionId:   string
}

export default function CodeEditor({ starterCode, idealCode, questionId }: CodeEditorProps) {
  const [language,    setLanguage]    = useState('python')
  const [running,     setRunning]     = useState(false)
  const [showDiff,    setShowDiff]    = useState(false)
  const [submitted,   setSubmitted]   = useState(false)
  const [output,      setOutput]      = useState('')

  const termRef       = useRef<HTMLDivElement>(null)
  const xtermRef      = useRef<Terminal | null>(null)
  const fitAddonRef   = useRef<FitAddon | null>(null)

  const currentCode   = useSessionStore((s) => s.currentCode)
  const setCode       = useSessionStore((s) => s.setCurrentCode)
  const setCurrentOut = useSessionStore((s) => s.setCurrentOutput)

  const initialCode = starterCode || DEFAULT_STARTERS[language] || ''

  // Initialize xterm.js
  useEffect(() => {
    if (!termRef.current) return
    const term = new Terminal({
      theme: {
        background: '#0d1117',
        foreground: '#e6edf3',
        cursor:     '#5c7cfa',
        green:      '#3fb950',
        red:        '#f85149',
      },
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 13,
      cursorBlink: false,
      disableStdin: true,
    })
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(termRef.current)
    fitAddon.fit()

    xtermRef.current  = term
    fitAddonRef.current = fitAddon

    term.writeln('\x1b[1;34m▶ Rehearsal Room Code Runner\x1b[0m')
    term.writeln('\x1b[90mRun your code and output will appear here.\x1b[0m\r\n')

    const observer = new ResizeObserver(() => fitAddon.fit())
    observer.observe(termRef.current)

    return () => {
      observer.disconnect()
      term.dispose()
    }
  }, [])

  const handleRun = async () => {
    const term = xtermRef.current
    if (!term) return
    setRunning(true)
    term.writeln('\r\n\x1b[33m⟳ Running...\x1b[0m')

    try {
      const res = await api.post('/execute/', {
        language,
        code: currentCode || initialCode,
        stdin: '',
      })
      const { stdout, stderr, exit_code, exec_time_ms } = res.data
      if (stdout) {
        term.writeln('\x1b[32m' + stdout.replace(/\n/g, '\r\n') + '\x1b[0m')
      }
      if (stderr) {
        term.writeln('\x1b[31m' + stderr.replace(/\n/g, '\r\n') + '\x1b[0m')
      }
      term.writeln(
        `\x1b[90m─── exit ${exit_code} · ${exec_time_ms.toFixed(0)}ms ───\x1b[0m`
      )
      setOutput(stdout + stderr)
      setCurrentOut(stdout + stderr)
    } catch (err: any) {
      term.writeln('\x1b[31mExecution request failed: ' + (err.message ?? 'network error') + '\x1b[0m')
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (idealCode) setShowDiff(true)
  }

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-2 glass rounded-lg">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-surface-700 text-white text-sm rounded px-2 py-1 border border-surface-600 focus:outline-none focus:border-brand-500"
          id="language-selector"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <button
          id="run-code-btn"
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-brand-600 hover:bg-brand-700 
                     disabled:opacity-50 rounded transition-colors"
        >
          {running ? '⟳ Running…' : '▶ Run'}
        </button>

        {!submitted && (
          <button
            id="submit-code-btn"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-green-700 
                       hover:bg-green-600 rounded transition-colors ml-auto"
          >
            ✓ Submit
          </button>
        )}

        {submitted && idealCode && (
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-surface-600 
                       hover:bg-surface-500 rounded transition-colors ml-auto"
          >
            {showDiff ? '← Hide Diff' : '⟺ Compare'}
          </button>
        )}
      </div>

      {/* Editor */}
      <AnimatePresence mode="wait">
        {!showDiff ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="monaco-editor-container flex-1 min-h-0"
          >
            <Editor
              height="100%"
              language={language}
              value={currentCode || initialCode}
              onChange={(v) => setCode(v ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                tabSize: 4,
                renderLineHighlight: 'all',
                smoothScrolling: true,
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="diff"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 min-h-0 overflow-auto rounded-lg border border-surface-600"
          >
            <ReactDiffViewer
              oldValue={currentCode || initialCode}
              newValue={idealCode || ''}
              splitView={true}
              leftTitle="Your Solution"
              rightTitle="Ideal Solution"
              useDarkTheme={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal */}
      <div className="terminal-container h-36 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1 px-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-xs text-surface-500 ml-1 font-mono">Terminal</span>
        </div>
        <div ref={termRef} style={{ height: 'calc(100% - 20px)' }} />
      </div>
    </div>
  )
}

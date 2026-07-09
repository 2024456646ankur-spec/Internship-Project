/**
 * useSpeechRecognition.js
 * Custom hook for the Web Speech API SpeechRecognition.
 *
 * Config: continuous=true, interimResults=true, lang='en-US'
 *
 * Returns:
 *   start()             — begin listening
 *   stop()              — manual stop
 *   reset()             — clear transcript
 *   supported           — boolean
 *   listening           — boolean: mic is active
 *   transcript          — string: accumulated final transcript
 *   interimTranscript   — string: in-flight words (not yet final)
 *   error               — string | null: current error message
 *   permissionDenied    — boolean: user blocked mic
 *   silenceDetected     — boolean: true when auto-stop fired after 2.5s
 *   noSpeechTimeout     — boolean: true when nothing captured after 10s
 */
import { useState, useRef, useCallback, useEffect } from "react";

const SILENCE_THRESHOLD_MS = 2500;  // stop after this long with no new words
const NO_SPEECH_TIMEOUT_MS = 10000; // stop if nothing captured at all after this

export function useSpeechRecognition({ onSilence, onNoSpeech } = {}) {
  // ── Feature detection ───────────────────────────────────────────────────
  const SpeechRecognitionAPI =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;
  const supported = !!SpeechRecognitionAPI;

  // State
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [silenceDetected, setSilenceDetected] = useState(false);
  const [noSpeechTimeout, setNoSpeechTimeout] = useState(false);

  // Refs (mutable, no re-render)
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const noSpeechTimerRef = useRef(null);
  const hasSpeechRef = useRef(false);
  const finalTranscriptRef = useRef("");

  // ── Helpers ─────────────────────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    clearTimeout(silenceTimerRef.current);
    clearTimeout(noSpeechTimerRef.current);
  }, []);

  const resetSilenceTimer = useCallback(() => {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      // Auto-stop after silence
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      }
      setSilenceDetected(true);
      onSilence?.();
    }, SILENCE_THRESHOLD_MS);
  }, [onSilence]);

  // ── start() ─────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    if (!supported) return;

    // Clean up any previous instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }

    const rec = new SpeechRecognitionAPI();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    // Reset state
    finalTranscriptRef.current = "";
    hasSpeechRef.current = false;
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    setSilenceDetected(false);
    setNoSpeechTimeout(false);

    // ── Event handlers ───────────────────────────────────────────────────
    rec.onstart = () => {
      setListening(true);

      // Start the "no-speech at all" timeout
      noSpeechTimerRef.current = setTimeout(() => {
        if (!hasSpeechRef.current) {
          try { rec.stop(); } catch { /* ignore */ }
          setNoSpeechTimeout(true);
          onNoSpeech?.();
        }
      }, NO_SPEECH_TIMEOUT_MS);
    };

    rec.onresult = (e) => {
      hasSpeechRef.current = true;
      clearTimeout(noSpeechTimerRef.current); // cancel no-speech timeout

      let finalPart = "";
      let interimPart = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalPart += text + " ";
        } else {
          interimPart += text;
        }
      }

      if (finalPart) {
        finalTranscriptRef.current += finalPart;
        setTranscript(finalTranscriptRef.current.trim());
      }
      setInterimTranscript(interimPart);

      // Reset silence timer on every result event
      resetSilenceTimer();
    };

    rec.onerror = (e) => {
      clearTimers();
      setListening(false);

      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setPermissionDenied(true);
        setError(
          "Microphone access is blocked — check your browser's site settings and reload the page."
        );
      } else if (e.error === "no-speech") {
        // Handled by our own no-speech timer; ignore the browser's event
      } else if (e.error === "network") {
        setError("Network error — speech recognition requires an internet connection in some browsers.");
      } else if (e.error === "audio-capture") {
        setError("No microphone found — please connect a microphone and try again.");
      } else {
        setError(`Speech recognition error: ${e.error}`);
      }
    };

    rec.onend = () => {
      clearTimers();
      setListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = rec;

    try {
      rec.start();
    } catch (err) {
      setError("Failed to start speech recognition: " + err.message);
    }
  }, [supported, SpeechRecognitionAPI, resetSilenceTimer, clearTimers, onNoSpeech]);

  // ── stop() — manual stop ────────────────────────────────────────────────
  const stop = useCallback(() => {
    clearTimers();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
  }, [clearTimers]);

  // ── reset() — clear transcript ──────────────────────────────────────────
  const reset = useCallback(() => {
    finalTranscriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    setSilenceDetected(false);
    setNoSpeechTimeout(false);
  }, []);

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimers();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
    };
  }, [clearTimers]);

  return {
    start,
    stop,
    reset,
    supported,
    listening,
    transcript,
    interimTranscript,
    error,
    permissionDenied,
    silenceDetected,
    noSpeechTimeout,
  };
}

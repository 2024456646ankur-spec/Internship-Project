/**
 * useSpeechSynthesis.js
 * Custom hook for the Web Speech API SpeechSynthesis.
 *
 * Returns:
 *   speak(text)   — fires TTS, returns the utterance object
 *   cancel()      — stops current speech
 *   replay()      — re-fires last text
 *   supported     — boolean: is SpeechSynthesis available?
 *   speaking      — boolean: currently speaking?
 *   voicesReady   — boolean: voice list populated?
 */
import { useState, useEffect, useRef, useCallback } from "react";

export function useSpeechSynthesis() {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [speaking, setSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const voicesRef = useRef([]);
  const lastTextRef = useRef("");

  // ── Voice list population ───────────────────────────────────────────────
  // getVoices() often returns [] on first call — we must listen for
  // voiceschanged before the list is populated (Chrome / Edge behaviour).
  useEffect(() => {
    if (!supported) return;

    function populateVoices() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesRef.current = voices;
        setVoicesReady(true);
      }
    }

    populateVoices(); // Try immediately (Firefox resolves synchronously)

    window.speechSynthesis.addEventListener("voiceschanged", populateVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", populateVoices);
    };
  }, [supported]);

  // ── Voice selection ─────────────────────────────────────────────────────
  // Prefer: voices with "Google" or "Natural" in name (higher quality in Chrome).
  // Fallback: first English voice.
  // Final fallback: first available voice.
  const pickVoice = useCallback(() => {
    const voices = voicesRef.current;
    if (voices.length === 0) return null;

    // Priority 1: Google Natural (best on Chrome)
    const googleNatural = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") || v.name.includes("Natural"))
    );
    if (googleNatural) return googleNatural;

    // Priority 2: Any English voice
    const english = voices.find((v) => v.lang.startsWith("en"));
    if (english) return english;

    // Priority 3: Whatever is available
    return voices[0] ?? null;
  }, []);

  // ── speak() ─────────────────────────────────────────────────────────────
  const speak = useCallback(
    (text, { rate = 0.95, pitch = 1, onStart, onEnd, onBoundary } = {}) => {
      if (!supported) return null;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = "en-US";

      const voice = pickVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setSpeaking(true);
        onStart?.();
      };
      utterance.onend = () => {
        setSpeaking(false);
        onEnd?.();
      };
      utterance.onerror = () => {
        setSpeaking(false);
      };
      if (onBoundary) utterance.onboundary = onBoundary;

      lastTextRef.current = text;
      window.speechSynthesis.speak(utterance);
      return utterance;
    },
    [supported, pickVoice]
  );

  // ── cancel() ────────────────────────────────────────────────────────────
  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  // ── replay() ────────────────────────────────────────────────────────────
  const replay = useCallback(
    (opts) => {
      if (lastTextRef.current) speak(lastTextRef.current, opts);
    },
    [speak]
  );

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { speak, cancel, replay, supported, speaking, voicesReady };
}

"use client";

import { useEffect, useRef } from "react";

const INACTIVITY_LIMIT_MS = 5 * 60 * 1000;

export function StudioSessionGuard() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function clearCurrentTimeout() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    function logoutByInactivity() {
      window.location.href = "/studio/login";
    }

    function resetTimer() {
      clearCurrentTimeout();
      timeoutRef.current = setTimeout(logoutByInactivity, INACTIVITY_LIMIT_MS);
    }

    const events: Array<keyof WindowEventMap> = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ];

    resetTimer();

    events.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer, { passive: true });
    });

    return () => {
      clearCurrentTimeout();

      events.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, []);

  return null;
}
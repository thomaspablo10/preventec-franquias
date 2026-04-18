"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type EventData = {
  slug: string;
  title: string;
  hostName?: string | null;
  description?: string | null;
  eventDate: string;
  locationName: string;
  address: string;
  mapsUrl?: string | null;
};

type FormState = {
  name: string;
  phone: string;
  company: string;
  hasCompanion: "no" | "yes";
  companionName: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  company: "",
  hasCompanion: "no",
  companionName: "",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function generateDeviceToken() {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return `device-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

const CONFETTI = [
  { side: "left", x: "7%", y: "9%", size: 14, color: "#d9ab19" },
  { side: "left", x: "11%", y: "14%", size: 9, color: "#f3d36e" },
  { side: "left", x: "5%", y: "21%", size: 17, color: "#d9ab19" },
  { side: "left", x: "14%", y: "23%", size: 7, color: "#f3d36e" },
  { side: "left", x: "4%", y: "31%", size: 11, color: "#d9ab19" },
  { side: "left", x: "9%", y: "68%", size: 15, color: "#d9ab19" },
  { side: "left", x: "13%", y: "75%", size: 9, color: "#f3d36e" },
  { side: "left", x: "5%", y: "82%", size: 18, color: "#d9ab19" },
  { side: "left", x: "12%", y: "88%", size: 7, color: "#f3d36e" },
  { side: "right", x: "8%", y: "10%", size: 12, color: "#f3d36e" },
  { side: "right", x: "5%", y: "18%", size: 16, color: "#d9ab19" },
  { side: "right", x: "13%", y: "25%", size: 8, color: "#f3d36e" },
  { side: "right", x: "7%", y: "33%", size: 13, color: "#d9ab19" },
  { side: "right", x: "10%", y: "71%", size: 10, color: "#f3d36e" },
  { side: "right", x: "6%", y: "79%", size: 16, color: "#d9ab19" },
  { side: "right", x: "14%", y: "86%", size: 7, color: "#f3d36e" },
];

function GoldBow() {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        maxWidth: 300,
        filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.55))",
        overflow: "visible",
      }}
    >
      <defs>
        <radialGradient id="lgLeft" cx="60%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffe694" />
          <stop offset="35%" stopColor="#c8960d" />
          <stop offset="70%" stopColor="#7a4e00" />
          <stop offset="100%" stopColor="#3d1e00" />
        </radialGradient>
        <radialGradient id="lgRight" cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffe694" />
          <stop offset="35%" stopColor="#c8960d" />
          <stop offset="70%" stopColor="#7a4e00" />
          <stop offset="100%" stopColor="#3d1e00" />
        </radialGradient>
        <radialGradient id="lgKnot" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffe694" />
          <stop offset="50%" stopColor="#d4a015" />
          <stop offset="100%" stopColor="#6a3c00" />
        </radialGradient>
        <linearGradient id="lgTail" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8a818" />
          <stop offset="40%" stopColor="#ffe48a" />
          <stop offset="100%" stopColor="#7a4800" />
        </linearGradient>
        <linearGradient id="lgRibH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5a2e00" />
          <stop offset="12%" stopColor="#f5d96a" />
          <stop offset="28%" stopColor="#c08b10" />
          <stop offset="50%" stopColor="#ffe694" />
          <stop offset="72%" stopColor="#b07800" />
          <stop offset="88%" stopColor="#f0cf60" />
          <stop offset="100%" stopColor="#5a2e00" />
        </linearGradient>
        <filter id="loopShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="rgba(0,0,0,0.45)" />
        </filter>
      </defs>

      <rect x="0" y="82" width="320" height="20" rx="4" fill="url(#lgRibH)" />

      <g filter="url(#loopShadow)">
        <path
          d="M160 92 C140 80, 90 55, 50 38 C20 25, 5 30, 8 52 C11 72, 40 84, 70 88 C100 92, 135 90, 160 92Z"
          fill="url(#lgLeft)"
          stroke="rgba(255,220,100,0.22)"
          strokeWidth="0.8"
        />
        <path
          d="M155 91 C130 82, 85 62, 55 48 C40 41, 25 40, 22 50"
          stroke="rgba(255,240,160,0.45)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M145 91 C120 84, 78 68, 52 56 C38 50, 28 50, 28 58"
          stroke="rgba(80,40,0,0.28)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      <g filter="url(#loopShadow)">
        <path
          d="M160 92 C180 80, 230 55, 270 38 C300 25, 315 30, 312 52 C309 72, 280 84, 250 88 C220 92, 185 90, 160 92Z"
          fill="url(#lgRight)"
          stroke="rgba(255,220,100,0.22)"
          strokeWidth="0.8"
        />
        <path
          d="M165 91 C190 82, 235 62, 265 48 C280 41, 295 40, 298 50"
          stroke="rgba(255,240,160,0.45)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M175 91 C200 84, 242 68, 268 56 C282 50, 292 50, 292 58"
          stroke="rgba(80,40,0,0.28)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      <path
        d="M148 98 Q130 130 110 165 Q122 168 132 165 Q148 130 160 100Z"
        fill="url(#lgTail)"
        filter="url(#loopShadow)"
      />
      <path
        d="M153 100 Q137 130 118 163"
        stroke="rgba(255,240,150,0.40)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M172 98 Q190 130 210 165 Q198 168 188 165 Q172 130 160 100Z"
        fill="url(#lgTail)"
        filter="url(#loopShadow)"
      />
      <path
        d="M167 100 Q183 130 202 163"
        stroke="rgba(255,240,150,0.40)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <ellipse cx="160" cy="91" rx="22" ry="17" fill="url(#lgKnot)" filter="url(#loopShadow)" />
      <ellipse cx="157" cy="87" rx="9" ry="6" fill="rgba(255,240,160,0.35)" />
    </svg>
  );
}

export function InvitationExperience({ event }: { event: EventData }) {
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const [deviceToken, setDeviceToken] = useState("");
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const modalScrollRef = useRef<HTMLDivElement | null>(null);

  const confirmationStorageKey = useMemo(
    () => `invite_already_confirmed:${event.slug}`,
    [event.slug],
  );

  useEffect(() => {
    const storedToken = window.localStorage.getItem("invite_device_token");
    const storedConfirmed = window.localStorage.getItem(confirmationStorageKey);

    if (storedToken) {
      setDeviceToken(storedToken);
    } else {
      const newToken = generateDeviceToken();
      window.localStorage.setItem("invite_device_token", newToken);
      setDeviceToken(newToken);
    }

    if (storedConfirmed === "true") {
      setAlreadyConfirmed(true);
      setStatus({
        type: "success",
        message: "Presença confirmada!",
      });
    } else {
      setAlreadyConfirmed(false);
    }
  }, [confirmationStorageKey]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    let touchStartY = 0;

    const animateToTarget = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const tick = () => {
        setProgress((prev) => {
          const diff = targetRef.current - prev;
          if (Math.abs(diff) < 0.0008) {
            return targetRef.current;
          }
          const next = prev + diff * 0.12;
          rafRef.current = requestAnimationFrame(tick);
          return next;
        });
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const openEnvelope = () => {
      targetRef.current = 1;
      animateToTarget();
    };

    const closeEnvelope = () => {
      setIsOpen(false);
      targetRef.current = 0;
      animateToTarget();
    };

    const onWheel = (e: WheelEvent) => {
      if (!isOpen) {
        e.preventDefault();

        if (e.deltaY > 0) {
          openEnvelope();
        } else {
          targetRef.current = clamp(targetRef.current + e.deltaY / 400, 0, 1);
          animateToTarget();
        }

        return;
      }

      const target = e.target as Node | null;
      const isInsideModal =
        !!modalScrollRef.current && !!target && modalScrollRef.current.contains(target);

      if (!isInsideModal && e.deltaY < 0) {
        e.preventDefault();
        closeEnvelope();
        return;
      }

      if (isInsideModal && modalScrollRef.current) {
        const scrollEl = modalScrollRef.current;
        const atTop = scrollEl.scrollTop <= 0;

        if (e.deltaY < 0 && atTop) {
          e.preventDefault();
          closeEnvelope();
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const delta = touchStartY - currentY;
      touchStartY = currentY;

      if (!isOpen) {
        e.preventDefault();

        if (delta > 0) {
          openEnvelope();
        } else {
          targetRef.current = clamp(targetRef.current + delta / 220, 0, 1);
          animateToTarget();
        }

        return;
      }

      const target = e.target as Node | null;
      const isInsideModal =
        !!modalScrollRef.current && !!target && modalScrollRef.current.contains(target);

      if (!isInsideModal && delta < 0) {
        e.preventDefault();
        closeEnvelope();
        return;
      }

      if (isInsideModal && modalScrollRef.current) {
        const scrollEl = modalScrollRef.current;
        const atTop = scrollEl.scrollTop <= 0;

        if (delta < 0 && atTop) {
          e.preventDefault();
          closeEnvelope();
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (progress > 0.96 && !isOpen) {
      setIsOpen(true);
    }
  }, [progress, isOpen]);

  const frontRotation = clamp(progress / 0.52, 0, 1) * -180;
  const frontShadow = 0.32 - clamp(progress, 0, 1) * 0.2;
  const hintOpacity = isOpen ? 0 : 1 - clamp(progress / 0.35, 0, 1);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      timeZone: "America/Cuiaba",
    }).format(new Date(event.eventDate));
  }, [event.eventDate]);

  const formattedTime = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Cuiaba",
    }).format(new Date(event.eventDate));
  }, [event.eventDate]);

  const descriptionLines = useMemo(() => {
    if (!event.description?.trim()) {
      return [
        "Você está convidado para um momento especial.",
        "Sua presença será muito importante neste evento.",
      ];
    }

    return event.description
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }, [event.description]);

  const handleOpenClick = () => {
    targetRef.current = 1;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = () => {
      setProgress((prev) => {
        const diff = 1 - prev;
        if (Math.abs(diff) < 0.001) return 1;
        const next = prev + diff * 0.14;
        rafRef.current = requestAnimationFrame(tick);
        return next;
      });
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (alreadyConfirmed) {
      setStatus({
        type: "error",
        message: "Você já confirmou presença para este evento.",
      });
      return;
    }

    if (!deviceToken) {
      setStatus({
        type: "error",
        message: "Não foi possível identificar este dispositivo. Tente novamente.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: event.slug,
          name: form.name,
          phone: form.phone,
          company: form.company,
          hasCompanion: form.hasCompanion === "yes",
          companionName: form.hasCompanion === "yes" ? form.companionName.trim() : "",
          deviceToken,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        message?: string;
        alreadyConfirmed?: boolean;
      };

      if (!res.ok) {
        if (res.status === 409 || data.alreadyConfirmed) {
          window.localStorage.setItem(confirmationStorageKey, "true");
          setAlreadyConfirmed(true);
          throw new Error(data.error || "Você já enviou uma confirmação para este evento.");
        }

        throw new Error(data.error || "Não foi possível enviar sua confirmação.");
      }

      window.localStorage.setItem(confirmationStorageKey, "true");
      setAlreadyConfirmed(true);
      setForm(initialForm);
      setStatus({
        type: "success",
        message: data.message || "Confirmação enviada com sucesso.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Ocorreu um erro ao enviar sua confirmação.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@300;400;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          height: 100%;
          overflow: hidden;
        }

        .inv-root {
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: radial-gradient(circle at 50% 0%, #1a4db8 0%, #08245b 30%, #03112f 62%, #020917 100%);
          font-family: 'Montserrat', sans-serif;
          color: #fff; overflow: hidden;
        }

        .inv-root::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            repeating-linear-gradient(45deg, rgba(255,255,255,0.046) 0, rgba(255,255,255,0.046) 1px, transparent 1px, transparent 56px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.046) 0, rgba(255,255,255,0.046) 1px, transparent 1px, transparent 56px);
        }

        .marble-panel {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 110px;
          pointer-events: none;
          background: radial-gradient(circle at 50% 20%, rgba(255,255,255,0.96), rgba(248,248,248,0.88) 32%, rgba(214,214,214,0.45) 68%, rgba(255,255,255,0.96) 100%);
          opacity: 0.95;
          display: none;
        }

        .marble-panel.left { left: 0; }
        .marble-panel.right { right: 0; }

        @media (min-width: 768px) {
          .marble-panel { display: block; }
        }

        .card-wrap {
          position: relative;
          width: 92vw;
          max-width: 420px;
          height: 90vh;
          max-height: 760px;
        }

        @media (min-width: 600px) {
          .card-wrap { max-width: 480px; }
        }

        @media (min-width: 900px) {
          .card-wrap { max-width: 520px; }
        }

        .card-shell {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 28px;
          border: 1.5px solid rgba(200,154,16,0.55);
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.55);
          background:
            radial-gradient(ellipse at 10% 18%, rgba(230,230,230,0.60) 0%, transparent 40%),
            radial-gradient(ellipse at 88% 80%, rgba(210,210,210,0.35) 0%, transparent 38%),
            linear-gradient(160deg, #f6f6f4 0%, #eaeae8 40%, #f1f1ef 70%, #e6e6e4 100%);
        }

        .card-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(118deg, transparent 28%, rgba(170,170,170,0.13) 30%, transparent 32%),
            linear-gradient(198deg, transparent 44%, rgba(155,155,155,0.10) 46%, transparent 48%),
            linear-gradient(68deg, transparent 59%, rgba(190,190,190,0.09) 61%, transparent 63%);
          border-radius: 28px;
        }

        .card-shell::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #5a2e00, #f5d96a 28%, #c08b10 50%, #f0cf60 72%, #5a2e00);
          border-radius: 28px 28px 0 0;
          z-index: 5;
        }

        .gold-stripe-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #5a2e00, #f5d96a 28%, #c08b10 50%, #f0cf60 72%, #5a2e00);
          border-radius: 0 0 28px 28px;
          z-index: 5;
        }

        .invite-modal {
          position: absolute;
          inset: 0;
          z-index: 20;
          padding: 24px 18px 24px 22px;
          opacity: 0;
          pointer-events: none;
          transition: opacity .22s ease;
        }

        .invite-modal.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .invite-modal-scroll {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 4px;
          scrollbar-width: auto;
          scrollbar-color: #c8920e rgba(8,36,91,0.14);
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        .invite-modal-scroll::-webkit-scrollbar {
          width: 10px;
        }

        .invite-modal-scroll::-webkit-scrollbar-track {
          background: rgba(8,36,91,0.14);
          border-radius: 999px;
        }

        .invite-modal-scroll::-webkit-scrollbar-thumb {
          background: #c8920e;
          border-radius: 999px;
          border: 2px solid rgba(255,255,255,0.35);
        }

        @media (min-width: 480px) {
          .invite-modal {
            padding: 28px 24px 28px 28px;
          }
        }

        .heading-launch {
          font-size: clamp(11px, 3vw, 15px);
          font-weight: 300;
          letter-spacing: 0.22em;
          color: #c8920e;
          line-height: 1;
          margin-bottom: 3px;
          text-align: center;
        }

        .heading-brand {
          font-size: clamp(16px, 4.5vw, 24px);
          font-weight: 300;
          letter-spacing: 0.08em;
          color: #08245b;
          line-height: 1.1;
          margin-bottom: 10px;
          text-align: center;
        }

        .body-text {
          max-width: 330px;
          margin: 0 auto;
          font-size: clamp(11.5px, 3vw, 13.5px);
          line-height: 1.55;
          color: #1e2a4a;
          text-align: center;
        }

        .body-text p {
          margin-bottom: 8px;
        }

        .body-text p:last-child {
          margin-bottom: 0;
        }

        .event-block {
          border: 1px solid rgba(200,154,16,0.35);
          border-radius: 14px;
          background: rgba(8,36,91,0.07);
          padding: 10px 14px;
          margin: 14px auto 0;
          max-width: 320px;
        }

        .event-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: clamp(14px, 3.8vw, 17px);
          color: #08245b;
          font-weight: 600;
          margin-bottom: 7px;
        }

        .event-icon {
          color: #c8920e;
        }

        .event-location {
          font-size: clamp(11px, 2.8vw, 12.5px);
          line-height: 1.45;
          color: #2a2a2a;
          text-align: center;
        }

        .event-location strong {
          color: #c8920e;
          display: block;
          margin-bottom: 2px;
          font-size: clamp(11.5px, 3vw, 13px);
        }

        .event-location-link {
          text-decoration: none;
          color: inherit;
          display: block;
          transition: opacity .18s ease, transform .18s ease;
        }

        .event-location-link:hover {
          opacity: .82;
        }

        .event-location-hint {
          display: block;
          margin-top: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b6860d;
        }

        .form-section {
          border: 1px solid rgba(200,154,16,0.28);
          border-radius: 14px;
          background: rgba(8,36,91,0.05);
          padding: 11px 12px 24px;
          text-align: left;
          margin-top: 16px;
          margin-bottom: 24px;
        }

        .form-lbl {
          display: block;
          text-align: center;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c8920e;
          margin-bottom: 9px;
        }

        .fields {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field {
          height: 40px;
          width: 100%;
          border-radius: 10px;
          border: 1.5px solid rgba(200,154,16,0.32);
          background: rgba(255,255,255,0.93);
          padding: 0 12px;
          font-size: clamp(12px, 3.2vw, 13.5px);
          color: #0e244f;
          font-family: 'Montserrat', sans-serif;
          outline: none;
          transition: border-color .18s, box-shadow .18s;
        }

        .field::placeholder {
          color: #94a3b8;
        }

        .field:focus {
          border-color: #d6b146;
          box-shadow: 0 0 0 3px rgba(214,177,70,.20);
        }

        .companion-block {
          border-radius: 10px;
          border: 1.5px solid rgba(200,154,16,0.28);
          background: rgba(255,255,255,0.90);
          padding: 7px 12px;
          color: #0e244f;
        }

        .companion-lbl {
          display: block;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 4px;
        }

        .companion-radio-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .companion-radio-option {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 34px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
          color: #0e244f;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }

        .companion-radio-option input[type="radio"] {
          accent-color: #c8920e;
          width: 14px;
          height: 14px;
        }

        .submit-btn {
          width: 100%;
          height: 40px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.10em;
          color: #1d1a11;
          background: linear-gradient(90deg, #9a6603 0%, #f0d16c 45%, #d4a625 100%);
          transition: filter .2s, opacity .2s;
        }

        .submit-btn:hover:not(:disabled) {
          filter: brightness(1.07);
        }

        .submit-btn:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .status-box {
          margin-top: 8px;
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 12px;
        }

        .status-ok {
          background: rgba(16,185,129,.12);
          color: #065f46;
        }

        .status-err {
          background: rgba(239,68,68,.12);
          color: #7f1d1d;
        }

        .card-front {
          position: absolute;
          inset: 0;
          z-index: 30;
          transform-origin: top center;
          transform-style: preserve-3d;
          pointer-events: none;
        }

        .card-front-face {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          border: 1.5px solid rgba(200,154,16,0.68);
          background: linear-gradient(180deg, #1047b0 0%, #07317f 40%, #021339 100%);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        .card-front-face::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            repeating-linear-gradient(45deg, rgba(255,255,255,0.048) 0, rgba(255,255,255,0.048) 1px, transparent 1px, transparent 54px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.048) 0, rgba(255,255,255,0.048) 1px, transparent 1px, transparent 54px);
        }

        .cover-stripe-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #5a2e00, #f5d96a 28%, #c08b10 50%, #f0cf60 72%, #5a2e00);
          border-radius: 28px 28px 0 0;
        }

        .cover-stripe-bot {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #5a2e00, #f5d96a 28%, #c08b10 50%, #f0cf60 72%, #5a2e00);
          border-radius: 0 0 28px 28px;
        }

        .cover-convite {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Great Vibes', cursive;
          font-size: clamp(52px, 14vw, 80px);
          color: #e8c963;
          white-space: nowrap;
          text-shadow: 0 2px 18px rgba(0,0,0,0.35);
          letter-spacing: 3px;
        }

        .cover-ribbon {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(56% - 10px);
          height: 22px;
          background: linear-gradient(90deg, #5a2e00 0%, #f8e18a 18%, #cb9812 30%, #f5dd84 50%, #bc8509 70%, #f3d16b 84%, #5a2e00 100%);
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        }

        .cover-bow-wrap {
          position: absolute;
          left: 50%;
          top: 56%;
          transform: translate(-50%, -50%);
          width: clamp(210px, 64%, 300px);
          z-index: 5;
        }

        .dot {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10;
        }

        .cover-dim {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          background: #000;
          pointer-events: none;
        }

        .open-hint {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          pointer-events: auto;
          cursor: pointer;
          z-index: 40;
          background: none;
          border: none;
          padding: 0;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .open-hint-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.30em;
          text-transform: uppercase;
          color: rgba(232,208,122,0.95);
          text-shadow: 0 1px 6px rgba(0,0,0,0.5);
        }

        .open-hint-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          margin-top: 2px;
          animation: bounceUp 1.4s ease-in-out infinite;
        }

        .open-hint-arrow span {
          display: block;
          height: 2.5px;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent, #e8c963, transparent);
        }

        .open-hint-arrow span:nth-child(1) {
          width: 14px;
          opacity: 0.4;
        }

        .open-hint-arrow span:nth-child(2) {
          width: 18px;
          opacity: 0.7;
        }

        .open-hint-arrow span:nth-child(3) {
          width: 22px;
          opacity: 1;
        }

        .chevron-up {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 10px solid rgba(232,208,122,0.95);
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
          margin-bottom: 2px;
          animation: bounceUp 1.4s ease-in-out infinite;
        }

        @keyframes bounceUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div className="inv-root">
        <div className="marble-panel left" />
        <div className="marble-panel right" />

        <div className="card-wrap">
          <div className="card-shell">
            <div className="gold-stripe-bottom" />

            <div className={`invite-modal ${isOpen ? "is-open" : ""}`}>
              <div ref={modalScrollRef} className="invite-modal-scroll">
                <p className="heading-launch">CONVITE</p>
                <p className="heading-brand">{event.title}</p>

                <div className="body-text">
                  {descriptionLines.map((line, index) => (
                    <p key={`${line}-${index}`}>{line}</p>
                  ))}
                </div>

                <div className="event-block">
                  <div className="event-row">
                    <span className="event-icon">📅</span>
                    <span>{formattedDate}</span>
                    <span style={{ color: "rgba(8,36,91,0.32)" }}>|</span>
                    <span className="event-icon">🕐</span>
                    <span>{formattedTime}</span>
                  </div>

                  <div className="event-location">
                    <strong>{event.locationName}</strong>

                    {event.mapsUrl ? (
                      <a
                        href={event.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="event-location-link"
                      >
                        <span>{event.address}</span>
                        <span className="event-location-hint">
                          📍 Toque para abrir no mapa
                        </span>
                      </a>
                    ) : (
                      <span>{event.address}</span>
                    )}
                  </div>
                </div>

                <div className="form-section">
                  <span className="form-lbl">Confirmar presença</span>

                  {alreadyConfirmed ? (
                    <div
                      className="status-box status-ok"
                      style={{
                        marginTop: 0,
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      Você já confirmou presença para este evento.
                    </div>
                  ) : (
                    <form className="fields" onSubmit={handleSubmit}>
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, name: e.target.value }))
                        }
                        placeholder="Nome completo"
                        className="field"
                      />

                      <input
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            phone: formatPhone(e.target.value),
                          }))
                        }
                        placeholder="Telefone / WhatsApp"
                        inputMode="numeric"
                        className="field"
                      />

                      <input
                        required
                        value={form.company}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, company: e.target.value }))
                        }
                        placeholder="Empresa"
                        className="field"
                      />

                      <div className="companion-block">
                        <span className="companion-lbl">Acompanhante</span>

                        <div className="companion-radio-group">
                          <label className="companion-radio-option">
                            <input
                              type="radio"
                              name="hasCompanion"
                              value="no"
                              checked={form.hasCompanion === "no"}
                              onChange={(e) =>
                                setForm((s) => ({
                                  ...s,
                                  hasCompanion: e.target.value as "no" | "yes",
                                  companionName: "",
                                }))
                              }
                            />
                            <span>Não</span>
                          </label>

                          <label className="companion-radio-option">
                            <input
                              type="radio"
                              name="hasCompanion"
                              value="yes"
                              checked={form.hasCompanion === "yes"}
                              onChange={(e) =>
                                setForm((s) => ({
                                  ...s,
                                  hasCompanion: e.target.value as "no" | "yes",
                                }))
                              }
                            />
                            <span>Sim</span>
                          </label>
                        </div>
                      </div>

                      {form.hasCompanion === "yes" && (
                        <input
                          required
                          value={form.companionName}
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              companionName: e.target.value,
                            }))
                          }
                          placeholder="Nome do acompanhante"
                          className="field"
                        />
                      )}

                      <button type="submit" disabled={isSubmitting} className="submit-btn">
                        {isSubmitting ? "ENVIANDO..." : "CONFIRMAR PRESENÇA"}
                      </button>
                    </form>
                  )}

                  {status.type !== "idle" && (
                    <div
                      className={`status-box ${
                        status.type === "success" ? "status-ok" : "status-err"
                      }`}
                    >
                      {status.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="card-front"
              style={{
                transform: `perspective(1400px) rotateX(${frontRotation}deg)`,
              }}
            >
              <div className="card-front-face">
                {CONFETTI.map((item, index) => (
                  <span
                    key={`${item.side}-${index}`}
                    className="dot"
                    style={{
                      width: item.size,
                      height: item.size,
                      background: item.color,
                      [item.side]: item.x,
                      top: item.y,
                    }}
                  />
                ))}

                <div className="cover-stripe-top" />
                <div className="cover-convite">Convite</div>
                <div className="cover-ribbon" />
                <div className="cover-bow-wrap">
                  <GoldBow />
                </div>
                <div className="cover-stripe-bot" />
                <div className="cover-dim" style={{ opacity: frontShadow }} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenClick}
            className="open-hint"
            style={{ opacity: hintOpacity }}
          >
            <span className="chevron-up" />
            <span className="open-hint-arrow">
              <span />
              <span />
              <span />
            </span>
            <span className="open-hint-label">Abrir</span>
          </button>
        </div>
      </div>
    </>
  );
}
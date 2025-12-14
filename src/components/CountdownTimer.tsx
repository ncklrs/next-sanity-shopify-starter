"use client";

import { useState, useEffect } from "react";

export interface CountdownTimerProps {
  targetDate: Date | string;
  variant?: "default" | "compact" | "inline" | "full";
  textColor?: string;
  onComplete?: () => void;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
}

/**
 * CountdownTimer Component
 *
 * A versatile countdown timer with multiple display variants:
 * - default: Card-based layout with glass effect
 * - compact: Single-line format for announcement bars (e.g., "2d 12h 30m 45s")
 * - inline: Multi-segment inline format
 * - full: Large format for landing pages with animated backgrounds
 *
 * Features:
 * - Real-time countdown updates
 * - Customizable display units (days, hours, minutes, seconds)
 * - onComplete callback when timer expires
 * - Responsive and accessible
 */
export function CountdownTimer({
  targetDate,
  variant = "default",
  textColor = "text-[var(--foreground)]",
  onComplete,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (isExpired) return null;

  // Compact variant for announcement bar
  if (variant === "compact") {
    const units = [];
    if (showDays && timeLeft.days > 0) units.push(`${timeLeft.days}d`);
    if (showHours) units.push(`${String(timeLeft.hours).padStart(2, "0")}h`);
    if (showMinutes) units.push(`${String(timeLeft.minutes).padStart(2, "0")}m`);
    if (showSeconds) units.push(`${String(timeLeft.seconds).padStart(2, "0")}s`);

    return (
      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/20 border border-white/20 ${textColor} text-xs font-mono font-bold tracking-wider`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{units.join(" ")}</span>
      </div>
    );
  }

  // Inline variant
  if (variant === "inline") {
    const units = [];
    if (showDays && timeLeft.days > 0) units.push({ value: timeLeft.days, label: 'd' });
    if (showHours) units.push({ value: timeLeft.hours, label: 'h' });
    if (showMinutes) units.push({ value: timeLeft.minutes, label: 'm' });
    if (showSeconds) units.push({ value: timeLeft.seconds, label: 's' });

    return (
      <div className="inline-flex items-center gap-2">
        {units.map((unit, idx) => (
          <div key={idx} className="inline-flex items-baseline">
            <span className={`text-2xl font-bold ${textColor}`}>
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] ml-0.5">{unit.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Full variant for landing pages
  if (variant === "full") {
    const units = [];
    if (showDays) units.push({ value: timeLeft.days, label: "Days" });
    if (showHours) units.push({ value: timeLeft.hours, label: "Hours" });
    if (showMinutes) units.push({ value: timeLeft.minutes, label: "Minutes" });
    if (showSeconds) units.push({ value: timeLeft.seconds, label: "Seconds" });

    return (
      <div className="flex gap-4 md:gap-6 justify-center flex-wrap">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="relative">
              <div className="text-6xl md:text-7xl font-bold text-gradient transition-all duration-300">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-violet)]/20 rounded-2xl blur-xl -z-10 opacity-50" />
            </div>
            <div className="text-base md:text-lg text-[var(--foreground-muted)] uppercase tracking-widest mt-3 font-semibold">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card variant
  const units = [];
  if (showDays) units.push({ value: timeLeft.days, label: "Days" });
  if (showHours) units.push({ value: timeLeft.hours, label: "Hours" });
  if (showMinutes) units.push({ value: timeLeft.minutes, label: "Minutes" });
  if (showSeconds) units.push({ value: timeLeft.seconds, label: "Seconds" });

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {units.map((unit) => (
        <div key={unit.label} className="glass-card p-4 min-w-[80px] text-center">
          <div className="text-4xl font-bold text-gradient mb-1">
            {String(unit.value).padStart(2, "0")}
          </div>
          <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CountdownTimer;

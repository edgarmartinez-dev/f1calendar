'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: Date;
  label: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));

  return {
    days: Math.floor(totalSeconds / (3600 * 24)),
    hours: Math.floor((totalSeconds % (3600 * 24)) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function Countdown({ targetDate, label }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (targetDate.getTime() < new Date().getTime()) {
    return <div className="text-lg font-semibold text-red-500">Session Started!</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-base text-muted-foreground font-semibold uppercase tracking-wide">
        Until next session: {label}
      </div>
      <div className="flex gap-2 text-center">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds }
        ].map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-14 h-16 bg-background border rounded-lg text-2xl font-bold flex items-center justify-center">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs mt-1">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

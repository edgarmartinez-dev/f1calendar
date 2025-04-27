'use client';

import { races } from '@/lib/races';
import { Countdown } from '@/components/ui/countdown';
import { format } from 'date-fns';

function getRaceWeekInfo() {
  const today = new Date();

  for (let i = 0; i < races.length; i++) {
    const race = races[i];
    const raceDate = new Date(race.date);

    const raceWeekStart = new Date(raceDate);
    raceWeekStart.setDate(raceWeekStart.getDate() - 2);
    const raceWeekEnd = new Date(raceDate);
    raceWeekEnd.setDate(raceWeekEnd.getDate() + 1);

    if (today >= raceWeekStart && today <= raceWeekEnd) {
      return { race, isRaceWeek: true };
    }

    if (today < raceWeekStart) {
      return { race, isRaceWeek: false };
    }
  }

  return null;
}

function formatLocalDateParts(utcString: string) {
  const localDate = new Date(utcString);

  const datePart = localDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timePart = localDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const shortTimeZone = getShortTimeZone(timeZone);

  return { date: datePart, time: timePart, timezone: shortTimeZone };
}

function getShortTimeZone(timezone: string) {
  const map: { [key: string]: string } = {
    'America/New_York': 'EDT',
    'America/Los_Angeles': 'PDT',
    'America/Chicago': 'CDT',
    'America/Toronto': 'EDT',
    'Europe/London': 'BST',
    'Europe/Paris': 'CEST',
    'Asia/Tokyo': 'JST',
    'Australia/Melbourne': 'AEST',
  };
  return map[timezone] || timezone.split('/')[1] || timezone;
}



export function RaceWeekBanner() {
  const raceWeek = getRaceWeekInfo();

  if (!raceWeek) return null;

  const { race, isRaceWeek } = raceWeek;

  // Find next session
  const sessions = [
    { key: "practice1", label: "Practice 1" },
    { key: "practice2", label: "Practice 2" },
    { key: "practice3", label: "Practice 3" },
    { key: "qualifying", label: "Qualifying" },
    { key: "race", label: "Race" }
  ];

  const now = new Date();
  let nextSession: { label: string, date: Date } | null = null;

  for (const session of sessions) {
    const sessionTime = new Date(race.sessions[session.key as keyof typeof race.sessions]);
    if (sessionTime > now) {
      nextSession = {
        label: session.label,
        date: sessionTime,
      };
      break;
    }
  }
  // Find live session
let liveSessionKey: string | null = null;

for (const session of sessions) {
  const sessionTime = new Date(race.sessions[session.key as keyof typeof race.sessions]);
  if (now >= sessionTime && now <= new Date(sessionTime.getTime() + 60 * 60 * 1000)) { // Assume 1-hour session window
    liveSessionKey = session.key;
    break;
  }
}


  return (
    <div
  className={`w-full rounded-lg p-8 mb-8 border flex flex-col items-center text-center space-y-6 ${
    isRaceWeek
      ? 'bg-green-50 border-green-300'
      : 'bg-blue-50 border-blue-300'
  }`}
>

      {/* Race Name + Label */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <h2 className="text-3xl font-bold">
          {race.flag} {race.name}
        </h2>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            isRaceWeek ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
          }`}
        >
          {isRaceWeek ? 'CURRENT RACE WEEK' : 'NEXT RACE WEEK'}
        </span>
      </div>

      {/* Is it race week? */}
      <p className="text-2xl">
        Is it race week?{" "}
        <span className={isRaceWeek ? 'text-green-600' : 'text-blue-600'}>
          {isRaceWeek ? 'YES' : 'NO'}
        </span>
      </p>

      {/* Race Info */}
      <div className="space-y-2 text-sm max-w-md">
        <ul className="space-y-1">
        {sessions.map((session, idx) => {
  const sessionParts = formatLocalDateParts(race.sessions[session.key as keyof typeof race.sessions]);
  const isLive = session.key === liveSessionKey;
  const isNextSession = session.key === nextSession?.label.toLowerCase().replace(' ', '');

  return (
    <li key={idx} className="flex flex-col items-center">
      <div className="flex items-center gap-1 font-semibold">
        {/* 👉 NEXT pointer to the LEFT */}
        {isNextSession && !isLive && (
          <span className="flex items-center text-blue-600 text-xs">
            👉 <span className="ml-1">(Next session)</span>
          </span>
        )}

        {/* LIVE badge */}
        {isLive && (
          <span className="inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
            LIVE
          </span>
        )}

        {/* Session Title */}
        <span>{session.label}</span>
      </div>

      {/* Time */}
      <span className="text-muted-foreground">
        {sessionParts.date} - {sessionParts.time} {sessionParts.timezone}
      </span>
    </li>
  );
})}



        </ul>
      </div>

      {/* Countdown at bottom */}
      {nextSession && (
        <Countdown targetDate={nextSession.date} label={nextSession.label} />
      )}
    </div>
  );
}

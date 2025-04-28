'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { races } from '@/lib/races';
import { Countdown } from '@/components/ui/countdown';
import { format } from 'date-fns';
import { timezoneShortNames } from '@/lib/timezones';


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
  return timezoneShortNames[timezone] || timezone.split('/')[1] || timezone;
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
  let liveSessionKey: string | null = null;

  for (const session of sessions) {
    const sessionTime = new Date(race.sessions[session.key as keyof typeof race.sessions]);
    if (!nextSession && sessionTime > now) {
      nextSession = { label: session.label, date: sessionTime };
    }
    if (now >= sessionTime && now <= new Date(sessionTime.getTime() + 60 * 60 * 1000)) {
      liveSessionKey = session.key;
    }
  }

  return (
    <Card className="rounded-xl border bg-gradient-to-b from-muted/30 to-background shadow-md w-full mb-8">
      <CardHeader className="flex flex-col items-center text-center space-y-2">
        <CardTitle className="text-2xl md:text-4xl font-bold flex items-center gap-2">
          <span className="text-3xl md:text-5xl">{race.flag}</span>
          {race.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs md:text-sm font-semibold px-2.5 py-1 rounded-full ${
              isRaceWeek ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isRaceWeek ? 'CURRENT RACE WEEK' : 'NEXT RACE WEEK'}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground">
            {race.location}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Session List */}
        <div className="flex flex-col items-center">
          <ul className="space-y-3 w-full max-w-md">
            {sessions.map((session, idx) => {
              const sessionParts = formatLocalDateParts(race.sessions[session.key as keyof typeof race.sessions]);
              const isLive = session.key === liveSessionKey;
              const isNext = nextSession && session.label === nextSession.label;

              return (
                <li key={idx} className="flex flex-col items-center">
                  <div className="flex items-center gap-2 font-semibold">
                    {isNext && !isLive && (
                      <span className="flex items-center text-blue-600 text-xs">
                        👉 <span className="ml-1">(Next session)</span>
                      </span>
                    )}
                    {isLive && (
                      <span className="inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                    {session.label}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {sessionParts.date} - {sessionParts.time} {sessionParts.timezone}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Countdown */}
        {nextSession && (
          <div className="mt-6 flex justify-center">
            <Countdown targetDate={nextSession.date} label={nextSession.label} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

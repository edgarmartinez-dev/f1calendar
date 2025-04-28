'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { timezoneShortNames } from '@/lib/timezones';
interface Race {
  name: string;
  location: string;
  flag: string;
  date: string;
  sessions: {
    practice1: string;
    practice2: string;
    practice3: string;
    qualifying: string;
    race: string;
  };
}

interface RaceCardProps {
  race: Race;
  isCurrentRaceWeek: boolean;
  isNextRaceWeek: boolean;
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

export function RaceCard({ race, isCurrentRaceWeek, isNextRaceWeek }: RaceCardProps) {
  const now = new Date();
  const sessions = [
    { key: "practice1", label: "Practice 1" },
    { key: "practice2", label: "Practice 2" },
    { key: "practice3", label: "Practice 3" },
    { key: "qualifying", label: "Qualifying" },
    { key: "race", label: "Race" }
  ];

  let highlightClass = '';

  if (isCurrentRaceWeek) {
    highlightClass = 'border-green-300';
  } else if (isNextRaceWeek) {
    highlightClass = 'border-blue-300';
  }

  // LIVE detection
  let liveSessionKey: string | null = null;
  for (const session of sessions) {
    const sessionTime = new Date(race.sessions[session.key as keyof typeof race.sessions]);
    if (now >= sessionTime && now <= new Date(sessionTime.getTime() + 60 * 60 * 1000)) {
      liveSessionKey = session.key;
      break;
    }
  }

  return (
    <Card className={`h-full border ${highlightClass} shadow-sm hover:shadow-md hover:scale-[1.02] transition-all`}>
      <CardHeader className="pb-2 pt-4 flex flex-col items-center text-center">
        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
          <span className="text-2xl md:text-3xl">{race.flag}</span>
          <span className="font-bold">{race.name}</span>
        </CardTitle>
        <p className="text-xs md:text-sm text-muted-foreground">{race.location}</p>
      </CardHeader>

      <CardContent className="space-y-2 text-xs md:text-sm px-4 pb-4">
        <ul className="space-y-2">
          {sessions.map((session, idx) => {
            const sessionParts = formatLocalDateParts(race.sessions[session.key as keyof typeof race.sessions]);
            const isLive = session.key === liveSessionKey;

            return (
              <li key={idx} className="flex flex-col items-center">
                <div className="flex items-center gap-2 font-semibold">
                  {isLive && (
                    <span className="inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                  {session.label}
                </div>
                <div className="text-muted-foreground">
                  {sessionParts.date} - {sessionParts.time} {sessionParts.timezone}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

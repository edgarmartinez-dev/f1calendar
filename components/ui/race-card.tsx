'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export function RaceCard({ race, isCurrentRaceWeek, isNextRaceWeek }: RaceCardProps) {
  let highlightClass = '';

  if (isCurrentRaceWeek) {
    highlightClass = 'bg-green-50 border border-green-300';
  } else if (isNextRaceWeek) {
    highlightClass = 'bg-blue-50 border border-blue-300';
  }
  

  const now = new Date();
  const sessions = [
    { key: "practice1", label: "Practice 1" },
    { key: "practice2", label: "Practice 2" },
    { key: "practice3", label: "Practice 3" },
    { key: "qualifying", label: "Qualifying" },
    { key: "race", label: "Race" }
  ];

  // Detect live session
  let liveSessionKey: string | null = null;
  for (const session of sessions) {
    const sessionTime = new Date(race.sessions[session.key as keyof typeof race.sessions]);
    if (now >= sessionTime && now <= new Date(sessionTime.getTime() + 60 * 60 * 1000)) {
      liveSessionKey = session.key;
      break;
    }
  }

  return (
    <Card className={`h-full transition ${highlightClass}`}>
      <CardHeader className="pb-1 pt-3">
  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
    <span className="text-2xl md:text-3xl">{race.flag}</span>
    <span className="font-semibold">{race.name}</span>
  </CardTitle>
  <p className="text-sm md:text-base text-muted-foreground">{race.location}</p>
</CardHeader>

<CardContent className="space-y-1 text-sm md:text-base pb-3">
  <ul className="space-y-1">
          {sessions.map((session, idx) => {
            const sessionParts = formatLocalDateParts(race.sessions[session.key as keyof typeof race.sessions]);
            const isLive = session.key === liveSessionKey;

            return (
              <li key={idx} className="flex flex-col">
                <span className="font-semibold">
                  {session.label}
                  {isLive && (
                    <span className="ml-2 inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {sessionParts.date} - {sessionParts.time} {sessionParts.timezone}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

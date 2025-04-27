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

  return { date: datePart, time: timePart };
}

export function RaceCard({ race, isCurrentRaceWeek, isNextRaceWeek }: RaceCardProps) {
  let highlightClass = '';

  if (isCurrentRaceWeek) {
    highlightClass = 'bg-green-100 border border-green-400';
  } else if (isNextRaceWeek) {
    highlightClass = 'bg-blue-100 border border-blue-400';
  }

  return (
    <Card className={`h-full transition ${highlightClass}`}>
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-xl">{race.flag}</span>
          <span className="font-semibold">{race.name}</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{race.location}</p>
      </CardHeader>

      <CardContent className="space-y-1 text-xs pb-3">
        <ul className="space-y-1">
          {["practice1", "practice2", "practice3", "qualifying", "race"].map((sessionKey, idx) => {
            const session = formatLocalDateParts(race.sessions[sessionKey as keyof typeof race.sessions]);
            const labels = ["P1", "P2", "P3", "Q", "Race"];

            return (
              <li key={idx} className="flex justify-between">
                <span className="font-semibold">{labels[idx]}:</span>
                <div className="text-right">
                  <div>{session.date}</div>
                  <div className="text-muted-foreground">{session.time}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

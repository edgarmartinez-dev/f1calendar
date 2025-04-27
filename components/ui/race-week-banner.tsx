'use client';

import { races } from '@/lib/races';
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

  return { date: datePart, time: timePart };
}

export function RaceWeekBanner() {
  const raceWeek = getRaceWeekInfo();

  if (!raceWeek) return null;

  const { race, isRaceWeek } = raceWeek;

  return (
    <div
      className={`w-full rounded-lg p-6 mb-8 border ${
        isRaceWeek
          ? 'bg-green-100 border-green-400'
          : 'bg-blue-100 border-blue-400'
      }`}
    >
      <h2 className="text-2xl font-bold mb-2">
        {isRaceWeek ? "CURRENT RACE WEEK" : "NEXT RACE WEEK"}
      </h2>
      <p className="text-xl mb-4">
        Is it race week?{" "}
        <span className={isRaceWeek ? 'text-green-600' : 'text-blue-600'}>
          {isRaceWeek ? 'YES' : 'NO'}
        </span>
      </p>

      <div className="space-y-1 text-sm">
        <p><strong>{race.flag} {race.name}</strong> ({race.location})</p>
        <ul className="list-disc pl-4 space-y-2">
          {["practice1", "practice2", "practice3", "qualifying", "race"].map((sessionKey, idx) => {
            const session = formatLocalDateParts(race.sessions[sessionKey as keyof typeof race.sessions]);
            const labels = ["Practice 1", "Practice 2", "Practice 3", "Qualifying", "Race"];

            return (
              <li key={idx}>
                <span className="font-semibold">{labels[idx]}:</span>{" "}
                {session.date} - <span className="text-muted-foreground">{session.time}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

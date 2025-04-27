'use client';

import { races } from '@/lib/races';
import { RaceWeekBanner } from '@/components/ui/race-week-banner';
import { RaceCard } from '@/components/ui/race-card';
import { Separator } from '@/components/ui/separator';


function getCurrentOrNextRace() {
  const today = new Date();

  for (let i = 0; i < races.length; i++) {
    const race = races[i];
    const raceDate = new Date(race.date);

    const raceWeekStart = new Date(raceDate);
    raceWeekStart.setDate(raceWeekStart.getDate() - 2);
    const raceWeekEnd = new Date(raceDate);
    raceWeekEnd.setDate(raceWeekEnd.getDate() + 1);

    if (today >= raceWeekStart && today <= raceWeekEnd) {
      return { raceIndex: i, isRaceWeek: true };
    }

    if (today < raceWeekStart) {
      return { raceIndex: i, isRaceWeek: false };
    }
  }

  return { raceIndex: -1, isRaceWeek: false };
}



export default function Home() {
  const today = new Date();
  const { raceIndex: specialRaceIndex, isRaceWeek } = getCurrentOrNextRace();

  return (
    <main className="p-4 space-y-6">
      <RaceWeekBanner />

      <h1 className="text-2xl font-bold tracking-tight mb-2">F1 2025 Calendar</h1>
      <p className="text-sm text-muted-foreground">Times shown in your local timezone</p>

      <Separator />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {races.map((race, index) => {
          const isCurrentRaceWeek = index === specialRaceIndex && isRaceWeek;
          const isNextRaceWeek = index === specialRaceIndex && !isRaceWeek;

          return (
            <RaceCard
              key={index}
              race={race}
              isCurrentRaceWeek={isCurrentRaceWeek}
              isNextRaceWeek={isNextRaceWeek}
            />
          );
        })}
      </div>
    </main>
  );
}

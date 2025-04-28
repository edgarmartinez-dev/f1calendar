'use client';

import { races } from '@/lib/races';
import { RaceWeekBanner } from '@/components/ui/race-week-banner';
import { RaceCard } from '@/components/ui/race-card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

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

  // Split into upcoming and past races
  const upcomingRaces = races.filter(race => new Date(race.date) >= today);
  const pastRaces = races.filter(race => new Date(race.date) < today);

  return (
    <main className="p-4 space-y-6">
      <RaceWeekBanner />

      <h1 className="text-2xl font-bold tracking-tight mb-2">F1 2025 Calendar</h1>
      <p className="text-sm text-muted-foreground">Times shown in your local timezone</p>

      <Separator />

      <Tabs defaultValue="upcoming" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        {/* UPCOMING RACES */}
        <TabsContent value="upcoming">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">

            {upcomingRaces.map((race, index) => {
              const raceIndex = races.indexOf(race);
              const isCurrentRaceWeek = raceIndex === specialRaceIndex && isRaceWeek;
              const isNextRaceWeek = raceIndex === specialRaceIndex && !isRaceWeek;

              return (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RaceCard
                  key={index}
                  race={race}
                  isCurrentRaceWeek={isCurrentRaceWeek}
                  isNextRaceWeek={isNextRaceWeek}
                />
                 </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* PAST RACES */}
        <TabsContent value="past">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          
            {pastRaces.map((race, index) => (
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RaceCard
                key={index}
                race={race}
                isCurrentRaceWeek={false}
                isNextRaceWeek={false}
              />
              </motion.div>
            ))}
            
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

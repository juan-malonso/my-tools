'use client';

import { useState } from 'react';

import { Card, CreateButton } from '@packages/components';

import { type Stint, type Driver, type Lap } from '@/models';

import { StintBlock } from './StintBlock';
import { HeartFilledIcon, HeartStrokedIcon, PageIcon } from '../icons';

const timeToMs = (time: string): number => {
  if (!time || !time.includes(':') || !time.includes('.')) return Infinity;
  const parts = time.split(/[:.]/);
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  const milliseconds = parseInt(parts[2], 10);

  if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
    return Infinity;
  }

  return minutes * 60000 + seconds * 1000 + milliseconds;
};

const msToTime = (ms: number): string => {
  if (ms === Infinity || ms === 0 || isNaN(ms)) return '0:00.000';

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  const pad = (num: number, length: number) => num.toString().padStart(length, '0');

  return `${minutes.toFixed()}:${pad(seconds, 2)}.${pad(milliseconds, 3)}`;
};
export interface DriverCardProps {
  id: string;
  driver: Driver;
  setDriver: (driverId: string, driver: Driver) => void;
}

export function DriverCard({ id, driver, setDriver }: DriverCardProps) {
  const [pinned, setPin] = useState(driver.pin);

  const { team, stints } = driver;

  const updatePin = () => {
    setPin(!pinned);
    setDriver(id, { ...driver, pin: !pinned });
  };

  const addStint = () => {
    setDriver(id, {
      ...driver,
      stints: [
        ...stints,
        {
          laps: [],
          compound: 'C1',
          time: 0
        } as Stint
      ]
    });
  };

  const updateStint = (index: number, stint?: Stint) => {
    setDriver(id, {
      ...driver,
      stints: driver.stints
        .map<Stint | undefined>((s, i) => (i === index ? stint : s))
        .filter((s): s is Stint => s !== undefined)
    });
  };

  const allLaps: Lap[] = stints.flatMap((stint) => stint.laps);
  const bestLapMs = allLaps.length > 0 ? Math.min(...allLaps.map((l) => timeToMs(l.time))) : 0;
  const bestLap = msToTime(bestLapMs);

  return (
    <Card
      icon={<PageIcon className={`w-15 h-15 text-${team.color}`} />}
      title={
        <div className="items-center w-full">
          <div className={`uppercase text-xs text-${team.color}`}>{team.name}</div>
          <h2 className="text-xl font-bold tracking-tight">
            <span className="text-gray-400">#{driver.number}</span> {driver.name}
          </h2>
          <div className="text-gray-400 text-xs">Best: {bestLap}</div>
        </div>
      }
      className={`border-b-4 border-${team.color} w-[350px]`}
      actions={
        <div className="flex items-center ml-auto">
          <CreateButton
            text={
              pinned ? (
                <HeartFilledIcon className="w-5 h-5 text-pink-500" />
              ) : (
                <HeartStrokedIcon className="w-5 h-5 text-pink-500" />
              )
            }
            onClick={updatePin}
            className={`hover:bg-transparent bg-transparent roudend-xl`}
          />
        </div>
      }
    >
      <div className={`flex flex-col space-y-2 h-full overflow-y-auto`}>
        {stints.map((stint, index) => (
          <StintBlock key={index} index={index} stint={stint} updateStint={updateStint} />
        ))}

        <button
          className="px-3 py-1 rounded-md border-2 border-dashed border-gray-400 text-gray-400"
          onClick={addStint}
        >
          + Stint
        </button>
      </div>
    </Card>
  );
}

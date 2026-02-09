import React from 'react';

import { Card, DeleteButton, Form, Input, SelectInput } from '@packages/components';

import { type Lap, type Stint } from '@/models';

export interface StintBlockProps {
  stint: Stint;
  index: number;
  updateStint: (index: number, stint?: Stint) => void;
}

export function StintBlock({ stint, index, updateStint }: StintBlockProps) {
  const addLap = () => {
    updateStint(index, {
      ...stint,
      laps: [...stint.laps, { time: '', sectors: [] }]
    });
  };

  const changeLap = (lapIndex: number, lap: Lap) => {
    updateStint(index, {
      ...stint,
      laps: stint.laps.map((l, i) => (i === lapIndex ? lap : l))
    });
  };

  const delLap = (lap: number) => {
    updateStint(index, {
      ...stint,
      laps: stint.laps.filter((_, i) => i !== lap)
    });
  };

  return (
    <Card
      title={`Stint ${(index + 1).toFixed(0)}`}
      background="bg-gray-600"
      className="border-gray-800"
      actions={
        <DeleteButton
          onClick={() => {
            updateStint(index);
          }}
        />
      }
    >
      <Form className={'grid-cols-[30%_auto]'}>
        <SelectInput
          label="Compound"
          defaultValue={stint.compound}
          options={['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'I', 'W']}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const compound = e.target.value as 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'I' | 'W';
            updateStint(index, { ...stint, compound });
          }}
        />
      </Form>

      <Form cols={3} className={'grid-cols-[30%_auto_auto]'}>
        {stint.laps.map((lap, index) => (
          <TimeInput key={index} index={index} lap={lap} changeLap={changeLap} delLap={delLap} />
        ))}
      </Form>

      <button
        className="w-full px-3 py-1 rounded-md border-2 border-dashed border-gray-400 text-gray-400"
        onClick={addLap}
      >
        + Lap
      </button>
    </Card>
  );
}

const dateStyle = 'bg-gray-900 border border-gray-700 w-full rounded-md px-2 py-1 appearance-none';

function TimeInput({
  index,
  lap,
  changeLap,
  delLap
}: {
  index: number;
  lap: Lap;
  changeLap: (index: number, lap: Lap) => void;
  delLap: (lap: number) => void;
}) {
  const [min, sec, ms]: (string | undefined)[] = React.useMemo(
    () => lap.time.split(/[:.]/),
    [lap.time]
  );

  const minRef = React.useRef<HTMLInputElement>(null);
  const secRef = React.useRef<HTMLInputElement>(null);
  const msRef = React.useRef<HTMLInputElement>(null);

  const updateLapTime = (newMin: string, newSec = '', newMs = '') => {
    const newLap = { ...lap, time: `${newMin}:${newSec}.${newMs}` };
    changeLap(index, newLap);
  };

  return (
    <>
      <Input label={`Lap ${(index + 1).toFixed(0)}`}>
        <div className="flex items-center gap-1">
          <input
            ref={minRef}
            type={'text'}
            className={`${dateStyle} w-8`}
            value={min}
            maxLength={1}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              updateLapTime(val, sec, ms);
              if (val.length === 1 && secRef.current) {
                secRef.current.focus();
              }
            }}
          />
          :
          <input
            ref={secRef}
            type={'text'}
            className={`${dateStyle} w-10`}
            value={sec}
            maxLength={2}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              updateLapTime(min, val, ms);
              if (val.length === 2 && msRef.current) {
                msRef.current.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && sec.length === 0 && minRef.current) {
                minRef.current.focus();
              }
            }}
          />
          .
          <input
            ref={msRef}
            type={'text'}
            className={`${dateStyle} `}
            value={ms}
            maxLength={3}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              updateLapTime(min, sec, val);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && ms.length === 0 && secRef.current) {
                secRef.current.focus();
              }
            }}
          />
        </div>
      </Input>

      <DeleteButton
        onClick={() => {
          delLap(index);
        }}
      />
    </>
  );
}

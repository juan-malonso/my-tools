'use client';
import React from 'react';

import {
  Card,
  DeleteButton,
  DownloadIcon,
  Form,
  Modal,
  NumberInput,
  SelectInput
} from '@packages/components';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { type Stint, type Driver, type Lap } from '@/models';

interface Serie {
  driver?: string;
  stint?: number;
  offset: number;
  data: { number: number; label: string }[];
}

// sourcery skip: binary-operator-identity
function chartName(driver?: string, stint?: number) {
  return `${driver ?? '___'} - ${stint !== undefined && stint >= 0 ? `Stint ${(stint + 1).toFixed(0)}` : '___'}`;
}

function stintName(index: number, stint: Stint) {
  return `Stint ${(index + 1).toString()} - ${stint.compound}`;
}

function SerieCard({
  data,
  serie,
  setSeries
}: {
  data: Record<string, Driver>;
  serie: Serie;
  setSeries: (series?: Serie) => void;
}) {
  const driverData: Driver = data[serie.driver ?? ''] ?? { stints: [] };
  const stintData: Stint[] = driverData.stints;

  const drivers: { label: string; value: string }[] = [
    { label: '-', value: '' },
    ...Object.entries(data)
      .filter(([, { stints }]) => stints.length > 0)
      .map(([k]) => ({ label: k, value: k }))
  ];

  const stints: { label: string; value: string }[] = [
    { label: '-', value: '-1' },
    ...stintData.map((d, i) => ({ label: stintName(i, d), value: i.toFixed() }))
  ];

  const setData = ({ driver, stint, offset }: Serie) => {
    const driverData: Driver = data[driver ?? ''] ?? { stints: [] };
    const stintData: Stint = driverData.stints[stint ?? -1] ?? { laps: [] };
    const lapsData: Lap[] = stintData.laps;
    setSeries({
      driver,
      stint,
      offset,
      data: lapsData.map(({ time }) => {
        const [min, sec, ms]: (string | undefined)[] = time.split(/[:.]/);

        const mmin = Number(min || '0') * 60000;
        const msec = Number(sec || '0') * 1000;
        const mms = Number(ms || '0');

        const num = mmin + msec + mms + offset * 1000;

        const dmin = Math.floor(num / 60000);
        const dsec = Math.floor((num % 60000) / 1000);
        const dms = Math.floor(num % 1000);

        return { number: num, label: `${dmin.toFixed(0)}:${dsec.toFixed(0)}.${dms.toFixed(0)}` };
      })
    });
  };

  return (
    <Card
      title={chartName(serie.driver, serie.stint)}
      actions={
        <DeleteButton
          onClick={() => {
            setSeries();
          }}
        />
      }
    >
      <Form>
        <SelectInput
          label="Drivers"
          options={drivers}
          defaultValue={serie.driver ?? ''}
          onChange={(e) => {
            setData({
              ...serie,
              driver: e.target.value || undefined,
              stint: undefined
            });
          }}
        />
        <SelectInput
          label={'Stint'}
          options={stints}
          defaultValue={(serie.stint ?? -1).toString()}
          onChange={(e) => {
            setData({
              ...serie,
              stint: e.target.value === '' ? undefined : Number(e.target.value)
            });
          }}
        />
        <NumberInput
          label="Offset (sec)"
          defaultValue={serie.offset}
          step={0.001}
          onChange={(e) => {
            setData({
              ...serie,
              offset: Number(e.target.value)
            });
          }}
        />
      </Form>
    </Card>
  );
}

const ChartView = ({ series }: { series: Serie[] }) => {
  const dataFlat = series.flatMap((s) => s.data.map((d) => d.number));
  const dataMin = Math.min(...dataFlat);
  const dataMax = Math.max(...dataFlat);

  const desv = (dataMax - dataMin) * 0.1;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="index"
            allowDuplicatedCategory={false}
            allowDecimals={false}
            minTickGap={2}
            tickFormatter={(tick) => {
              return `Lap ${tick + 1}`;
            }}
            domain={[0, (dataMax: number) => Math.floor(dataMax * 1.1)]}
            type="number"
            label={{ value: 'Lap', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            dataKey="number"
            tickFormatter={(tick) => {
              const dmin = Math.floor(tick / 60000);
              const dsec = Math.floor((tick % 60000) / 1000);
              const dms = Math.floor(tick % 1000);

              const pad = (num: number, length: number) => num.toString().padStart(length, '0');

              return `${pad(dmin, 1)}:${pad(dsec, 2)}.${pad(dms, 3)}`;
            }}
            domain={[(dataMin: number) => dataMin - desv, (dataMax: number) => dataMax + desv]}
            label={{ value: 'Time', angle: -90, position: 'insideLeft', offset: -25 }}
          />
          <Tooltip
            labelFormatter={(index) => `Lap ${index + 1}`}
            formatter={(value: unknown, name: unknown) => {
              if (typeof value !== 'number') return '';

              const dmin = Math.floor(value / 60000);
              const dsec = Math.floor((value % 60000) / 1000);
              const dms = Math.floor(value % 1000);

              const pad = (num: number, length: number) => num.toString().padStart(length, '0');

              return [`${pad(dmin, 1)}:${pad(dsec, 2)}.${pad(dms, 3)}`, name] as any;
            }}
          />
          <Legend wrapperStyle={{ paddingBottom: 10, paddingTop: 20 }} />
          {series.map((s, i) => (
            <Line
              key={i}
              type="linear"
              data={s.data.map((d, j) => ({ ...d, index: j }))}
              dataKey="number"
              name={chartName(s.driver, s.stint)}
              stroke={`hsl(${(i * 137.5).toFixed(0)}, 50%, 50%)`}
              dot={true}
              strokeWidth={3}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface ChartModalProps {
  drivers: Record<string, Driver>;
  onClose: () => void;
}

export function ChartModal({ drivers, onClose }: ChartModalProps) {
  const [series, setSeries] = React.useState<Serie[]>([]);

  return (
    <Modal onClose={onClose} title={'Comparator'} className="h-full w-full">
      <div className="h-full w-full flex gap-5 p-5 overflow-x-auto">
        <div className="bg-gray-900 rounded-lg h-full w-[500px] flex flex-col p-5 gap-5">
          <div className="flex gap-5">
            <button
              className="w-full px-3 py-1 rounded-md border-2 border-dashed border-gray-400 text-gray-400"
              onClick={() => {
                setSeries([
                  ...series,
                  { driver: undefined, stint: undefined, offset: 0, data: [] }
                ]);
              }}
            >
              + Serie
            </button>
          </div>
          <div className="h-full flex flex-col gap-3 overflow-x-auto">
            {series.map((serie, index) => (
              <SerieCard
                key={index}
                data={drivers}
                serie={serie}
                setSeries={(serie?: Serie) => {
                  if (serie) setSeries(series.map((s, i) => (i === index ? serie : s)));
                  else setSeries(series.filter((_, i) => i !== index));
                }}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg h-full w-full p-3 min-w-0">
          <ChartView series={series} />
        </div>
      </div>
    </Modal>
  );
}

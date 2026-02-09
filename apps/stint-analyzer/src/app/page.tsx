'use client';

import { useState, useRef } from 'react';

import { CreateButton } from '@packages/components';
import { BodyGrid } from '@packages/layout';
import Script from 'next/script';
import * as XLSX from 'xlsx';

import { Body } from '@/components/body';
import { ChartIcon, HeartFilledIcon, HeartStrokedIcon, PageIcon } from '@/components/icons';
import { useAppContext } from '@/context';
import { type Driver, type Stint } from '@/models';

export default function Page() {
  const [pinned, filterPinned] = useState<boolean>(false);
  const { drivers, setDrivers } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chartOpen, setChartOpen] = useState(false);

  const exportDrivers = handleExport(drivers);
  const importDrivers = handleImport(drivers, setDrivers);

  return (
    <BodyGrid
      headName="Stint Analyzer"
      headIcon="/favicon.ico"
      headStyles={<Script src="https://cdn.tailwindcss.com" />}
      headerTitle={
        <div className="flex items-center gap-2 p-3">
          <PageIcon />
          <h1 className="text-xl font-bold tracking-tight">
            Stint<span className="text-pink-500"> Analyzer</span>
          </h1>
        </div>
      }
      headerActions={
        <div className="flex items-center gap-2 p-5">
          <CreateButton
            text={<ChartIcon className="w-5 h-5 text-gray-400" />}
            onClick={() => {
              setChartOpen(true);
            }}
            className={`hover:bg-transparent bg-transparent roudend-xl px-0 mr-2`}
          ></CreateButton>
          <CreateButton
            text={
              pinned ? (
                <HeartFilledIcon className="w-5 h-5 text-gray-300" />
              ) : (
                <HeartStrokedIcon className="w-5 h-5 text-gray-300" />
              )
            }
            onClick={() => {
              filterPinned(!pinned);
            }}
            className={`hover:bg-transparent bg-transparent roudend-xl px-0 mr-2`}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={importDrivers}
            style={{ display: 'none' }}
            accept=".xlsx, .xls"
          />
          <CreateButton
            text={'Import'}
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-400"
          />
          <CreateButton
            text={'Export'}
            onClick={exportDrivers}
            className="bg-green-500 hover:bg-green-400"
          />
        </div>
      }
    >
      <Body
        pinned={pinned}
        chartOpen={chartOpen}
        onChartClose={() => {
          setChartOpen(false);
        }}
      />
    </BodyGrid>
  );
}

function validateDate(dateString?: string) {
  if (!dateString) return '';

  const [min, sec, msec]: (string | undefined)[] = dateString.split(/[:.]/);

  const fmin = (min || '').padStart(1, '0');
  const fsec = (sec || '').padStart(2, '0');
  const fmsec = (msec || '').padEnd(3, '0');

  return `${fmin}.${fsec}.${fmsec}`;
}

function handleExport(drivers: Record<string, Driver>) {
  return () => {
    const workbook = XLSX.utils.book_new();
    Object.entries(drivers).forEach(([id, driver]) => {
      const { stints } = driver;
      const sheetData = [[driver.name], [driver.team.name], []];

      const compoundRow = ['Compound'];
      stints.forEach((stint) => compoundRow.push(stint.compound));
      sheetData.push(compoundRow);

      for (let i = 0; i < 50; i++) {
        const lapRow = [`Lap ${(i + 1).toFixed(0)}`];
        stints.forEach((stint) => {
          lapRow.push(validateDate(stint.laps[i]?.time));
        });
        sheetData.push(lapRow);
      }

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, id);
    });

    XLSX.writeFile(workbook, 'stints.xlsx');
  };
}

function handleImport(
  drivers: Record<string, Driver>,
  setDrivers: (driverId: string, driver: Driver) => void
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const newDriversData = { ...drivers };

      workbook.SheetNames.forEach((sheetName) => {
        const driverId = sheetName;
        const worksheet = workbook.Sheets[sheetName];
        const aoa = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

        const driverName = aoa[0][0];
        const newStints: Stint[] = [];
        const compoundRow = aoa[3];

        for (let c = 1; c < compoundRow.length; c++) {
          const compound = compoundRow[c];
          if (!compound) continue;
          const laps = [];
          for (let r = 4; r < 54; r++) {
            if (aoa[r]?.[c]) {
              laps.push({ time: aoa[r][c], sectors: [] });
            }
          }
          newStints.push({
            compound: compound as 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'I' | 'W',
            laps: laps,
            time: 0
          });
        }

        const driverData = newDriversData[driverId];
        driverData.name = driverName;
        driverData.stints = newStints;

        setDrivers(driverId, driverData);
      });
    };

    reader.readAsArrayBuffer(file);
  };
}

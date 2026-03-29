'use client';

import { BodyGrid } from '@packages/layout';
import Script from 'next/script';

import { FloatingActions, PageIcon, SettingIcon, SettingsModal, TaskPlanner } from '@/components';
import { usePlannerState } from '@/hooks';

export default function Page() {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    iniDate,
    setIniDate,
    endDate,
    setEndDate,
    defaultBadgeKey,
    setDefaultBadgeKey,
    baseUrl,
    setBaseUrl,
    version,
    setVersion,
    imports,
    config,
    setImports,
    handleExport,
    handleImport,
    handleConfigChange,
    handleConfigExport
  } = usePlannerState();

  return (
    <BodyGrid
      headName="Screen Wall"
      headIcon="/favicon.ico"
      headStyles={<Script src="https://cdn.tailwindcss.com" />}
      headerTitle={
        <div className="flex items-center justify-between w-full p-3">
          <div className="flex items-center gap-2">
            <PageIcon className="w-6 h-6 text-sky-500" />
            <h1 className="text-xl font-bold tracking-tight">
              Team<span className="text-sky-500"> Time</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
            >
              Export
            </button>
            <label className="px-3 py-1 bg-sky-600 text-white rounded text-sm hover:bg-sky-500 cursor-pointer">
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <span className="px-2" />
            <button
              onClick={() => {
                setIsSettingsOpen(true);
              }}
              className="px-1 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
            >
              <SettingIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      }
    >
      <TaskPlanner config={config} imports={imports} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
        }}
        version={version}
        setVersion={setVersion}
        config={config}
        onConfigChange={handleConfigChange}
        onConfigExport={handleConfigExport}
        iniDate={iniDate}
        setIniDate={setIniDate}
        endDate={endDate}
        setEndDate={setEndDate}
        defaultBadgeKey={defaultBadgeKey}
        setDefaultBadgeKey={setDefaultBadgeKey}
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
      />
      <FloatingActions
        onGoToToday={() => {
          setImports(imports + 1);
        }}
      />
    </BodyGrid>
  );
}

import React from 'react';
import { FormField, Input } from '@component/forms';

import { SettingIcon } from '@/components';

interface GeneralSettingsProps {
  iniDate: Date;
  setIniDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  defaultBadgeKey: string;
  setDefaultBadgeKey: (key: string) => void;
  baseUrl?: string;
  setBaseUrl: (url: string) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  iniDate,
  setIniDate,
  endDate,
  setEndDate,
  defaultBadgeKey,
  setDefaultBadgeKey,
  baseUrl,
  setBaseUrl
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center m-2">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
          <SettingIcon className="w-6 h-6 text-sky-500" />
          General Settings
        </h3>
      </div>
      <hr className="border-slate-600" />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
          <div className="space-y-2">
            <h3 className="text-lg text-slate-300">Date Settings</h3>
            <div className="grid grid-cols-3 gap-6 p-2">
              <FormField label="Start Date">
                <Input
                  type="date"
                  size="sm"
                  value={iniDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    if (e.target.value) setIniDate(new Date(e.target.value));
                  }}
                />
              </FormField>
              <FormField label="End Date">
                <Input
                  type="date"
                  size="sm"
                  value={endDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    if (e.target.value) setEndDate(new Date(e.target.value));
                  }}
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
          <div className="space-y-2">
            <h3 className="text-lg text-slate-300">Task Settings</h3>
            <div className="grid grid-cols-3 gap-6 p-2">
              <FormField label="Default Badge Key">
                <Input
                  type="text"
                  size="sm"
                  value={defaultBadgeKey}
                  onChange={(e) => {
                    setDefaultBadgeKey(e.target.value);
                  }}
                />
              </FormField>
              <FormField label="Base URL">
                <Input
                  type="text"
                  size="sm"
                  value={baseUrl}
                  onChange={(e) => {
                    setBaseUrl(e.target.value);
                  }}
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

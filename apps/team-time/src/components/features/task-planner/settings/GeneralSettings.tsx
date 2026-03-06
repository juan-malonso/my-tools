import React from 'react';

interface GeneralSettingsProps {
  iniDate: Date;
  setIniDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  defaultBadgeKey: string;
  setDefaultBadgeKey: (key: string) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  iniDate,
  setIniDate,
  endDate,
  setEndDate,
  defaultBadgeKey,
  setDefaultBadgeKey
}) => {
  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
      <h3 className="text-2xl font-semibold text-white mb-6">General Settings</h3>
      <hr className="border-slate-600" />
      <div className="flex flex-col gap-8">
        <div className="grid gap-2">
          <h3 className="text-lg text-slate-400">Date Settings</h3>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              type="date"
              label="Start Date"
              value={iniDate.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) setIniDate(new Date(e.target.value));
              }}
            />
            <InputField
              type="date"
              label="End Date"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) setEndDate(new Date(e.target.value));
              }}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg text-slate-400">Task Settings</h3>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              type="text"
              label="Default Badge Key"
              value={defaultBadgeKey}
              onChange={(e) => {
                setDefaultBadgeKey(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ type, label, value, onChange }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-2 py-1 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
      />
    </div>
  );
};

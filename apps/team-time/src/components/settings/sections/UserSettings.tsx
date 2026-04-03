import React from 'react';
import { ColorPicker, CreateButton, DeleteButton, FormField, Input } from '@component/forms';

import { PageIcon } from '@/components/icons';
import { type Member, type Utils } from '@/models';

interface UserSettingsProps {
  members: Utils<Member>;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ members }) => {
  const addMember = () => {
    members.add({
      id: crypto.randomUUID(),
      name: 'New Member',
      title: 'New Title',
      color: '#ef4444',
      schedule: [true, true, true, true, true, false, false],
      absences: []
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center m-2">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
          <PageIcon className="w-6 h-6 text-sky-500" />
          User Management
        </h3>
        <CreateButton size="sm" onClick={addMember}>
          Add Member
        </CreateButton>
      </div>
      <hr className="border-slate-600" />
      <div className="space-y-3">
        {members.values.map((member) => (
          <UserRow
            key={member.id}
            member={member}
            setMember={members.set}
            delMember={members.del}
          />
        ))}
      </div>
    </div>
  );
};

const UserRow: React.FC<{
  member: Member;
  setMember: (m: Member) => void;
  delMember: (m: string) => void;
}> = ({ member, setMember, delMember }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div
      className={`
        group p-3 gap-3 flex items-center
        bg-slate-900 hover:bg-slate-900/50
        rounded-lg border border-slate-900 hover:border-slate-600
        transition-all duration-200
      `}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex-grow flex items-center gap-3">
          <ColorPicker
            value={member.color}
            size="md"
            className="border border-slate-600"
            onChange={(color) => {
              setMember({ ...member, color });
            }}
          />
          <Input
            value={member.name}
            size="sm"
            className="w-full"
            placeholder="Member name"
            onChange={(e) => {
              setMember({ ...member, name: e.target.value });
            }}
          />
          <Input
            value={member.title}
            size="sm"
            className="w-full"
            placeholder="Member title"
            onChange={(e) => {
              setMember({ ...member, title: e.target.value });
            }}
          />
          <DeleteButton
            onClick={() => {
              delMember(member.id);
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="w-1/2 flex">
            <FormField label={'Schedule'}>
              <div className="flex items-center gap-2">
                {member.schedule.map((isWorking, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setMember({
                          ...member,
                          schedule: member.schedule.map((bool, i) => (i === index ? !bool : bool))
                        });
                      }}
                      className={`w-1/7 p-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                        isWorking
                          ? 'bg-sky-600 text-white hover:bg-sky-500'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {days[index]}
                    </button>
                  );
                })}
              </div>
            </FormField>
          </div>
          <div className="w-1/2" />
        </div>
      </div>
    </div>
  );
};

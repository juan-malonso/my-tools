import React from 'react';

import { FormField } from '@component/forms';
import { CreateButton, DeleteButton } from '@component/forms/buttons';
import { ColorPicker } from '@component/forms/colors';
import { Input } from '@component/forms/inputs';

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
      schedule: [8, 8, 8, 8, 8, 0, 0]
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center m-2">
        <h3 className="text-2xl font-semibold text-white">User Management</h3>
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
          {member.schedule.map((hours, index) => (
            <FormField key={index} label={days[index]} className="w-16">
              <Input
                type="number"
                value={hours}
                size="sm"
                className="w-16"
                step={0.1}
                onChange={(e) => {
                  const newSchedule = [...member.schedule];
                  newSchedule[index] = Number(e.target.value) || 0;
                  setMember({
                    ...member,
                    schedule: newSchedule
                  });
                }}
              />
            </FormField>
          ))}
        </div>
      </div>
    </div>
  );
};

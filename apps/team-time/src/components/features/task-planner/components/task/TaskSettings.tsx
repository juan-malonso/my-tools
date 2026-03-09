import React from 'react';

import { CreateButton, DeleteButton, Input, Textarea } from '@component/forms';

import { type Task, type Ticket } from '@/models';

export const TaskSettings: React.FC<{
  task: Task;
  setTask: (t: Task) => void;
  defaultBadgeKey: string;
}> = ({ task, setTask, defaultBadgeKey }) => {
  const addTicket = () => {
    const ticket: Ticket = { id: defaultBadgeKey, title: '' };
    setTask({ ...task, ticket: [...task.ticket, ticket] });
  };

  const removeTicket = (index: number) => {
    setTask({ ...task, ticket: task.ticket.filter((_, i) => index !== i) });
  };

  const updateTicket = (index: number, update: Ticket) => {
    setTask({
      ...task,
      ticket: task.ticket.map((t, i) => (index === i ? update : t))
    });
  };

  return (
    <div className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
      <div className="flex gap-2 items-center justify-between">
        <Input
          value={task.title}
          size="sm"
          placeholder="Task title"
          onChange={(e) => {
            setTask({ ...task, title: e.target.value });
          }}
        />
        <CreateButton onClick={addTicket} size="sm" className="text-nowrap">
          Add Badge
        </CreateButton>
      </div>

      <Textarea
        value={task.description}
        size="sm"
        placeholder="Task description"
        className="h-full"
        onChange={(e) => {
          setTask({ ...task, description: e.target.value });
        }}
        rows={7}
      />

      {task.ticket.map((ticket, index) => (
        <TicketSettings
          key={index}
          index={index}
          ticket={ticket}
          updateTicket={updateTicket}
          removeTicket={removeTicket}
        />
      ))}
    </div>
  );
};

const TicketSettings: React.FC<{
  index: number;
  ticket: Ticket;
  updateTicket: (index: number, update: Ticket) => void;
  removeTicket: (index: number) => void;
}> = ({ index, ticket, updateTicket, removeTicket }) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={ticket.id}
        size="sm"
        className="w-20"
        placeholder="ID"
        onChange={(e) => {
          updateTicket(index, { ...ticket, id: e.target.value });
        }}
      />
      <Input
        value={ticket.title}
        size="sm"
        className="w-full"
        placeholder="Description"
        onChange={(e) => {
          updateTicket(index, { ...ticket, title: e.target.value });
        }}
      />
      <DeleteButton
        size="md"
        onClick={() => {
          removeTicket(index);
        }}
      />
    </div>
  );
};

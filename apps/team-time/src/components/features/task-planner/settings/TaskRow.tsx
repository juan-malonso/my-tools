import React from 'react';

import { DeleteIcon } from '@/components/common/icons';
import { type Task, type Ticket } from '@/models';

export const TaskRow: React.FC<{
  task: Task;
  setTask: (t: Task) => void;
  defaultBadgeKey: string;
}> = ({ task, setTask, defaultBadgeKey }) => {
  const addTicket = () => {
    const existingIds = task.ticket
      .map((t) => t.id)
      .filter((id) => id.startsWith(defaultBadgeKey))
      .map((id) => parseInt(id.split('-')[1] ?? '0', 10))
      .filter((n) => !isNaN(n));

    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    const ticket: Ticket = {
      id: `${defaultBadgeKey}-${String(nextNum).padStart(3, '0')}`,
      title: ''
    };
    setTask({ ...task, ticket: [...task.ticket, ticket] });
  };

  const removeTicket = (index: number) => {
    setTask({ ...task, ticket: task.ticket.filter((_, i) => index === i) });
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
        <input
          value={task.title}
          onChange={(e) => {
            setTask({ ...task, title: e.target.value });
          }}
          className={`
                w-full px-1
                bg-transparent text-white text-lg font-bold
                border border-slate-700 rounded
              `}
          placeholder="Task title"
        />
        <button
          onClick={addTicket}
          className={`
                px-2 py-1.5
                bg-sky-600 hover:bg-sky-500  rounded
                text-white text-xs text-nowrap
              `}
        >
          Add Badge
        </button>
      </div>

      <textarea
        value={task.description}
        onChange={(e) => {
          setTask({ ...task, description: e.target.value });
        }}
        className={`
              w-full p-1
              bg-transparent text-slate-400 text-sm
              border border-slate-700 rounded
            `}
        placeholder="Task description"
        rows={5}
      />

      {task.ticket.map((ticket, index) => (
        <TicketRow
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

const TicketRow: React.FC<{
  index: number;
  ticket: Ticket;
  updateTicket: (index: number, update: Ticket) => void;
  removeTicket: (index: number) => void;
}> = ({ index, ticket, updateTicket, removeTicket }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={ticket.id}
        onChange={(e) => {
          updateTicket(index, { ...ticket, id: e.target.value });
        }}
        className="w-20 bg-slate-900/50 border border-slate-700 rounded p-1 text-xs text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
        placeholder="Badge ID"
      />
      <input
        type="text"
        value={ticket.title}
        onChange={(e) => {
          updateTicket(index, { ...ticket, title: e.target.value });
        }}
        className="w-full bg-slate-900/50 border border-slate-700 rounded p-1 text-xs text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
        placeholder="Description"
      />
      <button
        onClick={() => {
          removeTicket(index);
        }}
        className="p-1 text-slate-500 hover:text-red-400"
      >
        <DeleteIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

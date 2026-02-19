import React, { useState, useEffect, type DragEvent } from 'react';

import type { Allocation, Config, Member, Task, Utils } from '@/models';

import { CellBox, CreateMemberBox, MemberBox } from './task-table';
import { getDates, type ItemDate, CELL_H, DATE_H, CELL_W } from './utils';

const CELL_WIDTH = 120;

interface Resize {
  allocationId: string;
  direction: 'left' | 'right';
  startX: number;
  initialSpan: number;
  initialDateIndex: number;
}

interface Over {
  m: string;
  d: string;
  o: boolean;
  s: number;
}

interface BodyTaskProps {
  config: Config;
}

export const BodyTaskTable: React.FC<BodyTaskProps> = ({ config }) => {
  const { general, members, allocations, modules, tasks } = config;

  const dates = getDates(general.iniDate, general.endDate);
  const [resizing, setResizing] = useResize(dates, allocations);
  const [handleDrag, handleDrop, dragged] = useDrag(dates, allocations);

  const [isOver, setIsOver] = useState<Over | null>(null);

  const addTask = (memberId: string, date: ItemDate) => () => {
    const task: Task = {
      id: Math.random().toString(16).slice(2, 10),
      title: 'Nueva Tarea',
      description: 'Descripción por defecto',
      ticket: []
    };

    const allocation: Allocation = {
      id: Math.random().toString(16).slice(2, 10),

      iniDate: date.label,
      span: 1,

      memberId,
      moduleId: '',
      taskId: task.id
    };

    tasks.add(task);
    allocations.add(allocation);

    console.log('addTask', memberId, date);
  };

  const addMember = () => {
    const member: Member = {
      id: Math.random().toString(16).slice(2, 10),
      name: 'New Member'
    };
    members.add(member);
  };

  return (
    <table className={`h-full w-full rounded-2xl`}>
      <tbody>
        {members.values.map((member, i) => {
          const memberTasks = allocations.values.filter((a) => a.memberId === member.id);

          let span = 0;

          return (
            <tr
              key={i}
              className={`divide-x-2 w-full border-b-2 border-slate-500`}
              style={{ height: CELL_H, width: CELL_W * dates.length }}
            >
              <MemberBox key={i} member={member} />
              {dates.map((date, j) => {
                const allocation = memberTasks.find((a) => a.iniDate === date.label);

                const task = allocation?.span ?? 0;
                span = Math.max(span, task, 0) - 1;

                const hasTask = task > 0;
                const isResizing = !!resizing;
                const isSpanded = task !== span + 1;
                const isDragged = allocation?.id === dragged?.id;

                const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                };

                const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  if (member.id !== isOver?.m || date.label !== isOver.d) {
                    setIsOver({
                      m: member.id,
                      d: date.label,
                      s: dragged?.span ?? 0,
                      o: isCellOcupied(dates, allocations.values, {
                        id: dragged?.id ?? '',
                        memberId: member.id,
                        iniDate: date.label,
                        span: dragged?.span ?? 0
                      })
                    });
                  }
                };

                const handleDropEvent = (e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  setIsOver(null);
                  handleDrop(e, member.id, date.label);
                };

                return (
                  <td
                    key={j}
                    className={`border-transparent`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDrop={handleDropEvent}
                  >
                    <div style={{ height: CELL_H, width: CELL_W }}>
                      {!(isResizing || isSpanded) || hasTask ? (
                        <CellBox
                          allocation={allocation}
                          modules={modules.values}
                          tasks={tasks.values}
                          addTask={addTask(member.id, date)}
                          onDrag={handleDrag}
                          onResize={(e, allocationId, direction) => {
                            if (allocation) {
                              setResizing({
                                allocationId,
                                direction,
                                startX: e.clientX,
                                initialSpan: allocation.span,
                                initialDateIndex: j
                              });
                            }
                          }}
                          isResizing={isResizing}
                          isDragged={isDragged}
                          isOver={{
                            enable: member.id === isOver?.m && date.label === isOver.d,
                            block: isOver?.o ?? false,
                            span: isOver?.s ?? 0
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}

        <tr className={`w-full`} style={{ height: DATE_H }}>
          <CreateMemberBox onClick={addMember} />
          <td colSpan={1 + dates.length} />
        </tr>

        <tr />
      </tbody>
    </table>
  );
};

function useResize(
  dates: ItemDate[],
  allocations: Utils<Allocation>
): [Resize | null, React.Dispatch<React.SetStateAction<Resize | null>>] {
  const [resizing, setResizing] = useState<Resize | null>(null);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const steps = Math.round((e.clientX - resizing.startX) / CELL_WIDTH);

      const allocation = allocations.values.find((a) => a.id === resizing.allocationId);
      if (!allocation) return;

      switch (resizing.direction) {
        case 'left': {
          const init = resizing.initialDateIndex + steps;
          const span = resizing.initialSpan - steps;

          if (span < 1 || init < 0 || init + span > dates.length) return;

          const newAllocation = { ...allocation, span, iniDate: dates[init].label };
          if (isCellOcupied(dates, allocations.values, newAllocation)) return;

          allocations.set(newAllocation);
          break;
        }
        case 'right': {
          const span = resizing.initialSpan + steps;

          if (span < 1 || resizing.initialDateIndex + span > dates.length) return;

          const newAllocation = { ...allocation, span };
          if (isCellOcupied(dates, allocations.values, newAllocation)) return;

          allocations.set(newAllocation);
          break;
        }
      }
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, dates, allocations]);

  return [resizing, setResizing];
}

const getSpanDates = (dates: ItemDate[], date: string, span: number) => {
  const dateIndex = dates.findIndex((d) => d.label === date);
  return dates.slice(dateIndex, dateIndex + span);
};

const isCellOcupied = (
  dates: ItemDate[],
  allocations: Allocation[],
  allocation: { id: string; memberId: string; iniDate: string; span: number }
) => {
  const draggedDates = getSpanDates(dates, allocation.iniDate, allocation.span);

  console.log(allocation);
  return allocations.some((a) => {
    if (a.memberId !== allocation.memberId || a.id === allocation.id) return false;
    const aDates = getSpanDates(dates, a.iniDate, a.span);
    return draggedDates.some((d) => aDates.includes(d));
  });
};

function useDrag(
  dates: ItemDate[],
  allocations: Utils<Allocation>
): [
  (e: DragEvent<HTMLDivElement>, allocation: Allocation) => void,
  (e: DragEvent<HTMLDivElement>, memberId: string, iniDate: string) => void,
  Allocation | undefined
] {
  const [dragged, setDragged] = useState<Allocation | undefined>(undefined);

  const handleDrag = (e: DragEvent<HTMLDivElement>, allocation: Allocation) => {
    setDragged(allocation);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, memberId: string, iniDate: string) => {
    e.preventDefault();
    if (dragged) {
      const allocation = allocations.values.find((a) => a.id === dragged.id);
      if (!allocation) return;

      const newAllocation = { ...allocation, memberId, iniDate };
      if (isCellOcupied(dates, allocations.values, newAllocation)) {
        setDragged(undefined);
        return;
      }

      allocations.set({ ...allocation, memberId, iniDate });
      setDragged(undefined);
    }
  };

  return [handleDrag, handleDrop, dragged];
}

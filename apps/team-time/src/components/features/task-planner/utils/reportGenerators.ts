/** ============================================================================
 * --- Name --------------------------------------------------------------------
 * @file reportGenerators.ts
 *
 * --- Description -------------------------------------------------------------
 * @description Handles the generation of markdown-formatted weekly reports
 * based on task allocations, members, and modules.
 *
 * --- Functions ---------------------------------------------------------------
 * - Dates and Format: calculateTaskDates, formatTaskHeader, formatTaskTickets, formatTaskEntry
 * - Reports: generateWeeklyReport
 * - Utilities: calculateTaskHours
 * ========================================================================= */

import type { ItemDate } from './dateUtils';

import type { Allocation, Member, Module, Task } from '@/models';

import { getWeekNumber } from './dateUtils';

/**
 * Calculates the display dates and continuation flags for a task within a specific week.
 *
 * @param {Allocation} allocation - The allocation object.
 * @param {Date} weekStart - The start date of the week.
 * @param {Date} weekEnd - The end date of the week.
 * @returns {Object} An object containing display start/end dates and continuation flags.
 */
function calculateTaskDates(allocation: Allocation, weekStart: Date, weekEnd: Date) {
  const taskStart = new Date(allocation.iniDate);
  const taskEnd = new Date(taskStart);
  taskEnd.setDate(taskStart.getDate() + allocation.span - 1);

  const wStart = new Date(weekStart);
  wStart.setHours(0, 0, 0, 0);
  const wEnd = new Date(weekEnd);
  wEnd.setHours(0, 0, 0, 0);
  const tStart = new Date(taskStart);
  tStart.setHours(0, 0, 0, 0);
  const tEnd = new Date(taskEnd);
  tEnd.setHours(0, 0, 0, 0);

  const isContinuation = tStart < wStart;
  const isContinuing = tEnd > wEnd;

  const displayStart = isContinuation ? wStart : tStart;
  const displayEnd = isContinuing ? wEnd : tEnd;

  return { displayStart, displayEnd, isContinuation, isContinuing };
}

/**
 * Formats the markdown header for a task based on its visible date range in the week.
 *
 * @param {Date} displayStart - The visible start date for the task.
 * @param {Date} displayEnd - The visible end date for the task.
 * @returns {string} The formatted markdown header string.
 */
function formatTaskHeader(displayStart: Date, displayEnd: Date) {
  const startDay = displayStart.toLocaleDateString('en-US', { weekday: 'long' });
  const endDay = displayEnd.toLocaleDateString('en-US', { weekday: 'long' });
  const isSameDay = displayStart.getTime() === displayEnd.getTime();

  const dateRangeStr = isSameDay
    ? displayStart.toLocaleDateString()
    : `${displayStart.toLocaleDateString()} - ${displayEnd.toLocaleDateString()}`;

  let header = `### ${startDay}`;
  if (!isSameDay) {
    header += ` - ${endDay}`;
  }
  header += ` (${dateRangeStr})`;

  return header;
}

/**
 * Formats the list of Jira/Ticket links associated with a task.
 *
 * @param {Task['ticket']} ticket - The array of tickets attached to the task.
 * @param {string} [baseUrl] - The base URL for the ticketing system.
 * @returns {string} The formatted markdown list of tickets.
 */
function formatTaskTickets(ticket: Task['ticket'], baseUrl?: string) {
  if (ticket.length === 0) return '';

  const formattedTickets = ticket
    .filter((t) => t.id)
    .map((t) => {
      const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/${t.id}` : null;
      const key = url ? t.id : `\`${t.id}\``;
      return `    - ${key}${t.title ? `: ${t.title}` : ''}`;
    })
    .join('\n');

  return formattedTickets ? `${formattedTickets}\n` : '';
}

interface FormatTaskEntryOptions {
  allocation: Allocation;
  task: Task;
  mod?: Module;
  start: Date;
  end: Date;
  baseUrl?: string;
}

/**
 * Formats a single task entry (header and body) for the markdown report.
 *
 * @param {FormatTaskEntryOptions} options - The formatting options and task data.
 * @returns {Object} An object containing the `header` and `body` strings.
 */
function formatTaskEntry({ allocation, task, mod, start, end, baseUrl }: FormatTaskEntryOptions) {
  const { displayStart, displayEnd, isContinuation, isContinuing } = calculateTaskDates(
    allocation,
    start,
    end
  );

  const header = formatTaskHeader(displayStart, displayEnd);

  let body = `- **[${mod?.name ?? '---'}]** ${task.title}`;

  const flags = [];
  if (isContinuation) flags.push('Continuation');
  if (isContinuing) flags.push('Continues');

  if (flags.length > 0) {
    body += ` _(${flags.join(', ')})_`;
  }
  body += `\n`;

  if (task.description) {
    // Add two spaces before each newline for a <br> effect in Markdown,
    // and prepend subsequent lines with the blockquote marker and indentation.
    const desc = task.description.replace(/\n/g, '  \n    > ');
    body += `    > ${desc}\n`;
  }

  body += formatTaskTickets(task.ticket, baseUrl);

  return { header, body };
}

/**
 * Generates a comprehensive weekly report in Markdown format.
 *
 * @param {Object} data - The required data to generate the report.
 * @param {ItemDate[]} data.weekDates - The dates contained in the selected week.
 * @param {Member[]} data.members - The list of team members.
 * @param {Allocation[]} data.allocations - The list of task allocations.
 * @param {Task[]} data.tasks - The list of tasks.
 * @param {Module[]} data.modules - The list of project modules.
 * @param {string} [data.baseUrl] - Optional base URL for tickets.
 * @returns {string} The complete markdown report string.
 */
export const generateWeeklyReport = ({
  weekDates,
  members,
  allocations,
  tasks,
  modules,
  baseUrl
}: {
  weekDates: ItemDate[];
  members: Member[];
  allocations: Allocation[];
  tasks: Task[];
  modules: Module[];
  baseUrl?: string;
}): string => {
  const start = weekDates[0].date;
  const end = weekDates[weekDates.length - 1].date;
  const startTime = start.getTime();
  const endTime = end.getTime() + 24 * 60 * 60 * 1000;

  const weekNum = getWeekNumber(start);
  let text = `# Planning Week ${weekNum.toString()}: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}\n`;

  members.forEach((member) => {
    const memberAllocations = allocations.filter((a) => {
      if (a.memberId !== member.id) return false;
      const aStart = new Date(a.iniDate).getTime();
      const aEnd = aStart + a.span * 24 * 60 * 60 * 1000;
      return aStart < endTime && aEnd > startTime;
    });

    text += `## ${member.name}\n\n`;

    if (memberAllocations.length > 0) {
      memberAllocations.sort((a, b) => a.iniDate.localeCompare(b.iniDate));
      let lastHeader = '';

      memberAllocations.forEach((allocation) => {
        const task = tasks.find((t) => t.id === allocation.taskId);
        const mod = modules.find((m) => m.id === allocation.moduleId);

        if (task) {
          const { header, body } = formatTaskEntry({
            allocation,
            task,
            mod,
            start,
            end,
            baseUrl
          });

          if (header !== lastHeader) {
            text += `${header}\n`;
            lastHeader = header;
          }
          text += body;
        }
      });
    } else {
      text += `_No tasks assigned_\n`;
    }
    text += `\n`;
  });

  return text;
};

/**
 * Calculates the total scheduled hours for a member during a specific allocation.
 *
 * @param {Allocation} allocation - The task allocation.
 * @param {Member} member - The team member assigned to the allocation.
 * @returns {number} The total calculated hours.
 */
export function calculateTaskHours(allocation: Allocation, member: Member): number {
  let total = 0;
  const startDate = new Date(allocation.iniDate);
  for (let i = 0; i < allocation.span; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    const dayIndex = current.getDay();
    const scheduleIndex = (dayIndex + 6) % 7;
    total += member.schedule[scheduleIndex] || 0;
  }
  return total;
}

import type { ItemDate } from '../../utils';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Textarea, CloseButton } from '@component/forms';
import { Modal } from '@component/surfaces';
import { marked } from 'marked';

import type { Allocation, Member, Module, Task } from '@/models';

export const ReportModal: React.FC<{
  text: string;
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
}> = ({ text, isModalOpen, setIsModalOpen }) => {
  const [value, setValue] = useState(text);
  const [previewValue, setPreviewValue] = useState(text);
  const [copiedSection, setCopiedSection] = useState<'editor' | 'preview' | null>(null);

  const isProcessing = value !== previewValue;

  const lastUpdateRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const latestValueRef = useRef(value);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (copiedSection) {
      const timer = setTimeout(() => {
        setCopiedSection(null);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [copiedSection]);

  useEffect(() => {
    setValue(text);
    setPreviewValue(text);
  }, [text]);

  useEffect(() => {
    if (timeoutRef.current) return;
    if (value === previewValue) return;

    const now = Date.now();
    const timeSinceLast = now - lastUpdateRef.current;
    const cooldown = 3000;
    const reactionTime = 2000;

    const remainingCooldown = cooldown - timeSinceLast;
    const delay = Math.max(reactionTime, remainingCooldown);

    timeoutRef.current = setTimeout(() => {
      setPreviewValue(latestValueRef.current);
      lastUpdateRef.current = Date.now();
      timeoutRef.current = null;
    }, delay);
  }, [value, previewValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const htmlPreview = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return { __html: marked.parse(previewValue) as string };
  }, [previewValue]);

  const handleCopyMarkdown = () => {
    setCopiedSection('editor');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(value);
  };

  const handleCopyPreview = () => {
    if (!previewRef.current) return;
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(previewRef.current);
    selection.removeAllRanges();
    selection.addRange(range);
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand('copy');
    selection.removeAllRanges();

    setCopiedSection('preview');
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
      }}
      header={
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Weekly Report</h2>
        </div>
      }
      body={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center">
              <div className="text-xs font-bold text-slate-500 uppercase">Editor</div>
              <CloseButton
                onClick={handleCopyMarkdown}
                className={copiedSection === 'editor' ? 'text-green-500' : ''}
              >
                {copiedSection === 'editor' ? 'Copied!' : 'Copy Markdown'}
              </CloseButton>
            </div>
            <Textarea
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              className="font-mono text-xs flex-1 resize-none !bg-slate-700"
            />
          </div>
          <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-slate-500 uppercase">Preview</div>
                {isProcessing && (
                  <svg
                    className="animate-spin h-3 w-3 text-slate-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
              </div>
              <CloseButton
                onClick={handleCopyPreview}
                className={copiedSection === 'preview' ? 'text-green-500' : ''}
              >
                {copiedSection === 'preview' ? 'Copied!' : 'Copy HTML'}
              </CloseButton>
            </div>
            <div
              ref={previewRef}
              className={`
                  flex-1 p-4 rounded-lg bg-slate-800 border border-slate-700 
                  text-xs text-slate-300 leading-relaxed
                  
                  /* Títulos */
                  [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h1]:mt-2
                  [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-100 [&_h2]:mb-3 [&_h2]:mt-4
                  
                  /* Listas */
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1
                  
                  /* Formato de texto */
                  [&_strong]:text-white [&_strong]:font-bold
                  [&_code]:bg-slate-900 [&_code]:px-1 [&_code]:rounded [&_code]:text-sky-400 [&_code]:font-mono
                  
                  /* Bloques de código */
                  [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:my-4 [&_pre]:overflow-x-auto
                  
                  /* Citas */
                  [&_blockquote]:border-l-4 [&_blockquote]:border-slate-600 [&_blockquote]:pl-4 
                  [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-4
                `}
              dangerouslySetInnerHTML={htmlPreview}
            />
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end">
          <CloseButton
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Close
          </CloseButton>
        </div>
      }
    />
  );
};

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

  const weekNum = getWeek(start);
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
      memberAllocations.forEach((allocation) => {
        const task = tasks.find((t) => t.id === allocation.taskId);
        const mod = modules.find((m) => m.id === allocation.moduleId);

        if (task) {
          const hours = calculateHours(allocation, member);

          text += `- **[${mod?.name ?? '---'}]** ${task.title}\n`;

          if (task.description) {
            const desc = task.description.replace(/\n/g, '\n    ');
            text += `    > ${desc}\n`;
          }

          if (task.ticket.length > 0) {
            const tickets = task.ticket
              .filter((t) => t.id)
              .map((t) => {
                const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/${t.id}` : null;
                const key = url ? t.id : `\`${t.id}\``;
                return `${key}${t.title ? `: ${t.title}` : ''}`;
              })
              .join(', ');
            if (tickets) {
              text += `    - Tickets: ${tickets}\n`;
            }
          }

          text += `    - Time: ${allocation.span.toString()} days (~${hours.toString()}h)\n`;
          text += `    - Start Date: ${allocation.iniDate}\n`;
        }
      });
    } else {
      text += `_No tasks assigned_\n`;
    }
    text += `\n`;
  });

  return text;
};

function calculateHours(allocation: Allocation, member: Member): number {
  let total = 0;
  const startDate = new Date(allocation.iniDate);
  for (let i = 0; i < allocation.span; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    // getDay(): 0 = Sun, 1 = Mon...
    const dayIndex = current.getDay();
    // member.schedule: assume 0=Mon, 6=Sun based on [8.5, 8.5, 8.5, 8.5, 6, 0, 0]
    const scheduleIndex = (dayIndex + 6) % 7;
    total += member.schedule[scheduleIndex] || 0;
  }
  return total;
}

function getWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

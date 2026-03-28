import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CloseButton, Textarea } from '@component/forms';
import { Modal } from '@component/surfaces';
import { marked } from 'marked';

import { NavButton, SectionHeader } from '@/components/common';

const PREVIEW_STYLES = `
  flex-1 p-4 rounded-lg bg-slate-800 border border-slate-700 
  text-xs text-slate-300 leading-relaxed overflow-y-auto
  [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h1]:mt-2
  [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-100 [&_h2]:mb-3 [&_h2]:mt-4
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1
  [&_strong]:text-white [&_strong]:font-bold
  [&_code]:bg-slate-900 [&_code]:px-1 [&_code]:rounded [&_code]:text-sky-400 [&_code]:font-mono
`;

interface ReportModalProps {
  text: string;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const useReportLogic = (initialText: string) => {
  const [markdown, setMarkdown] = useState(initialText);
  const [debouncedPreview, setDebouncedPreview] = useState(initialText);
  const [copiedType, setCopiedType] = useState<'editor' | 'preview' | null>(null);

  useEffect(() => {
    setMarkdown(initialText);
    setDebouncedPreview(initialText);
  }, [initialText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPreview(markdown);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [markdown]);

  const handleCopy = async (type: 'editor' | 'preview', content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedType(type);
      setTimeout(() => {
        setCopiedType(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return {
    markdown,
    setMarkdown,
    debouncedPreview,
    copiedType,
    handleCopy,
    isSyncing: markdown !== debouncedPreview
  };
};

export const ReportModal: React.FC<ReportModalProps> = ({
  text,
  isModalOpen,
  setIsModalOpen,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext
}) => {
  const { markdown, setMarkdown, debouncedPreview, copiedType, handleCopy, isSyncing } =
    useReportLogic(text);

  const previewRef = useRef<HTMLDivElement>(null);

  const htmlContent = useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __html: marked.parse(debouncedPreview) as string
    }),
    [debouncedPreview]
  );

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
      }}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-white">Weekly Report</h2>
          <div className="flex gap-2">
            <NavButton onClick={onPrev} disabled={!canGoPrev}>
              Previous
            </NavButton>
            <NavButton onClick={onNext} disabled={!canGoNext}>
              Next
            </NavButton>
          </div>
        </div>
      }
      body={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh]">
          {/* EDITOR */}
          <div className="flex flex-col gap-2">
            <SectionHeader title="Markdown Editor">
              <CloseButton
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  handleCopy('editor', markdown);
                }}
                className={copiedType === 'editor' ? 'text-green-500' : ''}
              >
                {copiedType === 'editor' ? 'Copied!' : 'Copy MD'}
              </CloseButton>
            </SectionHeader>
            <Textarea
              value={markdown}
              onChange={(e) => {
                setMarkdown(e.target.value);
              }}
              className="font-mono text-xs flex-1 resize-none bg-slate-900 text-slate-200 p-3 rounded-lg border border-slate-700"
            />
          </div>

          {/* PREVIEW */}
          <div className="flex flex-col gap-2">
            <SectionHeader title="HTML Preview" loading={isSyncing}>
              <CloseButton
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  handleCopy('preview', previewRef.current?.innerText ?? '');
                }}
                className={copiedType === 'preview' ? 'text-green-500' : ''}
              >
                {copiedType === 'preview' ? 'Copied!' : 'Copy Text'}
              </CloseButton>
            </SectionHeader>
            <div
              ref={previewRef}
              className={PREVIEW_STYLES}
              dangerouslySetInnerHTML={htmlContent}
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

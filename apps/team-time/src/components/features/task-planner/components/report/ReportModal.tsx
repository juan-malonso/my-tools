import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Textarea, CloseButton } from '@component/forms';
import { Modal } from '@component/surfaces';
import { marked } from 'marked';

import { NavButton, SectionHeader } from '@/components/common';

const PREVIEW_CLASSES = `
  flex-1 p-4 rounded-lg bg-slate-800 border border-slate-700 
  text-xs text-slate-300 leading-relaxed overflow-y-auto
  
  /* Headings */
  [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h1]:mt-2
  [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-100 [&_h2]:mb-3 [&_h2]:mt-4
  
  /* Lists */
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1
  
  /* Text Formatting */
  [&_strong]:text-white [&_strong]:font-bold
  [&_code]:bg-slate-900 [&_code]:px-1 [&_code]:rounded [&_code]:text-sky-400 [&_code]:font-mono

  /* Links */
  [&_a]:text-sky-400 [&_a]:underline [&_a]:hover:text-sky-300
  
  /* Code Blocks */
  [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:my-4 [&_pre]:overflow-x-auto
  
  /* Blockquotes */
  [&_blockquote]:border-l-4 [&_blockquote]:border-slate-600 [&_blockquote]:pl-4 
  [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-4
`;

const useReportLogic = (text: string) => {
  const [value, setValue] = useState(text);
  const [previewValue, setPreviewValue] = useState(text);
  const [copiedSection, setCopiedSection] = useState<'editor' | 'preview' | null>(null);

  const lastUpdateRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setValue(text);
    setPreviewValue(text);
  }, [text]);

  useEffect(() => {
    if (timeoutRef.current || value === previewValue) return;
    const delay = Math.max(2000, 3000 - (Date.now() - lastUpdateRef.current));

    timeoutRef.current = setTimeout(() => {
      setPreviewValue(value);
      lastUpdateRef.current = Date.now();
      timeoutRef.current = null;
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, previewValue]);

  const copyToClipboard = (type: 'editor' | 'preview', content?: string) => {
    setCopiedSection(type);
    if (content) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigator.clipboard.writeText(content);
    }
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  return {
    value,
    setValue,
    previewValue,
    copiedSection,
    copyToClipboard,
    isProcessing: value !== previewValue
  };
};

export const ReportModal: React.FC<{
  text: string;
  isModalOpen: boolean;
  // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
  setIsModalOpen: (b: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}> = ({ text, isModalOpen, setIsModalOpen, onPrev, onNext, canGoPrev, canGoNext }) => {
  const { value, setValue, previewValue, copiedSection, copyToClipboard, isProcessing } =
    useReportLogic(text);
  const previewRef = useRef<HTMLDivElement>(null);

  const htmlPreview = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return { __html: marked.parse(previewValue) as string };
  }, [previewValue]);

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

    copyToClipboard('preview');
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
          <div className="flex gap-2">
            <NavButton onClick={onPrev} disabled={!canGoPrev}>
              Previous Week
            </NavButton>
            <NavButton onClick={onNext} disabled={!canGoNext}>
              Next Week
            </NavButton>
          </div>
        </div>
      }
      body={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="flex flex-col gap-2 h-full">
            <SectionHeader title="Editor">
              <CloseButton
                onClick={() => {
                  copyToClipboard('editor', value);
                }}
                className={copiedSection === 'editor' ? 'text-green-500' : ''}
              >
                {copiedSection === 'editor' ? 'Copied!' : 'Copy Markdown'}
              </CloseButton>
            </SectionHeader>
            <Textarea
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              className="font-mono text-xs flex-1 resize-none !bg-slate-700"
            />
          </div>
          <div className="flex flex-col gap-2 h-full">
            <SectionHeader title="Preview" loading={isProcessing}>
              <CloseButton
                onClick={handleCopyPreview}
                className={copiedSection === 'preview' ? 'text-green-500' : ''}
              >
                {copiedSection === 'preview' ? 'Copied!' : 'Copy HTML'}
              </CloseButton>
            </SectionHeader>
            <div
              ref={previewRef}
              className={PREVIEW_CLASSES}
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

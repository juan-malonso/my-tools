import React from 'react';

import { Card } from '../cards';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  headerClassName?: string;
  sidenav?: React.ReactNode;
  sidenavClassName?: string;
  body: React.ReactNode;
  bodyClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  className?: string;
}

const backgroundStyle =
  'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  header,
  headerClassName,
  sidenav,
  sidenavClassName,
  body,
  bodyClassName,
  footer,
  footerClassName,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className={backgroundStyle} onClick={onClose}>
      <div
        className="w-[80vw] h-[80vh] flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Card
          className={className}
          header={header}
          headerClassName={headerClassName}
          sidenav={sidenav}
          sidenavClassName={sidenavClassName}
          body={body}
          bodyClassName={bodyClassName}
          footer={footer}
          footerClassName={footerClassName}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Wider canvas for dashboards, narrower for reading pages */
  width?: 'default' | 'narrow' | 'wide';
}

const widths = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
};

/**
 * The single page shell used by every route: identical max width,
 * horizontal padding and vertical rhythm everywhere.
 */
const PageContainer: React.FC<PageContainerProps> = ({ children, className, width = 'default' }) => (
  <div className="w-full px-4 py-6 sm:px-6 md:py-8">
    <div className={cn('mx-auto w-full space-y-6', widths[width], className)}>{children}</div>
  </div>
);

export default PageContainer;

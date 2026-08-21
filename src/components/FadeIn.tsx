
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'none';
  threshold?: number;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  delay = 0,
  duration = 700,
  direction = 'up',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const animationStyles = {
    opacity: isVisible ? 1 : 0,
    transform: 
      direction === 'up' 
        ? `translateY(${isVisible ? 0 : '20px'})` 
        : 'none',
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    transitionDelay: `${delay}ms`
  };

  return (
    <div 
      ref={ref} 
      className={cn(className)} 
      style={animationStyles}
    >
      {children}
    </div>
  );
};

export default FadeIn;

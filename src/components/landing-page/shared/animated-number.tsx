'use client';
import { useEffect, useRef, useState } from 'react';
import {
  useMotionValue,
  useSpring,
  motion,
  type SpringOptions,
} from 'motion/react';
import { cn } from './utils';

export function AnimatedNumber({
  value,
  className,
  springOptions,
  format,
}: {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  format?: (value: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, springOptions);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (format) {
        setDisplayValue(format(latest));
      } else {
        setDisplayValue(Intl.NumberFormat('en-US').format(Math.round(latest)));
      }
    });
    return () => unsubscribe();
  }, [springValue, format]);

  return (
    <motion.span ref={ref} className={cn(className)}>
      {displayValue}
    </motion.span>
  );
}

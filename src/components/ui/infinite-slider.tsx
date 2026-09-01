"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 30,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isHorizontal = direction === "horizontal";
  const translation = useMotionValue(0);

  useEffect(() => {
    const updateSize = () => {
      if (contentRef.current) {
        const size = isHorizontal
          ? contentRef.current.scrollWidth
          : contentRef.current.scrollHeight;
        setContentSize(size);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isHorizontal, children]);

  useAnimationFrame((_, delta) => {
    if (!contentSize) return;

    const currentDuration = isHovered && durationOnHover ? durationOnHover : duration;
    if (isHovered && durationOnHover === 0) return; // Full pause on hover if 0

    // Pixels to move per second
    const speed = (contentSize / currentDuration) * (delta / 1000);
    const directionFactor = reverse ? 1 : -1;

    let nextValue = translation.get() + speed * directionFactor;

    if (reverse) {
      if (nextValue >= 0) {
        nextValue = -contentSize;
      }
    } else {
      if (Math.abs(nextValue) >= contentSize) {
        nextValue = 0;
      }
    }

    translation.set(nextValue);
  });

  const transformStyle = isHorizontal
    ? { x: translation }
    : { y: translation };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("overflow-hidden select-none", className)}
    >
      <motion.div
        style={{
          ...transformStyle,
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          gap: `${gap}px`,
          width: "max-content",
          willChange: "transform",
        }}
      >
        <div
          ref={contentRef}
          className={cn(
            "flex shrink-0",
            isHorizontal ? "flex-row" : "flex-col"
          )}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
        <div
          aria-hidden="true"
          className={cn(
            "flex shrink-0",
            isHorizontal ? "flex-row" : "flex-col"
          )}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
        <div
          aria-hidden="true"
          className={cn(
            "flex shrink-0",
            isHorizontal ? "flex-row" : "flex-col"
          )}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

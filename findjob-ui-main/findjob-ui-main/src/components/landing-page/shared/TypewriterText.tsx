'use client';

import { useState, useEffect } from 'react';

interface TextSegment {
  text: string;
  className: string;
}

interface TypewriterTextProps {
  segments: TextSegment[];
  speed?: number;
}

export function TypewriterText({ segments, speed = 50 }: TypewriterTextProps) {
  const [totalCharsDisplayed, setTotalCharsDisplayed] = useState(0);

  const allText = segments.map(s => s.text).join('');
  const isComplete = totalCharsDisplayed >= allText.length;

  useEffect(() => {
    if (isComplete) return;

    const timer = setTimeout(() => {
      setTotalCharsDisplayed(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [totalCharsDisplayed, isComplete, speed]);

  const displayedSegments = segments.map((segment, index) => {
    const segmentStart = segments
      .slice(0, index)
      .reduce((count, currentSegment) => count + currentSegment.text.length, 0);
    const segmentEnd = segmentStart + segment.text.length;
    const displayEnd = Math.min(totalCharsDisplayed, segmentEnd);
    const displayText = segment.text.substring(0, Math.max(0, displayEnd - segmentStart));

    return { ...segment, displayText };
  });

  return (
    <>
      {displayedSegments.map((segment, idx) => (
        <span key={idx} className={segment.className}>
          {segment.displayText}
        </span>
      ))}
      {!isComplete && <span className="animate-pulse ml-1">|</span>}
    </>
  );
}

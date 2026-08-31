/**
 * A file's thumbnail as a diagram of what it is, not a render of what it says.
 * Shape carries the meaning: a resume is ruled text under a header, a portfolio
 * is a grid of work tiles. Both are drawn from the workspace tokens, so they
 * theme with everything else and stay flat — no gradients, no screenshots to
 * keep in step with the real document.
 */
export type FileGlyphKind = "resume" | "portfolio";

export function FileGlyph({ kind }: { kind: FileGlyphKind }) {
  return (
    <svg
      viewBox="0 0 160 112"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* The sheet, inset so the card's fill reads as the desk under it. */}
      <rect
        x="26"
        y="8"
        width="108"
        height="96"
        rx="8"
        fill="var(--ws-panel)"
        stroke="var(--ws-line)"
      />
      {kind === "resume" ? <ResumeMarks /> : <PortfolioMarks />}
    </svg>
  );
}

/** Header block with a portrait, a rule, then two columns of ruled text. */
function ResumeMarks() {
  const lines = [0, 1, 2];

  return (
    <g>
      <circle cx="42" cy="26" r="7" fill="var(--chip-solid)" />
      <rect x="55" y="21" width="42" height="5" rx="2.5" fill="var(--ws-fg)" />
      <rect
        x="55"
        y="30"
        width="26"
        height="4"
        rx="2"
        fill="var(--ws-faint)"
        opacity="0.7"
      />

      <rect x="36" y="45" width="88" height="1.5" fill="var(--ws-line)" />

      {/* Left rail of short entries beside a block of body copy. */}
      {lines.map((line) => (
        <rect
          key={`rail-${line}`}
          x="36"
          y={54 + line * 12}
          width="22"
          height="4"
          rx="2"
          fill="var(--ws-faint)"
          opacity="0.55"
        />
      ))}
      {lines.map((line) => (
        <g key={`body-${line}`}>
          <rect
            x="66"
            y={54 + line * 12}
            width="58"
            height="4"
            rx="2"
            fill="var(--ws-faint)"
            opacity="0.75"
          />
          <rect
            x="66"
            y={61 + line * 12}
            width="40"
            height="4"
            rx="2"
            fill="var(--ws-faint)"
            opacity="0.4"
          />
        </g>
      ))}
    </g>
  );
}

/** A cover strip over a grid of project tiles — a gallery, not a document. */
function PortfolioMarks() {
  const tiles = [
    { x: 36, y: 52 },
    { x: 82, y: 52 },
    { x: 36, y: 76 },
    { x: 82, y: 76 },
  ];

  return (
    <g>
      <rect
        x="36"
        y="18"
        width="88"
        height="24"
        rx="5"
        fill="var(--note-cool)"
      />
      <rect
        x="43"
        y="26"
        width="34"
        height="4"
        rx="2"
        fill="var(--note-cool-fg)"
      />
      <rect
        x="43"
        y="33"
        width="20"
        height="3"
        rx="1.5"
        fill="var(--note-cool-fg)"
        opacity="0.6"
      />

      {tiles.map((tile, index) => (
        <rect
          key={`${tile.x}-${tile.y}`}
          x={tile.x}
          y={tile.y}
          width="42"
          height="18"
          rx="4"
          fill={index === 0 ? "var(--chip-solid)" : "var(--ws-card-hover)"}
        />
      ))}
    </g>
  );
}

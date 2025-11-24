// components/HighlightHashtags.tsx
"use client";

import React from "react";

type HighlightHashtagsProps = {
  text?: string | null;
  // optional Tailwind classes
  hashtagClass?: string;
  textClass?: string;
  wrapperClass?: string;
};

/**
 * formatHashtags(text)
 * - returns an array of React nodes where hashtags are wrapped in a span
 * - preserves newlines by inserting <br/>
 */
export function formatHashtags(
  text: string,
  opts?: { hashtagClass?: string; textClass?: string }
): React.ReactNode[] {
  if (!text) return [];

  // tokens: split while keeping hashtags as separate tokens
  const tokenRegex = /(#[a-zA-Z0-9_]+)/;
  const tokens = text.split(tokenRegex);

  const nodes: React.ReactNode[] = [];

  tokens.forEach((token, ti) => {
    // If token is a hashtag
    if (token.match(tokenRegex)) {
      nodes.push(
        <span
          key={`h-${ti}`}
          className={opts?.hashtagClass ?? "text-blue-400 font-semibold"}
        >
          {token}
        </span>
      );
      return;
    }

    // Normal text (may contain newlines). Preserve them.
    if (token.length === 0) return;

    const lines = token.split("\n");
    lines.forEach((line, li) => {
      // Push the text segment (let it inherit color unless textClass provided)
      if (line.length > 0) {
        nodes.push(
          <span key={`t-${ti}-${li}`} className={opts?.textClass ?? undefined}>
            {line}
          </span>
        );
      }

      // If not the last line, insert a break
      if (li < lines.length - 1) {
        nodes.push(<br key={`br-${ti}-${li}`} />);
      }
    });
  });

  return nodes;
}

export default function HighlightHashtags({
  text,
  hashtagClass,
  textClass,
  wrapperClass,
}: HighlightHashtagsProps) {
  if (!text) return null;

  return (
    <div className={wrapperClass ?? "text-base leading-relaxed"}>
      {formatHashtags(text, { hashtagClass, textClass })}
    </div>
  );
}

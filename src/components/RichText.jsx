import React from 'react';

/**
 * Parses inline bold (**text**) within a string and returns React nodes.
 */
function parseInlineBold(text, keyPrefix) {
  const boldPattern = /\*\*([^*]+)\*\*/g;
  const parts = [];
  let lastIdx = 0;
  let m;

  while ((m = boldPattern.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    parts.push(<strong key={`${keyPrefix}-b${m.index}`}>{m[1]}</strong>);
    lastIdx = m.index + m[0].length;
  }

  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

/**
 * Renders plain text with clickable links and bold text.
 * Supports:
 *  - Markdown-style links: [link text](https://url.com)
 *  - Bold inside links: [**bold text**](https://url.com)
 *  - Bare URLs: https://example.com
 *  - **bold** text
 *
 * Drop-in replacement for plain text rendering anywhere in the app.
 */
export default function RichText({ children }) {
  if (!children || typeof children !== 'string') return children || null;

  // Combined pattern: [text](url) | bare URL | **bold** | __underline__
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)|\*\*([^*]+)\*\*|__([^_]+)__/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(children)) !== null) {
    // Push any text before this match
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown-style link: [text](url) — parse bold inside link text
      parts.push(
        <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">
          {parseInlineBold(match[1], match.index)}
        </a>
      );
    } else if (match[3]) {
      // Bare URL
      parts.push(
        <a key={match.index} href={match[3]} target="_blank" rel="noopener noreferrer">
          {match[3]}
        </a>
      );
    } else if (match[4]) {
      // **bold**
      parts.push(<strong key={match.index}>{match[4]}</strong>);
    } else if (match[5]) {
      // __underline__
      parts.push(<u key={match.index}>{match[5]}</u>);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : children;
}

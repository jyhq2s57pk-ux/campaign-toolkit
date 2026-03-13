import React from 'react';

/**
 * Renders plain text with clickable links.
 * Supports:
 *  - Markdown-style links: [link text](https://url.com)
 *  - Bare URLs: https://example.com
 *  - **bold** text
 *
 * Drop-in replacement for plain text rendering anywhere in the app.
 */
export default function RichText({ children }) {
  if (!children || typeof children !== 'string') return children || null;

  // Combined pattern: [text](url) | bare URL | **bold**
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)|\*\*([^*]+)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(children)) !== null) {
    // Push any text before this match
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown-style link: [text](url)
      parts.push(
        <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">
          {match[1]}
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
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : children;
}

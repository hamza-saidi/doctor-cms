import Link from "next/link";
import { Fragment } from "react";

// Supports a minimal `[label](/path)` markdown-link syntax inside otherwise
// plain-text post bodies, so posts can carry real internal links without
// needing a full rich-text editor in the admin.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export default function RichParagraph({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const [, label, href] = match;
    parts.push(
      <Link
        key={key++}
        href={href}
        className="text-primary underline underline-offset-2 hover:opacity-70 transition-opacity"
      >
        {label}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return <p>{parts}</p>;
}

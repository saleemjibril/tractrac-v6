import type { ElementType, ReactNode } from "react";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

export { bindTitleOrphans };

export function BoundTitle({
  as: Tag = "h2",
  className,
  id,
  children,
}: {
  as?: ElementType;
  className?: string;
  id?: string;
  children: string;
}) {
  return (
    <Tag id={id} className={className}>
      {bindTitleOrphans(children)}
    </Tag>
  );
}

export function BoundTitleWithHighlight({
  as: Tag = "h2",
  className,
  id,
  title,
  highlight,
  highlightClassName,
}: {
  as?: ElementType;
  className?: string;
  id?: string;
  title: string;
  highlight?: string;
  highlightClassName?: string;
}) {
  return (
    <Tag id={id} className={className}>
      {renderBoundWithHighlight(title, highlight, highlightClassName)}
    </Tag>
  );
}

function renderBoundWithHighlight(
  title: string,
  highlight?: string,
  highlightClassName?: string
): ReactNode {
  if (!highlight || !title.includes(highlight)) {
    return bindTitleOrphans(title);
  }

  const bound = bindTitleOrphans(title);
  const idx = bound.indexOf(highlight);
  if (idx === -1) {
    return bound;
  }

  return (
    <>
      {bound.slice(0, idx)}
      <span className={highlightClassName}>{highlight}</span>
      {bound.slice(idx + highlight.length)}
    </>
  );
}

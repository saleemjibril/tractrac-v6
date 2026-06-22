/**
 * Groups words into pairs (non-breaking) so wrapped title lines never show a single word.
 */
export function bindTitleOrphans(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0];
  if (words.length === 2) return words.join("\u00A0");

  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const remaining = words.length - i;
    if (remaining === 1) {
      const last = chunks.pop()!;
      chunks.push(`${last}\u00A0${words[i]}`);
      i += 1;
    } else {
      chunks.push(`${words[i]}\u00A0${words[i + 1]}`);
      i += 2;
    }
  }
  return chunks.join(" ");
}

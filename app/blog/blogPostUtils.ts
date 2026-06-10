import { JSDOM } from "jsdom";
import type { BlogPostDetail } from "./blogApi";

export function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, num) => {
      try {
        return String.fromCharCode(parseInt(num, 10));
      } catch {
        return _;
      }
    });
}

export function cleanHtmlContent(content: string): string {
  if (!content) return "";

  return content
    .replace(/id=">[^"]*"/g, "")
    .replace(/data-content="[^"]*"/g, 'data-content="true"')
    .replace(/="[^"]*&#8221;[^"]*"/g, '=""')
    .replace(/&#8217;/g, "'")
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function extractTocFromHtml(html: string): { id: string; content: string }[] {
  try {
    const dom = new JSDOM(html);
    const elements = dom.window.document.querySelectorAll('[data-content="true"]');
    return Array.from(elements).map((el: Element) => ({
      id: el.id,
      content: el.textContent?.trim() || "",
    }));
  } catch {
    return [];
  }
}

export function prepareBlogPost(post: BlogPostDetail): BlogPostDetail {
  const content = cleanHtmlContent(post.content);
  const toc = extractTocFromHtml(post.content);

  return {
    ...post,
    title: decodeHtmlEntities(stripTags(post.title)),
    content,
    toc: toc.length > 0 ? toc.map((item) => ({
      ...item,
      content: decodeHtmlEntities(item.content),
    })) : post.toc,
  };
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

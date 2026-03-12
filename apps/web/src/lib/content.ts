import { readFile } from 'fs/promises';
import { join } from 'path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export interface ChapterContent {
  html: string;
  title: string;
}

/**
 * Load and convert markdown chapter content to HTML.
 * The HTML will be rendered with KaTeX auto-render for math expressions.
 */
export async function loadChapterContent(chapterId: number): Promise<ChapterContent | null> {
  try {
    const filePath = join(
      process.cwd(),
      'src',
      'content',
      'chapters',
      `chapter-${chapterId}.md`
    );
    const content = await readFile(filePath, 'utf-8');

    // Extract title from first H1
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/^Chapter\s+\d+:\s*/, '') : '';

    // Convert markdown to HTML
    const result = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { allowDangerousHtml: true })
      .process(content);

    return {
      html: String(result),
      title,
    };
  } catch (error) {
    console.error(`Failed to load chapter ${chapterId} content:`, error);
    return null;
  }
}

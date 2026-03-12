import { readFile } from 'fs/promises';
import { join } from 'path';

export async function loadChapterContent(chapterId: number): Promise<string> {
  try {
    const filePath = join(
      process.cwd(),
      'src',
      'content',
      'chapters',
      `chapter-${chapterId}.md`
    );
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Failed to load chapter ${chapterId} content:`, error);
    return '';
  }
}

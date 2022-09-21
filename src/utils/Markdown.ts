import * as fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = join(process.cwd(), 'src/posts');

export function getMDDocBySlug(slug: string, subfolder: string = '', locale = 'en') {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = subfolder ? join(postsDirectory, subfolder, `${realSlug}.${locale}.md`) : join(postsDirectory, `${realSlug}.${locale}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content, data } = matter(fileContents);

  return { slug: realSlug, meta: data, content };
}

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

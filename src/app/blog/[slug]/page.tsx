import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '../../../types';

interface Params {
  params: {
    slug: string;
  };
}

export default function PostPage({ params }: Params) {
  const post = getPost(params.slug);

  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
    </div>
  );
}

function getPost(slug: string): Post {
  const postsDirectory = path.join(process.cwd(), 'public', 'posts');
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    content,
  };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'public', 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => ({
    params: {
      slug: filename.replace(/\.md$/, ''),
    },
  }));
}

import dynamic from "next/dynamic";
import matter from 'gray-matter';
import fs from 'fs';
import path from "path";

export default function App({params}) {
    const  MDX = dynamic(() => import('@/posts/' + params.slug + '.mdx'));

    // gray-matter parse fileContent to get the frontmatter
    const fileContent = fs.readFileSync(
        path.join(process.cwd(), 'posts', params.slug + '.mdx'), 'utf8');
    const {data: frontmatter} = matter(fileContent);

    return <>
        <h1>{frontmatter.title}</h1>
        <MDX />
    </>
}

export function generateStaticParams() {
    const slugs =['test', 'test1', 'test2'];
    return slugs.map(slug => ({slug}))
}
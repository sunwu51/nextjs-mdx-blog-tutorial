# nextjs-mdx-blog-tutorial
This project will tech you step by step to create a new blog site with nextjs and mdx.

## 1 Create next.js project
First, create a new next.js project, according to the [official documentation](https://nextjs.org/docs/getting-started/installation)
```bash
$ npx create-next-app@latest
```
![image](https://i.imgur.com/wZkf5nP.png)

Then you get a directory named `my-blog`

![image](https://i.imgur.com/gWf0h4E.png)

## 2 Add mdx support
According to the [official documentation](https://nextjs.org/docs/app/building-your-application/configuring/mdx), install the dependencies.
```bash
$ npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

Update the `.eslintrc.json` to avoid vscode warnings.
```json:.eslintrc.json
{
  "extends": ["next/babel","next/core-web-vitals"]
}
```
And create a file named `mdx-components.jsx` in your project root directory.
```jsx:mdx-components.jsx 
export function useMDXComponents(components) {
  return {
    ...components,
  }
}
```
Update the `next.config.mjs`, import `mdx`.
```js:next.config.mjs
/** @type {import('next').NextConfig} */
import nextMDX from '@next/mdx'

const withMDX = nextMDX({})

const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}
 
export default withMDX(nextConfig)
```
Then add a `page.mdx` file to the `app/blog` directory, of course, you need to create the `blog` directory yourself.
```mdx:page.mdx
# blog
This is the mdx file
\```js
let a = 1;
let b = 1;
let c = 1;
let d = 1;
console.log("sum=" + (a + b + c + d))
\```
```
Start the nextjs server by `npm run dev`, visit `localhost:3000/blog`, will get this page

![img](https://i.imgur.com/Q8XB0d6.png)

Ok, now we have added mdx to next.js, the dependencies transform `mdx` file to `html` file, but the style is em... none. Next thing we need to do is beautify the html.
# 3 Style
The html generated from mdx have no styles, but with the correct dom tag. We just need to add css file to styled the file.

First, we need to clear the `global.css` only left the tailwind cmd.
```css:global.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

The second step is change the `app/layout.js` this file running before all the others.

Add `github-markdown` css from cdn, and add `markdown-body` className to the body dom.
```jsx:layout.js {4-7}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css"/>
      </head>
      <body className={inter.className + " markdown-body"}>{children}</body>
    </html>
  );
}
```
![image](https://i.imgur.com/QomAJQ4.png)

But, until now, code block still isn't beautiful. Now, we will add `prism-plus` plugin to highlight code blocks, also we add some other useful plugins.
```mjs :next.config.mjs
/** @type {import('next').NextConfig} */
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrismPlus from 'rehype-prism-plus';
import toc from "@jsdevtools/rehype-toc";
import remarkCodeTitles from "remark-flexible-code-titles";
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkCodeTitles],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypePrismPlus, { ignoreMissing: true, showLineNumbers: true  }],
      toc,
    ]
  }
})

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}
 
export default withMDX(nextConfig)
```

Then you need to add prism theme style file to `layout.js`,  pick your favorite theme from [the repo](https://github.com/PrismJS/prism-themes/tree/master/themes). Let's do that copy the [prism-dracula.css](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-dracula.css) to the root directory. Then change the background-color, using `!important` overwriting the github-markdown style.
```css
:not(pre)>code[class*="language-"],
pre[class*="language-"] {
    background: #282a36 !important;
}
```

Add code line-number style, highlighting style, code title style also to the prism-dracula.css file.
```css
.code-highlight {
    float: left;
    min-width: 100%;
}

.code-line {
    display: block;
    padding-left: 16px;
    padding-right: 16px;
    margin-left: -16px;
    margin-right: -16px;
    border-left: 4px solid rgba(0, 0, 0, 0);
}

.highlight-line {
    margin-left: -16px;
    margin-right: -16px;
    background-color: rgba(55, 65, 81, 0.5);
    border-left: 4px solid rgb(59, 130, 246);
}

.line-number::before {
    display: inline-block;
    width: 1rem;
    text-align: right;
    margin-right: 16px;
    margin-left: -8px;
    color: rgb(156, 163, 175);
    content: attr(line);
}
.remark-code-container {
    border-radius: 0.3em;
    background: #282a36;
    position: relative;
}

.remark-code-container .remark-code-title {
    margin-left: 2rem;
    margin-top: 0.5rem;
    border-radius: 0 0 0.3em 0.3em;
    background: #fafafa;
    padding: 0.5rem 1rem;
    width: fit-content;
    font-size: 1rem;
    font-weight: bolder;
}
```

Import the css file in `layout.js`
```js :layout.js
import "./prism-dracula.css";
...
```


- `remarkGfm` (GitHub Flavored Markdown) enhance the markdown support, for example table grammar support.
- `remarkCodeTitles` add a `div` before the `code` block which contains the title.
- `rehypeAutolinkHeadings` headings generated by `# ##`... will be a link.
- `rehypePrismPlus` highlight the code block.
- `toc` generate a table of contents at the top of the page.

![image](https://i.imgur.com/8kYdtWA.png)

# 4 Custom plugins
Now, we want to add a custom button to trigger the toc show or hide. Also a button for the code block to copy code.

Create file named `rehype-toc-trigger-button.mjs` in the root path, with the following content. This file will generate a button dom in the toc `nav`, and click the button will trigger the toc show/hide.
```js :rehype-toc-trigger-button.mjs
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import crypto from "crypto";

export default function rehypeTocTriggerButton() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'nav' && node.properties.className == 'toc') {     
        const btnid = crypto.randomUUID();
        const button = h('button', {
          type: 'button',
          className: 'toc-trigger-button',
          id: btnid,
        }, '≡');
        node.children.push(button);
        const scriptContent = `
            document.getElementById("${btnid}").addEventListener('click', (e) => {
              var btn = e.target;
              var nav = btn.closest('nav');
              var content = nav.querySelector('.toc-level-1');
              content.style.display = content.style.display === 'none' ? '' : 'none';
            });`;
        const src = "data:application/javascript;base64," + Buffer.from(scriptContent).toString('base64');
        const script = h('script', {src: src});
        node.children.push(script);
      }
    });
  }
}
```

Then add another file named `rehype-code-copy-button.mjs`, this plugin will generate a copy button in the `code` block.
```js :rehype-code-copy-button.mjs
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import crypto from "crypto";

export default function rehypeCodeCopyButton() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre') {        
        const codeElement = node.children.find(child => child.tagName === 'code');
        if (codeElement) {
          const btnid = crypto.randomUUID();
          const button = h('button', {
            type: 'button',
            className: 'copy-code-button',
            id: btnid,
            'data-copy-code-button': true
          }, 'Copy');
          
          node.children.push(button);
          const scriptContent = `
            document.getElementById("${btnid}").addEventListener('click', (e) => {
              var btn = e.target;
              var codeBlock = btn.closest('pre').querySelector('code').innerText;
              navigator.clipboard.writeText(code).then(() => {
                btn.innerText = 'Copied!';
                setTimeout(() => { btn.innerText = 'Copy'; }, 2000);
              }).catch(err => {
                console.error('Failed to copy code:', err);
              });
            });`;
          const src = "data:application/javascript;base64," + Buffer.from(scriptContent).toString('base64');
          const script = h('script', {src: src});
          node.children.push(script);
        }
      }
    });
  }
}
```
Then add these plugins to the `next.config.mjs`
```js :next.config.mjs {9,10,20,21}
/** @type {import('next').NextConfig} */
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrismPlus from 'rehype-prism-plus';
import toc from "@jsdevtools/rehype-toc";
import remarkCodeTitles from "remark-flexible-code-titles";
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeCopyButton from './rehype-code-copy-button.mjs'
import rehypeTocTriggerButton from './rehype-toc-trigger-button.mjs'
const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkCodeTitles],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypePrismPlus, { ignoreMissing: true, showLineNumbers: true  }],
      toc,
      rehypeCodeCopyButton,
      rehypeTocTriggerButton,
    ]
  }
})

const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}
 
export default withMDX(nextConfig)
```
Finally, add custom styles
```css
.toc {
    position: fixed;
    top: 20px;
    right: 2vw;
    width: fit-content;
    max-width: 250px;
    max-height: 80vh;
    overflow: auto;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 1rem;
    padding: 1rem 2rem;
    font-weight: bold;
    color:blueviolet;
    z-index: 9;
    min-height: 45px;

}

.toc li a {
    color:blueviolet
}
@media (min-width: 2000px) {
    .toc{
      right: calc(100px + 2vw);
    }
}
.toc ol.toc-level-1 {
    margin: 0;
    padding: 0;
    width: 180px;
}
.toc .toc-trigger-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    padding: 2px 5px;
    cursor: pointer;
    color: black;
    font-size: 0.75rem;
    width: fit-content;
    height: fit-content;
    width: 45px;
    box-shadow: 0px 0px 2px 0px;
}

.toc .toc-trigger-button:hover {
    background-color: #e0e0e0;
}

.copy-code-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #f5f5f5;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    color: black;
    font-weight: bolder;
}

.copy-code-button:hover {
    background-color: #e0e0e0;
}
```
![img](https://i.imgur.com/NdTh1YU.png)
# 5 Slug and Custom Components
The directory structure is not simple enough, you need to create a directory with the post name, then in the directory, create the `page.mdx` file. That is not dynamic.

Well, we can use the `slug` feature to create a dynamic route. Here, we create `app/blog/[slug]/page.js` instead of `app/blog/page.mdx`.
```js :page.js
import dynamic from "next/dynamic";

export default function App({params}) {
    // just import mdx file, will get a JSX component
    let MDX = dynamic(() => import('@/posts/' + params.slug + '.mdx'));
    return <>
        <h1>Some Common Content</h1>
        <MDX />
    </>
}

// prebuild static params
export function generateStaticParams() {
    const slugs =['test', 'test1', 'test2'];
    return slugs.map(slug => ({slug}))
}
```

Then create a `posts` directory in root directory, write some `mdx` content here.

![image](https://i.imgur.com/s0TMZeO.png)

![image](https://i.imgur.com/aCoaa8f.png)

Something not good for this way is `@next/mdx` not support [frontmatter](https://mdxjs.com/guides/frontmatter/). You can config `remarkFrontmatter` plugin to ignore the frontmatter.  
```js
// next.config.mjs
import remarkFrontmatter from 'remark-frontmatter';

....
    remarkPlugins: [remarkGfm, remarkCodeTitles, remarkFrontmatter],
....
```

Then you need to add lib `gray-matter` to read the file content to get the frontmatter.
```jsx :page.js
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
```

The last topic is how to add custom component to `mdx`, only things that you need to do is add any component to the `mdx-components.jsx` file that created at step 2.

```bash
$ npm i antd
```

```jsx
import { Button } from 'antd';

const CustomH1 = (props) => <h1 style={{ backgroundColor: 'tomato'}} {...props} />;
const CustomLink = (props) => <a style={{ color: 'white'}} {...props} />;


export function useMDXComponents(components) {
  return {
    ...components, 
    h1: CustomH1, a: CustomLink, // replace default h1 and a tags with the custom components
    Button: Button,              // add Button tag that use the antd Button component
  }
}
```

![image](https://i.imgur.com/q2qShZE.png)
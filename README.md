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


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

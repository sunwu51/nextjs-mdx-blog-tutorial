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

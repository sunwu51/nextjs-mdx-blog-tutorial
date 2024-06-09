import { Button } from 'antd';

const CustomH1 = (props) => <h1 style={{ backgroundColor: 'tomato'}} {...props} />;
const CustomLink = (props) => <a style={{ color: 'white'}} {...props} />;


export function useMDXComponents(components) {
  return {
    ...components, h1: CustomH1, a: CustomLink,  Button: Button,
  }
}
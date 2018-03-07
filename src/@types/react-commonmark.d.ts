declare module "react-commonmark" {
  type Renderer = (props: React.HTMLProps<{}>) => React.ReactNode;

  interface Props {
    source: string;
    renderers: { [x: string]: Renderer };
  }

  export default class Commonmark extends React.Component<Props> {
    static renderers: { [x: string]: Renderer };
  }
}

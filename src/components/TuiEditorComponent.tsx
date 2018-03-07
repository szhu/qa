import React from "react";
import TuiEditor from "tui-editor";

import "codemirror/lib/codemirror.css";
import "highlight.js/styles/github.css";
import "tui-editor/dist/tui-editor-contents.css";
import "tui-editor/dist/tui-editor.css";

interface Props {
  initialValue?: string;
  initialEditType: "markdown" | "wysiwyg";
  previewStyle: "tab" | "vertical";
  height: string;
}

class TuiEditorComponent extends React.Component<Props> {
  editor: TuiEditor | undefined;
  root: Element | null;

  /**
   * React lifecycle
   */

  componentDidMount() {
    let { initialValue, initialEditType, previewStyle, height } = this.props;

    if (!this.root) {
      throw new Error("Editor root not found");
    }

    this.editor = new TuiEditor({
      el: this.root,
      initialValue,
      initialEditType,
      previewStyle,
      height
    });
  }

  componentWillReceiveProps(newProps: Props) {
    let { initialValue } = this.props;

    if (!this.editor) {
      throw new Error("componentWillReceiveProps called at wrong time");
    }

    if (newProps.initialValue && newProps.initialValue !== initialValue) {
      this.editor.setValue(newProps.initialValue);
    }
  }

  /**
   * Renderers
   */

  render() {
    return <div ref={el => (this.root = el)} />;
  }

  /**
   * Helpers
   */

  get value() {
    if (!this.editor) {
      return undefined;
    }
    return this.editor.getValue();
  }
}

export default TuiEditorComponent;

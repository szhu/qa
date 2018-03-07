declare module "tui-editor" {
  export default class ToastUIEditor {
    constructor(params: {
      el: Element;
      initialValue?: string;
      initialEditType: "markdown" | "wysiwyg";
      previewStyle: "tab" | "vertical";
      height: string;
    });

    setValue(value: string): void;

    getValue(): string;

    getCodeMirror(): CodeMirror.Editor;
  }
}

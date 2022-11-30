import { $getSelection, $isRangeSelection } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $wrapNodes } from "@lexical/selection";
import ToolbarPlugin from "../../constructor/ToolbarPlugins";

/**
 * Heading Plugin
 */
export default class Heading extends ToolbarPlugin {
  /**
   * @inheritDoc
   */
  static get items() {
    return [
      {
        label: "H1",
        value: "h1",
      },
      {
        label: "H2",
        value: "h2",
      },
      {
        label: "H3",
        value: "h3",
      },
      {
        label: "H4",
        value: "h4",
      },
      {
        label: "H5",
        value: "h5",
      },
      {
        label: "H6",
        value: "h6",
      },
    ];
  }

  /**
   * Init plugin
   */
  init() {
    this.createToolbarItem("select", {
      label: "Heading",
      command: this.constructor.items,
      className: "toolbar-item",
    });
  }

  execute(command) {
    this.editor.engine.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode(command));
      }
    });
  }
}

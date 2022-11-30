import { UNDO_COMMAND } from "lexical";
import ToolbarPlugin from "../../constructor/ToolbarPlugins";

/**
 * Undo Plugin
 */
export default class Undo extends ToolbarPlugin {
  /**
   * @inheritDoc
   */
  static get name() {
    return "undo";
  }

  /**
   * Init plugin
   */
  init() {
    this.createToolbarItem("button", {
      label: "Undo",
      command: this.constructor.name,
      className: "toolbar-item",
    });
  }

  /**
   * Execute
   */
  execute() {
    this.editor.engine.dispatchCommand(UNDO_COMMAND);
  }
}

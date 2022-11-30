import { REDO_COMMAND } from "lexical";
import ToolbarPlugin from "../../constructor/ToolbarPlugins";

/**
 * Redo Plugin
 */
export default class Redo extends ToolbarPlugin {
  /**
   * @inheritDoc
   */
  static get name() {
    return "redo";
  }

  /**
   * Init plugin
   */
  init() {
    this.createToolbarItem("button", {
      label: "Redo",
      command: this.constructor.name,
      className: "toolbar-item",
    });
  }

  /**
   * Execute
   */
  execute() {
    this.editor.engine.dispatchCommand(REDO_COMMAND);
  }
}

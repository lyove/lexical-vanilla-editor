import ToolbarPlugin from "../../constructor/ToolbarPlugins";

/**
 * Underline Plugin
 */
export default class Underline extends ToolbarPlugin {
  /**
   * @inheritDoc
   */
  static get name() {
    return "underline";
  }

  /**
   * Init plugin
   */
  init() {
    this.createToolbarItem("button", {
      label: "Underline",
      command: this.constructor.name,
      className: "toolbar-item",
    });
  }
}

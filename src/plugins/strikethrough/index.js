import ToolbarPlugin from "../../constructor/ToolbarPlugins";

/**
 * Strikethrough Plugin
 */
export default class Strikethrough extends ToolbarPlugin {
  /**
   * @inheritDoc
   */
  static get name() {
    return "strikethrough";
  }

  /**
   * Init plugin
   */
  init() {
    this.createToolbarItem("button", {
      label: "Strikethrough",
      command: this.constructor.name,
      className: "toolbar-item",
    });
  }
}

import ToolbarPlugin from "../../constructor/ToolbarPlugins";

/**
 * Italic Plugin
 */
export default class Italic extends ToolbarPlugin {
  /**
   * @inheritDoc
   */
  static get name() {
    return "italic";
  }

  /**
   * Init plugin
   */
  init() {
    this.newToolbarItem({
      label: "Italic",
      command: this.constructor.name,
      className: "toolbar-item",
    });
  }
}

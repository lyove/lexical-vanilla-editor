import ToolbarPlugin from "../ToolbarPlugins";

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
      label: "italic",
      command: this.constructor.name,
    });
  }
}

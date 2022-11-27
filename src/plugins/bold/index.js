import ToolbarPlugin from "../ToolbarPlugins";

/**
 * Bold Plugin
 */
export default class Bold extends ToolbarPlugin {
  /**
   * @inheritDoc
   */
  static get name() {
    return "bold";
  }

  /**
   * Init plugin
   */
  init() {
    this.newToolbarItem({
      label: "bold",
      command: this.constructor.name,
    });
  }
}

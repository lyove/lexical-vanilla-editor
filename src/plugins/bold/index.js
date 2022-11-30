import ToolbarPlugin from "../../constructor/ToolbarPlugins";

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
    this.newToolbarItem("button", {
      label: "Bold",
      command: this.constructor.name,
      className: "toolbar-item",
    });
  }
}

import ToolbarPlugin from "../../constructor/ToolbarPlugins";

/**
 * Code Plugin
 */
export default class Code extends ToolbarPlugin {
  /**
   * @inheritDoc
   */
  static get name() {
    return "code";
  }

  /**
   * Init plugin
   */
  init() {
    this.newToolbarItem(
      "button", 
      {
        label: "Code",
        command: this.constructor.name,
        className: "toolbar-item",
      },
      this.execute,
    );
  }
}

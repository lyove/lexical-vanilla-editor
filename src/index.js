import CoreEditor from "./editor";
import "./style.css";

// Toolbar plugins
import Bold from "./plugins/bold";
import Italic from "./plugins/italic";

/**
 * Editor
 */
export default class Editor extends CoreEditor {
  /**
   * Default plugins
   */
  static get defaultPlugins() {
    return [Bold, Italic];
  }
}

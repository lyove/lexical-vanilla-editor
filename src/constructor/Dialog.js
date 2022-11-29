/**
 * Dialog
 */
export default class Dialog {
  /**
   * Editor
   *
   * @type {Editor}
   */
  #editor;

  /**
   * Allows read access to editor
   *
   * @return {Editor}
   */
  get editor() {
    return this.#editor;
  }

  /**
   * Initializes a new plugin
   *
   * @param {Editor} editor
   */
  constructor(editor) {
    this.#editor = editor;
  }
}

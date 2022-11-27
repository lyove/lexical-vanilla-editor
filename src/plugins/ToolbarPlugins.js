import { FORMAT_TEXT_COMMAND } from "lexical";

import { TagName } from "../helper/Enum";

/**
 * ToolbarPlugin
 */
export default class ToolbarPlugin {
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

  /**
   * Adds a toolbar button
   *
   * @protected
   * @param {object} prams
   * @return {void}
   */
  newToolbarItem({ label, command, uuid }) {
    this.editor.toolbar.appendChild(
      this.#newToolbarButton({
        label,
        command,
        uuid,
      }),
    );
  }

  /**
   * Create a button
   *
   * @param {object} prams
   * @return {HTMLElement}
   */
  #newToolbarButton({ label, command, uuid }) {
    const text = `<span class='btn-label'>${label}</span>`;
    const attributes = {
      type: "button",
      "data-command": command,
      ...(uuid ? { "data-uuid": uuid } : {}),
    };

    const ButtonItem = this.editor.dom.createElement(TagName.BUTTON, {
      attributes,
      html: `${text}`,
    });

    ButtonItem.addEventListener("click", () => {
      this.editor.engine.dispatchCommand(FORMAT_TEXT_COMMAND, command);
    });

    return ButtonItem;
  }
}

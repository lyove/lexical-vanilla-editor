import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
} from "lexical";

import { $findMatchingParent } from "@lexical/utils";

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

  #activeEditor;

  get activeEditor() {
    return this.#activeEditor;
  }

  isBold = false;

  isItalic = false;

  /**
   * Initializes a new plugin
   *
   * @param {Editor} editor
   */
  constructor(editor) {
    this.#editor = editor;

    this.#activeEditor = editor.engine;

    editor.engine.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        this.updateToolbar();
        this.#activeEditor = newEditor;
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
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
      class: "toolbar-item spaced",
      html: `${text}`,
    });

    ButtonItem.addEventListener("click", () => {
      this.#activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, command);

      this.#activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          console.log(selection);
        }
      });
    });

    return ButtonItem;
  }

  updateToolbar() {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = this.#activeEditor.getElementByKey(elementKey);

      // Update text format
      this.isBold = selection.hasFormat("bold");
      this.isItalic = selection.hasFormat("italic");
    }
  }
}

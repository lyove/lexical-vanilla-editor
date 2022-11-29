import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
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
  newToolbarItem({ label, command, className, uuid }) {
    this.editor.toolbar.appendChild(
      this.#newToolbarButton({
        label,
        command,
        className,
        uuid,
      }),
    );
  }

  /**
   * Create a button
   *
   * @param {object} prams
   * @param {function} execute
   * @return {HTMLElement}
   */
  #newToolbarButton({ label, command, className, uuid }) {
    const ButtonItem = this.editor.dom.createElement(TagName.BUTTON, {
      attributes: {
        type: "button",
        "data-command": command,
        class: `${className}`,
        ...(uuid ? { "data-uuid": uuid } : {}),
      },
      html: label,
    });

    ButtonItem.addEventListener("click", () => {
      this.execute(command);
    });

    return ButtonItem;
  }

  /**
   * Execute
   */
  execute(command) {
    this.editor.engine.dispatchCommand(FORMAT_TEXT_COMMAND, command);
  }

  /**
   * Update Toolbar
   * Todo: WIP
   */
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
      const elementDOM = this.editor.engine.getElementByKey(elementKey);

      console.log(elementDOM);
    }
  }
}

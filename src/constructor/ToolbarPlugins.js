import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  FORMAT_TEXT_COMMAND,
} from "lexical";

import { $findMatchingParent } from "@lexical/utils";

import { TagName } from "../helper/Enum";
import { isArray } from "../helper/Utils";

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
   * @param {string} type
   * @param {object} prams
   * @return {void}
   */
  createToolbarItem(type, { label, command, className, uuid }) {
    switch (type) {
      case "button":
        this.editor.toolbar.appendChild(
          this.#createButton({
            label,
            command,
            className,
            uuid,
          }),
        );
        break;
      
      case "select":
        this.editor.toolbar.appendChild(
          this.#createSelect({
            label,
            command,
            className,
            uuid,
          }),
        );
        break;
      
      default:
    }
    
  }

  /**
   * Create a button element
   *
   * @param {object} prams
   * @return {HTMLElement}
   */
  #createButton({ label, command, className, uuid }) {
    const ButtonElement = this.editor.dom.createElement(TagName.BUTTON, {
      attributes: {
        type: "button",
        "data-command": command,
        class: `${className}`,
        ...(uuid ? { "data-uuid": uuid } : {}),
      },
      html: label,
    });

    ButtonElement.addEventListener("click", () => {
      this.execute(command);
    });

    return ButtonElement;
  }

  /**
   * Create a select element
   *
   * @param {object} prams
   * @return {HTMLElement}
   */
  #createSelect({ label, command, className, uuid }) {
    const SelectElement = this.editor.dom.createElement(TagName.SELECT, {
      attributes: {
        class: `${className}`,
        ...(uuid ? { "data-uuid": uuid } : {}),
      },
      html: label,
    });

    if (isArray(command)) {
      command.forEach(item => {
        const OptionElement = this.editor.dom.createElement(TagName.OPTION, {
          attributes: {
            value: item.value,
          },
          html: item.label
        });
    
        SelectElement.appendChild(OptionElement);
      });
    }

    SelectElement.addEventListener("change", (e) => {
      this.execute(command);
    });

    return SelectElement;
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

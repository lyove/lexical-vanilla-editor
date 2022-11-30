import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isParentElementRTL, $wrapNodes, $isAtNodeEnd } from "@lexical/selection";
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from "@lexical/utils";

import { TagName } from "../helper/Enum";
import { isArray } from "../helper/Utils";
import Icons from "../images/icons";

const LowPriority = 1;

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
   * Can undo
   */
  canUndo = false;

  /**
   * Can redo
   */
  canRedo = false;

  /**
   * Selected element key
   */
  selectedElementKey = null;

  /**
   * BlockType
   */
  blockType = "paragraph";

  /**
   * Code language
   */
  codeLanguage = "";

  /**
   * Current selection format
   */
  currentFormat = {};

  /**
   * Initializes a new plugin
   *
   * @param {Editor} editor
   */
  constructor(editor) {
    this.#editor = editor;

    const { engine } = editor;

    mergeRegister(
      engine.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          this.updateToolbar();
        });
      }),
      engine.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          this.updateToolbar();
          return false;
        },
        LowPriority,
      ),
      engine.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          this.canUndo = payload;
          return false;
        },
        LowPriority,
      ),
      engine.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          this.canRedo = payload;
          return false;
        },
        LowPriority,
      ),
    );

    // Listen editor root remove
    const mutationObserver = new MutationObserver((mutationList, observer) => {
      for (let mutationRecord of mutationList) {
        if (mutationRecord.removedNodes) {
          for (let removedNode of mutationRecord.removedNodes) {
            if (removedNode.localName === TagName.EDITOR) {
              // remove listener
            }
          }
        }
      }
    });
    mutationObserver.observe(this.editor.container, {
      childList: true,
      subtree: true,
      attributes: true,
    });
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
        "aria-label": label,
        ...(uuid ? { "data-uuid": uuid } : {}),
      },
      // html: label,
    });

    ButtonElement.appendChild(
      this.editor.dom.createElement(TagName.I, {
        attributes: {
          class: `format ${command}`,
        },
        html: Icons[command] || "",
      }),
    );

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
      command.forEach((item) => {
        const OptionElement = this.editor.dom.createElement(TagName.OPTION, {
          attributes: {
            value: item.value,
          },
          html: item.label,
        });

        SelectElement.appendChild(OptionElement);
      });
    }

    SelectElement.addEventListener("change", (e) => {
      this.execute(e.target.value);
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
   * Get selected node
   * @param {*} selection
   * @returns
   */
  getSelectedNode(selection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
      return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
      return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
  }

  /**
   * Update Toolbar
   * Todo: WIP
   */
  updateToolbar() {
    const { engine } = this.editor;
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

      const elementKey = element.getKey();
      const elementDOM = engine.getElementByKey(elementKey);

      if (elementDOM !== null) {
        this.selectedElementKey = elementKey;
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          this.blockType = type;
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          this.blockType = type;
          if ($isCodeNode(element)) {
            this.codeLanguage = element.getLanguage() || getDefaultCodeLanguage();
          }
        }
      }

      // Update text format
      this.currentFormat = {
        isBold: selection.hasFormat("bold"),
        isItalic: selection.hasFormat("italic"),
        isUnderline: selection.hasFormat("underline"),
        isStrikethrough: selection.hasFormat("strikethrough"),
        isCode: selection.hasFormat("code"),
        isRTL: $isParentElementRTL(selection),
      };

      // Update links
      const node = this.getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        this.currentFormat.isLink = true;
      } else {
        this.currentFormat.isLink = false;
      }
    }
  }
}

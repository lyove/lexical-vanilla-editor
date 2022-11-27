import {
  createEditor,
  $getRoot,
  $getSelection,
  $createParagraphNode,
  $createTextNode,
} from "lexical";

import Dom from "./helper/Dom";
import { TagName } from "./helper/Enum";

import theme from "./theme";

const HISTORY_MERGE_OPTIONS = {
  tag: "history-merge",
};

/**
 * Core Editor
 */
export default class Editor {
  /**
   * DOM manager
   *
   * @type {Dom}
   */
  #dom;

  /**
   * Allows read access to DOM manager
   *
   * @return {Dom}
   */
  get dom() {
    return this.#dom;
  }

  /**
   * Corresponding DOM element of the editor wrapper
   *
   * @type {HTMLElement}
   */
  #container;

  /**
   * Allows read access to corresponding DOM element of the editor wrapper
   *
   * @return {HTMLElement}
   */
  get container() {
    return this.#container;
  }

  /**
   * Corresponding DOM element of the main toolbar
   *
   * @type {HTMLElement}
   */
  #toolbar;

  /**
   * Allows read access to corresponding DOM element of the main toolbar
   *
   * @return {HTMLElement}
   */
  get toolbar() {
    return this.#toolbar;
  }

  /**
   * Corresponding DOM element of the editor content textarea
   *
   * @type {HTMLElement}
   */
  #textarea;

  /**
   * Allows read access to corresponding DOM element of the editor content textarea
   *
   * @return {HTMLElement}
   */
  get textarea() {
    return this.#textarea;
  }

  /**
   * Registered plugins
   *
   * @type {Map<string, Plugin>}
   */
  #plugins = new Map();

  /**
   * Allows read access to plugin manager
   *
   * @return {PluginManager}
   */
  get plugins() {
    return this.#plugins;
  }

  /**
   * Configuration
   *
   * @type {Object}
   */
  config = {};

  /**
   * Editor engine
   *
   * @type {Object}
   */
  engine = null;

  /**
   * Create a new instance of editor with given configuration
   *
   * @param {HTMLElement} orig
   * @param {Object} [config = {}]
   */
  constructor(orig, config = {}) {
    this.#dom = new Dom(orig.ownerDocument);

    // Container
    this.#container = this.dom.createElement(TagName.EDITOR);
    orig.appendChild(this.container);

    // Toolbar
    this.#toolbar = this.dom.createElement(TagName.TOOLBAR);
    this.container.appendChild(this.toolbar);

    // Textarea
    // this.#textarea = this.dom.createElement(TagName.TEXTAREA, {
    //   attributes: {
    //     contentEditable: true,
    //   },
    // });
    this.#textarea = this.dom.createElement(TagName.DIV, {
      attributes: {
        contentEditable: true,
      },
    });
    this.container.appendChild(this.textarea);

    // Config
    const { editable: initEditable, inittheme: initTheme, initNameSpace, editorState } = config;
    this.config = {
      ...config,
      editable: initEditable !== undefined ? initEditable : true,
      theme: {
        ...theme,
        ...initTheme,
      },
      namespace: initNameSpace || "VanleEditor",
    };

    // Engine
    const newEditor = createEditor(this.config);
    this.initEditor(newEditor, editorState);
    this.engine = newEditor;

    // Set rootElement
    this.engine.setRootElement(this.textarea);
  }

  // InitEditor
  initEditor(editor, initEditorState) {
    if (initEditorState === null) {
      return;
    } else if (initEditorState === undefined) {
      editor.update(() => {
        const root = $getRoot();
        if (root.isEmpty()) {
          const paragraph = $createParagraphNode();
          root.append(paragraph);
          const activeElement = document.activeElement;
          if (
            $getSelection() !== null ||
            (activeElement !== null && activeElement === editor.getRootElement())
          ) {
            paragraph.select();
          }
        }
      }, HISTORY_MERGE_OPTIONS);
    } else if (initEditorState !== null) {
      switch (typeof initEditorState) {
        case "string": {
          const parsedEditorState = editor.parseEditorState(initEditorState);
          editor.setEditorState(parsedEditorState, HISTORY_MERGE_OPTIONS);
          break;
        }
        case "object": {
          editor.setEditorState(initEditorState, HISTORY_MERGE_OPTIONS);
          break;
        }
        case "function": {
          editor.update(() => {
            const root = $getRoot();
            if (root.isEmpty()) {
              initEditorState(editor);
            }
          }, HISTORY_MERGE_OPTIONS);
          break;
        }
      }
    }
  }

  // Init
  init() {
    // default plugins
    const builtin = this.constructor.defaultPlugins || [];

    const pluginsSet = new Set();

    builtin.forEach((plugin) => {
      pluginsSet.add(plugin);
    });

    pluginsSet.forEach((plugin) => {
      this.plugins.set(plugin.name, new plugin(this));
    });

    this.plugins.forEach((plugin) => plugin.init());
  }

  // update
  update() {
    // Inside the `editor.update` you can use special $ prefixed helper functions.
    // These functions cannot be used outside the closure, and will error if you try.
    this.engine.update(() => {
      // Get the RootNode from the EditorState
      const root = $getRoot();

      // Get the selection from the EditorState
      const selection = $getSelection();

      // Create a new ParagraphNode
      const paragraphNode = $createParagraphNode();

      // Create a new TextNode
      const textNode = $createTextNode("Hello world");

      // Append the text node to the paragraph
      paragraphNode.append(textNode);

      // Finally, append the paragraph to the root
      root.append(paragraphNode);
    });
  }

  // Create
  static create(element, config = {}) {
    const editor = new this(element, config);

    editor.init();
    editor.update();

    return editor;
  }
}

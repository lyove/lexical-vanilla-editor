import { createEditor, $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  registerRichText,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { $createListItemNode, $createListNode, ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { $createLinkNode, AutoLinkNode, LinkNode } from "@lexical/link";
import { HashtagNode } from "@lexical/hashtag";

import Dom from "./helper/Dom";
import { TagName } from "./helper/Enum";
import Dispatcher from "./constructor/Dispatcher";
import plugins from "./plugins";
import theme from "./theme";

// Init content
function initEditor(editor) {
  // Init content
  editor.update(() => {
    // Get the RootNode from the EditorState
    const root = $getRoot();
    if (root.getFirstChild() === null) {
      const heading = $createHeadingNode("h1");
      heading.append($createTextNode("Welcome to the playground"));
      root.append(heading);
      const quote = $createQuoteNode();
      quote.append(
        $createTextNode(
          "In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of editor. " +
            "You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.",
        ),
      );
      root.append(quote);
      const paragraph = $createParagraphNode();
      paragraph.append(
        $createTextNode("The playground is a demo environment built with "),
        $createTextNode("@lexical/react").toggleFormat("code"),
        $createTextNode("."),
        $createTextNode(" Try typing in "),
        $createTextNode("some text").toggleFormat("bold"),
        $createTextNode(" with "),
        $createTextNode("different").toggleFormat("italic"),
        $createTextNode(" formats."),
      );
      root.append(paragraph);
      const paragraph2 = $createParagraphNode();
      paragraph2.append(
        $createTextNode(
          "Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!",
        ),
      );
      root.append(paragraph2);
      const paragraph3 = $createParagraphNode();
      paragraph3.append($createTextNode("If you'd like to find out more about Lexical, you can:"));
      root.append(paragraph3);
      const list = $createListNode("bullet");
      list.append(
        $createListItemNode().append(
          $createTextNode("Visit the "),
          $createLinkNode("https://lexical.dev/").append($createTextNode("Lexical website")),
          $createTextNode(" for documentation and more information."),
        ),
        $createListItemNode().append(
          $createTextNode("Check out the code on our "),
          $createLinkNode("https://github.com/facebook/lexical").append(
            $createTextNode("GitHub repository"),
          ),
          $createTextNode("."),
        ),
        $createListItemNode().append(
          $createTextNode("Playground code can be found "),
          $createLinkNode(
            "https://github.com/facebook/lexical/tree/main/packages/lexical-playground",
          ).append($createTextNode("here")),
          $createTextNode("."),
        ),
        $createListItemNode().append(
          $createTextNode("Join our "),
          $createLinkNode("https://discord.com/invite/KmG4wQnnD9").append(
            $createTextNode("Discord Server"),
          ),
          $createTextNode(" and chat with the team."),
        ),
      );
      root.append(list);
      const paragraph4 = $createParagraphNode();
      paragraph4.append(
        $createTextNode(
          "Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance :).",
        ),
      );
      root.append(paragraph4);
    }
  });
}

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
   * Event dispatcher of the editor
   *
   * @type {Dispatcher}
   */
  #editorDispatcher;

  /**
   * Allows read access to event dispatcher of the editor
   *
   * @return {Dispatcher}
   */
  get editorDispatcher() {
    return this.#editorDispatcher;
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
  #plugins = new Set();

  /**
   * Allows read access to plugin manager
   *
   * @return {Plugin}
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
    // this.#editorDispatcher = new Dispatcher(this.container);

    // Toolbar
    this.#toolbar = this.dom.createElement(TagName.TOOLBAR, { attributes: { role: "toolbar" } });
    this.container.appendChild(this.toolbar);

    // Textarea
    this.#textarea = this.dom.createElement(TagName.TEXTAREA);
    this.textarea.appendChild(
      this.dom.createElement(TagName.DIV, {
        attributes: {
          contentEditable: true,
          class: "textarea-inner",
        },
      }),
    );
    this.container.appendChild(this.textarea);

    // Plugins
    (plugins || []).forEach((plugin) => {
      this.plugins.add(plugin);
    });

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
      nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        HashtagNode,
      ],
      // editorState: editorState,
    };

    // Engine
    this.engine = createEditor(this.config);

    // Set rootElement
    this.engine.setRootElement(this.textarea.firstChild);

    // Register richTex
    registerRichText(this.engine);
  }

  // Init
  init() {
    // Init plugins
    this.plugins.forEach((plugin) => {
      const pluginInst = new plugin(this);
      pluginInst.init();
    });

    // Init content
    initEditor(this.engine);
  }

  // Create
  static create(element, config = {}) {
    const editor = new this(element, config);
    editor.init();

    return editor;
  }
}

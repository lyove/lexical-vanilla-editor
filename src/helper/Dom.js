import { isUndefined } from "./Utils";

/**
 * DOM Manager
 */
export default class Dom {
  /**
   * Corresponding Window object
   *
   * @type {Window}
   */
  #window;

  /**
   * Allows read access to corresponding Window object
   *
   * @return {Window}
   */
  get window() {
    return this.#window;
  }

  /**
   * Correspondig DOM Document
   *
   * @type {Document}
   */
  #document;

  /**
   * Allows read access to correspondig DOM Document
   *
   * @return {Document}
   */
  get document() {
    return this.#document;
  }

  /**
   * Initializes a new DOM manager
   *
   * @param {Editor} editor
   * @param {Document} document
   */
  constructor(document) {
    this.#document = document;
    this.#window = this.document.defaultView;
  }

  /**
   * Registers custom element
   *
   * @param {string} name
   * @param {function} constructor
   * @param {object} options
   * @return {void}
   */
  registerElement(name, constructor, options) {
    if (isUndefined(this.window?.customElements.get(name))) {
      this.window?.customElements.define(name, constructor, options);
    }
  }

  /**
   * Creates HTML element in editor document
   *
   * @param {string} name
   * @param {Object.<string, string>} [attributes = {}]
   * @param {string} [html = '']
   * @return {HTMLElement}
   */
  createElement(name, { attributes = {}, html = "" } = {}) {
    const element = this.document.createElement(name);
    element.innerHTML = html;
    Object.entries(attributes).forEach(([key, val]) => val && element.setAttribute(key, `${val}`));
    return element;
  }
}

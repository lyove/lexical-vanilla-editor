import { TagName } from "../helper/Enum";

/**
 * Event Dispatcher
 */
export default class Dispatcher {
  /**
   * Managed element
   *
   * @type {HTMLElement}
   */
  #element;

  /**
   * Initializes a new event dispatcher
   *
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.#element = element;
    this.register((mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((element) => {
          if (element instanceof HTMLElement) {
            console.log("observer: ", element);
          }
        });
        mutation.removedNodes.forEach((element) => {
          if (element instanceof HTMLElement) {
            console.log("observer: ", element);
          }
        });
      });
    });
  }

  /**
   * Registers a mutation observer on managed element
   *
   * @param {function} call
   * @param {MutationObserverInit} [opts = {childList: true, subtree: true}]
   * @return {void}
   */
  register(call, opts = { childList: true, subtree: true, attributes: true }) {
    const observer = new MutationObserver(call);
    observer.observe(this.#element, opts);
  }

  /**
   * Dispatches an event on managed element
   *
   * @param {string} type
   * @param {HTMLElement|undefined} [element = undefined]
   * @param {HTMLElement|undefined} [target = undefined]
   * @return {void}
   */
  dispatch(type, element = undefined, target = undefined) {
    this.#element.dispatchEvent(
      new CustomEvent(type, { detail: { element: element, target: target } }),
    );
  }
}

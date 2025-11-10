export default $
declare namespace $ {
  /**
   * Query selectors which return arrays of the resulted
   * node lists.
   */
  function id(selector: any, $context: any): any
  function tag(selector: any, $context: any): any
  function qs(selector: any, $context: any): any
  function qsa(selector: any, $context: any): any
  function parent($node: any, selector: any): any
  /**
   * Create a document fragment, a text node with text
   * or an element with/without classes.
   */
  function create(name: any, clazz: any): any
  /**
   * Clone a DOM node (text, element or fragment) deeply
   * or childlessly.
   */
  function clone($node: any, deep?: boolean): any
  /**
   * Remove a node (text, element or fragment).
   */
  function remove($node: any): any
  /**
   * Set attributes all in once with an object.
   */
  function setAttr(target: any, attr: any): any
  /**
   * Indicate whether the given node is an
   * element.
   */
  function isElmt($node: any): boolean
  /**
   * Indicate whether the given node should
   * be ignored (`<wbr>` or comments).
   */
  function isIgnorable($node: any): boolean
  /**
   * Convert array-like objects into real arrays.
   */
  function makeArray(object: any): any
  /**
   * Extend target with an object.
   */
  function extend(target: any, object: any): any
}

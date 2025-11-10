export function NON_INLINE_PROSE(el: any): any
export namespace NON_PROSE_ELEMENTS {
  let br: number
  let hr: number
  let script: number
  let style: number
  let img: number
  let video: number
  let audio: number
  let canvas: number
  let svg: number
  let map: number
  let object: number
  let input: number
  let textarea: number
  let select: number
  let option: number
  let optgroup: number
  let button: number
}
export namespace NON_CONTIGUOUS_PROSE_ELEMENTS {
  export const address: number
  export const article: number
  export const aside: number
  export const blockquote: number
  export const dd: number
  export const div: number
  export const dl: number
  export const fieldset: number
  export const figcaption: number
  export const figure: number
  export const footer: number
  export const form: number
  export const h1: number
  export const h2: number
  export const h3: number
  export const h4: number
  export const h5: number
  export const h6: number
  export const header: number
  export const hgroup: number
  const hr_1: number
  export { hr_1 as hr }
  export const main: number
  export const nav: number
  export const noscript: number
  export const ol: number
  export const output: number
  export const p: number
  export const pre: number
  export const section: number
  export const ul: number
  const br_1: number
  export { br_1 as br }
  export const li: number
  export const summary: number
  export const dt: number
  export const details: number
  export const rp: number
  export const rt: number
  export const rtc: number
  const script_1: number
  export { script_1 as script }
  const style_1: number
  export { style_1 as style }
  const img_1: number
  export { img_1 as img }
  const video_1: number
  export { video_1 as video }
  const audio_1: number
  export { audio_1 as audio }
  const canvas_1: number
  export { canvas_1 as canvas }
  const svg_1: number
  export { svg_1 as svg }
  const map_1: number
  export { map_1 as map }
  const object_1: number
  export { object_1 as object }
  const input_1: number
  export { input_1 as input }
  const textarea_1: number
  export { textarea_1 as textarea }
  const select_1: number
  export { select_1 as select }
  const option_1: number
  export { option_1 as option }
  const optgroup_1: number
  export { optgroup_1 as optgroup }
  const button_1: number
  export { button_1 as button }
  export const table: number
  export const tbody: number
  export const thead: number
  export const th: number
  export const tr: number
  export const td: number
  export const caption: number
  export const col: number
  export const tfoot: number
  export const colgroup: number
}
export namespace PRESETS {
  namespace prose {
    export { NON_INLINE_PROSE as forceContext }
    export function filterElements(el: any): any
  }
}
/**
 * Finder -- encapsulates logic to find and replace.
 */
export class DOMFinder {
  constructor(node: any, options: any)
  node: any
  options: any
  /**
   * Prepares a single match with useful meta info:
   */
  prepMatch(match: any, matchIndex: any, characterOffset: any): any
  reverts: any[]
  matches: any[]
  /**
   * Searches for all matches that comply with the instance's 'match' option
   */
  search(): any[]
  /**
   * Gets aggregate text within subject node
   */
  getAggregateText(): any[]
  /**
   * Steps through the target node, looking for matches, and
   * calling replaceFn when a match is found.
   */
  processMatches(): void
  /**
   * Reverts ... TODO
   */
  revert(): void
  prepareReplacementString(string: any, portion: any, match: any): any
  getPortionReplacementNode(portion: any, match: any, matchIndex: any): any
  replaceMatch(match: any, startPortion: any, innerPortions: any, endPortion: any): any
}

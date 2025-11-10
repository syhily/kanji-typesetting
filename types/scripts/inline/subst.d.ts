/** @returns {() => boolean} */
import type { Finder } from '../find'

export function isVowelCombLigaNormal(): () => boolean
/** @returns {() => boolean} */
export function isVowelICombLigaNormal(): () => boolean
/** @returns {() => boolean} */
export function isZhuyinCombLigaNormal(): () => boolean
/**
 * @param {Document} [context]
 * @returns {void}
 */
export function substInaccurateChar(context?: Document): void
/** @type {(context?: Document) => Finder} */
export const substVowelCombLiga: (context?: Document) => Finder
/** @type {(context?: Document) => Finder} */
export const substVowelICombLiga: (context?: Document) => Finder
/** @type {(context?: Document) => Finder} */
export const substZhuyinCombLiga: (context?: Document) => Finder
/** @type {(context?: Document) => Finder} */
export const substCombLigaWithPUA: (context?: Document) => Finder
/** @type {Record<string, any>} */
export const subst: Record<string, any>

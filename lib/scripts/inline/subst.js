/* eslint-disable unused-imports/no-unused-vars */
/**
 * @file Substitution utilities for comb ligatures and inaccurate chars
 */

import { Finder } from '../find'
import { compareCanvases, writeOnCanvas } from '../locale/detect-font'
import $ from '../method'
import { TYPESET } from '../regex'

const SELECTOR_TO_IGNORE = 'textarea, code, kbd, samp, pre'

/**
 * @param {string} font
 * @param {string} treat
 * @param {string} control
 * @returns {() => boolean}
 */
function createCompareFactory(font, treat, control) {
  return function () {
    if (!document)
      return true
    const a = writeOnCanvas(treat, font)
    const b = writeOnCanvas(control, font)
    return compareCanvases(a, b)
  }
}

/** @returns {() => boolean} */
export function isVowelCombLigaNormal() {
  return createCompareFactory('"Romanization Sans"', '\u0061\u030D', '\uDB80\uDC61')
}

/** @returns {() => boolean} */
export function isVowelICombLigaNormal() {
  return createCompareFactory('"Romanization Sans"', '\u0069\u030D', '\uDB80\uDC69')
}

/** @returns {() => boolean} */
export function isZhuyinCombLigaNormal() {
  return createCompareFactory('"Zhuyin Kaiti"', '\u31B4\u0307', '\uDB8C\uDDB4')
}

/**
 * @param {Array<[string, string]>} regexToSubst
 * @returns {(context?: Document) => Finder}
 */
function createSubstFactory(regexToSubst) {
  return function (context) {
    context = context || document
    const finder = new Finder(context).avoid(SELECTOR_TO_IGNORE)

    regexToSubst.forEach((pattern) => {
      finder.replace(new RegExp(pattern[0], 'gi'), (portion, match) => {
        const ret = charCombLiga()
        ret.innerHTML = `<h-inner>${match[0]}</h-inner>`
        ret.setAttribute('display-as', pattern[1])
        return portion.index === 0 ? ret : ''
      })
    })

    return finder
  }
}

/** @returns {HTMLElement} */
function charCombLiga() {
  return $.create('h-char', 'comb-liga')
}

/** @type {(context?: Document) => Finder} */
export const substVowelCombLiga = createSubstFactory(TYPESET['display-as']['comb-liga-vowel'])
/** @type {(context?: Document) => Finder} */
export const substVowelICombLiga = createSubstFactory(TYPESET['display-as']['comb-liga-vowel-i'])
/** @type {(context?: Document) => Finder} */
export const substZhuyinCombLiga = createSubstFactory(TYPESET['display-as']['comb-liga-zhuyin'])
/** @type {(context?: Document) => Finder} */
export const substCombLigaWithPUA = createSubstFactory(TYPESET['display-as']['comb-liga-pua'])

/**
 * @param {Document} [context]
 * @returns {void}
 */
export function substInaccurateChar(context) {
  context = context || document
  const finder = new Finder(context)
  finder.avoid(SELECTOR_TO_IGNORE)

  TYPESET['inaccurate-char'].forEach(pattern =>
    finder.replace(new RegExp(pattern[0], 'gi'), pattern[1]),
  )
  return finder
}

/** @type {Record<string, any>} */
export const subst = {
  'comb-liga-vowel': null,
  'comb-liga-vowel-i': null,
  'comb-liga-zhuyin': null,
  'inaccurate-char': null,

  substVowelCombLiga() {
    this['comb-liga-vowel'] = substVowelCombLiga(this.context)
    return this
  },

  substVowelICombLiga() {
    this['comb-liga-vowel-i'] = substVowelICombLiga(this.context)
    return this
  },

  substZhuyinCombLiga() {
    this['comb-liga-zhuyin'] = substZhuyinCombLiga(this.context)
    return this
  },

  substCombLigaWithPUA() {
    if (!isVowelCombLigaNormal()) {
      this['comb-liga-vowel'] = substVowelCombLiga(this.context)
    }
    else if (!isVowelICombLigaNormal()) {
      this['comb-liga-vowel-i'] = substVowelICombLiga(this.context)
    }

    if (!isZhuyinCombLigaNormal()) {
      this['comb-liga-zhuyin'] = substZhuyinCombLiga(this.context)
    }
    return this
  },

  revertVowelCombLiga() {
    try {
      this['comb-liga-vowel']?.revert('all')
    }
    catch (e) {}
    return this
  },

  revertVowelICombLiga() {
    try {
      this['comb-liga-vowel-i']?.revert('all')
    }
    catch (e) {}
    return this
  },

  revertZhuyinCombLiga() {
    try {
      this['comb-liga-zhuyin']?.revert('all')
    }
    catch (e) {}
    return this
  },

  revertCombLigaWithPUA() {
    try {
      this['comb-liga-vowel']?.revert('all')
      this['comb-liga-vowel-i']?.revert('all')
      this['comb-liga-zhuyin']?.revert('all')
    }
    catch (e) {}
    return this
  },

  substInaccurateChar() {
    this['inaccurate-char'] = substInaccurateChar(this.context)
    return this
  },

  revertInaccurateChar() {
    try {
      this['inaccurate-char']?.revert('all')
    }
    catch (e) {}
    return this
  },
}

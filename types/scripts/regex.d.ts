export namespace UNICODE {
  import cjk = UNICODE.hanzi

  export { cjk }
  import greek = UNICODE.ellinika

  export { greek }
  import cyrillic = UNICODE.kirillica

  export { cyrillic }
  import hangul = UNICODE.eonmun

  export { hangul }
}
export const TYPESET: {
  'char': {
    punct: {
      all: RegExp
      open: RegExp
      end: RegExp
      sing: RegExp
    }
    biaodian: {
      all: RegExp
      open: RegExp
      close: RegExp
      end: RegExp
      liga: RegExp
    }
    cjk: RegExp
    hanzi: RegExp
    latin: RegExp
    greek: RegExp
    ellinika: RegExp
    cyrillic: RegExp
    kirillica: RegExp
    kana: RegExp
    eonmun: RegExp
    hangul: RegExp
  }
  'group': {
    biaodian: RegExp[]
    punct: any
    cjk: RegExp
    hanzi: RegExp
    western: RegExp
    kana: RegExp
    hangul: RegExp
    eonmun: RegExp
  }
  'jinze': {
    hanging: RegExp
    touwei: RegExp
    tou: RegExp
    wei: RegExp
    middle: RegExp
  }
  'zhuyin': {
    form: RegExp
    diao: RegExp
  }
  'hws': {
    base: RegExp[]
    strict: RegExp[]
  }
  'display-as': {
    'ja-font-for-hant': string[]
    'comb-liga-pua': string[][]
    'comb-liga-vowel': string[][]
    'comb-liga-zhuyin': string[][]
  }
  'inaccurate-char': string[][]
}

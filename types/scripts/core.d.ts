import type { renderHanging } from './inline/hanging'
import type { renderHWS, renderHWSStrict } from './inline/hws'
import type { renderJiya, revertJiya } from './inline/jiya'
import type { renderRuby } from './locale/h-ruby'
import type { initCond } from './locale/init-cond'
import type { renderDecoLine, renderElem, renderEm } from './locale/normalize'
import type { correctBiaodian } from './typography/biaodian'

export default class Han {
  static version: string
  static allSteps: {
    initCond: typeof initCond
    renderElem: typeof renderElem
    renderRuby: typeof renderRuby
    renderDecoLine: typeof renderDecoLine
    renderEm: typeof renderEm
    renderJiya: typeof renderJiya
    revertJiya: typeof revertJiya
    renderHanging: typeof renderHanging
    correctBiaodian: typeof correctBiaodian
    renderHWS: typeof renderHWS
    renderHWSStrict: typeof renderHWSStrict
    substCombLigaWithPUA: (context?: Document) => import('./find').Finder
  }

  constructor(context: any, condition: any)
  context: any
  condition: any
  routine: string[]
  setRoutine(routine: any): this
  render(routine?: any): this
}

import { createBDChar, Finder } from '../find'
import support from '../locale/support'
import { document } from '../vars'

export function correctBiaodian(context) {
  context = context || document
  const finder = new Finder(context)

  finder
    .avoid('h-char')
    .replace(/([‘“])/g, (portion) => {
      const $char = createBDChar(portion.text)
      $char.classList.add('bd-open', 'punct')
      return $char
    })
    .replace(/([’”])/g, (portion) => {
      const $char = createBDChar(portion.text)
      $char.classList.add('bd-close', 'bd-end', 'punct')
      return $char
    })

  return support.unicodeRange
    ? finder
    : finder.charify({ biaodian: true })
}

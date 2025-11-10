import { root } from '../vars'
import support from './support'

export function initCond(target) {
  target = target || root
  let ret = ''

  for (const feature in support) {
    const clazz = (support[feature] ? '' : 'no-') + feature

    target.classList.add(clazz)
    ret += `${clazz} `
  }

  return ret
}

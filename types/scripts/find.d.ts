import { Fibre } from './lib/fibre'

export function getFuncOrElmt(obj: any): any
export function createBDGroup(portion: any): any
export function createBDChar(char: any): any
export function getBDType(char: any): '' | 'bd-open' | 'bd-close bd-end' | 'bd-end bd-cop' | 'bd-end' | 'bd-liga' | 'bd-middle'
export const isNodeNormalizeNormal: boolean
export class Finder extends Fibre {
  normalize(): this
  jinzify(selector: any): this
  groupify(option: any): this
  charify(option: any): this
}

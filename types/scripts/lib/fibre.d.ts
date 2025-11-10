export class Fibre {
  static matches(node: any, selector: any): any
  constructor(context: any)
  version: string
  finder: any[]
  context: any
  portionMode: string
  selector: any
  preset: string
  init(context: any, noPreset: any): this
  filterFn(node: any): boolean
  boundaryFn(node: any): any
  filter(selector: any): this
  endFilter(all: any): this
  avoid(selector: any): this
  endAvoid(all: any): this
  addBoundary(selector: any): this
  removeBoundary(): this
  setMode(portionMode: any): this
  replace(regexp: any, newSubStr: any): this
  wrap(regexp: any, strElemName: any): this
  revert(level: any): this
}

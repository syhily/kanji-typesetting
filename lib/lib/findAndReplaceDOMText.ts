/**
 * findAndReplaceDOMText v 0.4.6
 * @author James Padolsey http://james.padolsey.com
 * @license http://unlicense.org/UNLICENSE
 *
 * TypeScript port of findAndReplaceDOMText v0.4.6
 * Converted from JS to TS with types to satisfy tests.
 */
type PortionMode = 'retain' | 'first'

interface Portion {
  node: Text
  index: number
  text: string
  indexInMatch: number
  indexInNode: number
  endIndexInNode?: number
  isEnd?: boolean
}

interface MatchArray extends RegExpExecArray {
  endIndex: number
  startIndex: number
  index: number
}

interface FinderOptions {
  find: RegExp | string
  wrap?: string | Element | null
  wrapClass?: string
  replace?: string | ((portion: Portion, match: MatchArray) => Node | string)
  filterElements?: (el: Element) => boolean
  portionMode?: PortionMode
  forceContext?: boolean | ((el: Element) => boolean)
  prepMatch?: (m: RegExpExecArray, mi: number, offset: number) => MatchArray
  preset?: string
}

interface ExposedFn {
  (node: Node, options: FinderOptions): any
  NON_PROSE_ELEMENTS: Record<string, number>
  NON_CONTIGUOUS_PROSE_ELEMENTS: Record<string, number>
  NON_INLINE_PROSE: (el: Element) => boolean
  PRESETS: Record<string, any>
  Finder: any
}

const findAndReplaceDOMText = (function () {
  const PORTION_MODE_RETAIN: PortionMode = 'retain'
  const PORTION_MODE_FIRST: PortionMode = 'first'

  const doc = document
  const hasOwn = Object.prototype.hasOwnProperty

  function escapeRegExp(s: string) {
    return String(s).replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
  }

  function exposed(...args: unknown[]) {
    return (deprecated as any)(...args) || (findAndReplaceDOMText as any)(...args)
  }

  function deprecated(regex: any, node: any, replacement: any, captureGroup?: number, elFilter?: any) {
    if ((node && !node.nodeType) && arguments.length <= 2) {
      return false
    }
    const isReplacementFunction = typeof replacement == 'function'

    if (isReplacementFunction) {
      replacement = ((original: (text: string, startIndex?: number) => any) => {
        return function (portion: Portion, match: MatchArray) {
          // original expects (text, startIndex)
          return original(portion.text, match.startIndex)
        }
      })(replacement as any)
    }

    const instance = findAndReplaceDOMText(node, {
      find: regex,
      wrap: isReplacementFunction ? null : replacement,
      replace: isReplacementFunction ? replacement : `$${captureGroup || '&'}`,
      prepMatch(m: RegExpExecArray, mi: number) {
        if (!m[0])
          throw new Error('findAndReplaceDOMText cannot handle zero-length matches')
        if (captureGroup && captureGroup > 0) {
          const cg = m[captureGroup]
          m.index += m[0].indexOf(cg)
          m[0] = cg
        }
        ;(m as MatchArray).endIndex = m.index + m[0].length
        ;(m as MatchArray).startIndex = m.index
        m.index = mi
        return m as MatchArray
      },
      filterElements: elFilter,
    })

    ;(exposed as any).revert = function () {
      return (instance as any).revert()
    }

    return true
  }

  function findAndReplaceDOMText(node: Node, options: FinderOptions) {
  // Finder is declared as a function that sets its prototype below; cast to any to allow `new` here.
    return new (Finder as any)(node, options)
  }

  ;(exposed as any).NON_PROSE_ELEMENTS = {
    br: 1,
    hr: 1,
    script: 1,
    style: 1,
    img: 1,
    video: 1,
    audio: 1,
    canvas: 1,
    svg: 1,
    map: 1,
    object: 1,
    input: 1,
    textarea: 1,
    select: 1,
    option: 1,
    optgroup: 1,
    button: 1,
  }

  ;(exposed as any).NON_CONTIGUOUS_PROSE_ELEMENTS = {
    address: 1,
    article: 1,
    aside: 1,
    blockquote: 1,
    dd: 1,
    div: 1,
    dl: 1,
    fieldset: 1,
    figcaption: 1,
    figure: 1,
    footer: 1,
    form: 1,
    h1: 1,
    h2: 1,
    h3: 1,
    h4: 1,
    h5: 1,
    h6: 1,
    header: 1,
    hgroup: 1,
    hr: 1,
    main: 1,
    nav: 1,
    noscript: 1,
    ol: 1,
    output: 1,
    p: 1,
    pre: 1,
    section: 1,
    ul: 1,
    br: 1,
    li: 1,
    summary: 1,
    dt: 1,
    details: 1,
    rp: 1,
    rt: 1,
    rtc: 1,
    script: 1,
    style: 1,
    img: 1,
    video: 1,
    audio: 1,
    canvas: 1,
    svg: 1,
    map: 1,
    object: 1,
    input: 1,
    textarea: 1,
    select: 1,
    option: 1,
    optgroup: 1,
    button: 1,
    table: 1,
    tbody: 1,
    thead: 1,
    th: 1,
    tr: 1,
    td: 1,
    caption: 1,
    col: 1,
    tfoot: 1,
    colgroup: 1,
  }

  ;(exposed as any).NON_INLINE_PROSE = function (el: Element) {
    return hasOwn.call((exposed as any).NON_CONTIGUOUS_PROSE_ELEMENTS, el.nodeName.toLowerCase())
  }

  ;(exposed as any).PRESETS = {
    prose: {
      forceContext: (exposed as any).NON_INLINE_PROSE,
      filterElements(el: Element) {
        return !(hasOwn.call((exposed as any).NON_PROSE_ELEMENTS, el.nodeName.toLowerCase()))
      },
    },
  }

  ;(exposed as any).Finder = Finder

  function Finder(this: any, node: Node, options: FinderOptions) {
    const preset = options.preset && (exposed as any).PRESETS[options.preset]

    options.portionMode = options.portionMode || PORTION_MODE_RETAIN

    if (preset) {
      for (const i in preset) {
        if (hasOwn.call(preset, i) && !hasOwn.call(options, i)) {
          ;(options as any)[i] = (preset as any)[i]
        }
      }
    }

    this.node = node
    this.options = options
    this.prepMatch = options.prepMatch || this.prepMatch
    this.reverts = [] as Array<() => void>
    this.matches = this.search()
    if (this.matches.length)
      this.processMatches()
  }

  Finder.prototype = {
    search(this: any) {
      let match: RegExpExecArray | null
      let matchIndex = 0
      let offset = 0
      let regex: RegExp | string = this.options.find
      const textAggregation = this.getAggregateText()
      const matches: MatchArray[] = []

      regex = typeof regex === 'string' ? new RegExp(escapeRegExp(regex), 'g') : regex

      const matchAggregation = (textAggregation: any[]) => {
        for (let i = 0; i < textAggregation.length; ++i) {
          const text = textAggregation[i]
          if (typeof text !== 'string') {
            matchAggregation(text)
            continue
          }

          if ((regex as RegExp).global) {
            // eslint-disable-next-line no-cond-assign
            while ((match = (regex as RegExp).exec(text)) !== null) {
              matches.push(this.prepMatch(match as RegExpExecArray, matchIndex++, offset))
            }
          }
          else {
            const mm = text.match(regex as RegExp)
            if (mm) {
              matches.push(this.prepMatch(mm as RegExpExecArray, 0, offset))
            }
          }

          offset += text.length
        }
      }

      matchAggregation(textAggregation)

      return matches
    },

    prepMatch(this: any, match: RegExpExecArray, matchIndex: number, characterOffset: number) {
      if (!match[0]) {
        throw new Error('findAndReplaceDOMText cannot handle zero-length matches')
      }
      ;(match as MatchArray).endIndex = characterOffset + match.index + match[0].length
      ;(match as MatchArray).startIndex = characterOffset + match.index
      match.index = matchIndex
      return match as MatchArray
    },

    getAggregateText(this: any) {
      const elementFilter = this.options.filterElements
      const forceContext = this.options.forceContext

      return getText(this.node)

      function getText(node: Node): any[] {
        if (node.nodeType === Node.TEXT_NODE) {
          return [(node as Text).data]
        }

        if (elementFilter && !elementFilter(node as Element))
          return []

        const txt: any[] = ['']
        let i = 0

        let child = node.firstChild
        while (child) {
          if (child.nodeType === Node.TEXT_NODE) {
            txt[i] += (child as Text).data
            child = child.nextSibling
            continue
          }

          const innerText = getText(child)

          if (
            forceContext
            && child.nodeType === Node.ELEMENT_NODE
            && (forceContext === true || (forceContext as (el: Element) => boolean)(child as Element))
          ) {
            txt[++i] = innerText
            txt[++i] = ''
          }
          else {
            if (typeof innerText[0] === 'string') {
              txt[i] += innerText.shift()
            }
            if (innerText.length) {
              txt[++i] = innerText
              txt[++i] = ''
            }
          }

          child = child.nextSibling
        }

        return txt
      }
    },

    processMatches(this: any) {
      const matches: MatchArray[] = this.matches
      const node: Node = this.node
      const elementFilter = this.options.filterElements

      let startPortion: Portion | null = null
      let endPortion: Portion | null = null
      let innerPortions: Portion[] = []
      let curNode: Node | null = node
      let match = matches.shift()
      let atIndex = 0
      // matchIndex previously tracked matches processed; not used in this function.
      let portionIndex = 0
      let doAvoidNode = false
      const nodeStack: Node[] = [node]

      let finished = false
      while (!finished) {
        if (!curNode)
          break
        if (curNode.nodeType === Node.TEXT_NODE) {
          const txtNode = curNode as Text
          if (!endPortion && txtNode.length + atIndex >= (match as MatchArray).endIndex) {
            endPortion = {
              node: txtNode,
              index: portionIndex++,
              text: txtNode.data.substring((match as MatchArray).startIndex - atIndex, (match as MatchArray).endIndex - atIndex),
              indexInMatch: atIndex === 0 ? 0 : atIndex - (match as MatchArray).startIndex,
              indexInNode: (match as MatchArray).startIndex - atIndex,
              endIndexInNode: (match as MatchArray).endIndex - atIndex,
              isEnd: true,
            }
          }
          else if (startPortion) {
            innerPortions.push({
              node: txtNode,
              index: portionIndex++,
              text: txtNode.data,
              indexInMatch: atIndex - (match as MatchArray).startIndex,
              indexInNode: 0,
            })
          }

          if (!startPortion && txtNode.length + atIndex > (match as MatchArray).startIndex) {
            startPortion = {
              node: txtNode,
              index: portionIndex++,
              indexInMatch: 0,
              indexInNode: (match as MatchArray).startIndex - atIndex,
              endIndexInNode: (match as MatchArray).endIndex - atIndex,
              text: txtNode.data.substring((match as MatchArray).startIndex - atIndex, (match as MatchArray).endIndex - atIndex),
            }
          }

          atIndex += txtNode.data.length
        }

        doAvoidNode = curNode.nodeType === Node.ELEMENT_NODE && elementFilter && !elementFilter(curNode as Element)

        if (startPortion && endPortion) {
          curNode = this.replaceMatch(match as MatchArray, startPortion, innerPortions, endPortion)

          atIndex -= ((endPortion.node as Text).data.length - (endPortion.endIndexInNode as number))

          startPortion = null
          endPortion = null
          innerPortions = []
          match = matches.shift()
          portionIndex = 0
          if (!match)
            break
        }
        else if (
          !doAvoidNode
          && ((curNode.firstChild && curNode.firstChild.nodeType) || curNode.nextSibling)
        ) {
          if (curNode.firstChild) {
            nodeStack.push(curNode)
            curNode = curNode.firstChild
          }
          else {
            curNode = curNode.nextSibling
          }
          continue
        }

        while (true) {
          if (curNode && curNode.nextSibling) {
            curNode = curNode.nextSibling
            break
          }
          curNode = nodeStack.pop() || null
          if (curNode === node) {
            finished = true
            break
          }
        }
        if (finished)
          break
      }
    },

    revert(this: any) {
      for (let l = this.reverts.length; l--;) {
        this.reverts[l]()
      }
      this.reverts = []
    },

    prepareReplacementString(this: any, string: string, portion: Portion, match: MatchArray) {
      const portionMode: PortionMode = this.options.portionMode
      if (portionMode === PORTION_MODE_FIRST && portion.indexInMatch > 0)
        return ''
      string = string.replace(/\$(\d+|[&`'])/g, (_0, t) => {
        void _0
        let replacement = ''
        switch (t) {
          case '&':
            replacement = match[0]
            break
          case '`':
            replacement = match.input.substring(0, match.startIndex)
            break
          case '\'':
            replacement = match.input.substring(match.endIndex)
            break
          default:
            replacement = (match as any)[+t] || ''
        }
        return replacement
      })

      if (portionMode === PORTION_MODE_FIRST)
        return string

      if (portion.isEnd)
        return string.substring(portion.indexInMatch)

      return string.substring(portion.indexInMatch, portion.indexInMatch + portion.text.length)
    },

    getPortionReplacementNode(this: any, portion: Portion, match: MatchArray) {
      let replacement: any = this.options.replace || '$&'
      let wrapper: any = this.options.wrap
      const wrapperClass: string | undefined = this.options.wrapClass

      if (wrapper && (wrapper as Element).nodeType) {
        const clone = doc.createElement('div')
        clone.innerHTML = (wrapper as Element).outerHTML || new XMLSerializer().serializeToString(wrapper as Element)
        wrapper = clone.firstChild as Element
      }

      if (typeof replacement == 'function') {
        replacement = replacement(portion, match)
        if (replacement && (replacement as Node).nodeType)
          return replacement as Node
        return doc.createTextNode(String(replacement))
      }

      const el = typeof wrapper == 'string' ? doc.createElement(wrapper as string) : wrapper as Element | null

      if (el && wrapperClass)
        el.className = wrapperClass

      replacement = doc.createTextNode(this.prepareReplacementString(replacement, portion, match))

      if (!(replacement as Text).data)
        return replacement
      if (!el)
        return replacement

      el.appendChild(replacement)
      return el
    },

    replaceMatch(this: any, match: MatchArray, startPortion: Portion, innerPortions: Portion[], endPortion: Portion) {
      const matchStartNode = startPortion.node
      const matchEndNode = endPortion.node

      let precedingTextNode: Text | undefined
      let followingTextNode: Text | undefined

      if (matchStartNode === matchEndNode) {
        const node = matchStartNode
        if (startPortion.indexInNode > 0) {
          precedingTextNode = doc.createTextNode(node.data.substring(0, startPortion.indexInNode))
          node.parentNode!.insertBefore(precedingTextNode, node)
        }

        const newNode = this.getPortionReplacementNode(endPortion, match)
        node.parentNode!.insertBefore(newNode, node)

        if (endPortion.endIndexInNode! < node.length) {
          followingTextNode = doc.createTextNode(node.data.substring(endPortion.endIndexInNode!))
          node.parentNode!.insertBefore(followingTextNode, node)
        }

        node.parentNode!.removeChild(node)

        this.reverts.push(() => {
          if (precedingTextNode === newNode.previousSibling)
            precedingTextNode!.parentNode!.removeChild(precedingTextNode!)
          if (followingTextNode === newNode.nextSibling)
            followingTextNode!.parentNode!.removeChild(followingTextNode!)
          newNode.parentNode!.replaceChild(node, newNode)
        })

        return newNode
      }
      else {
        precedingTextNode = doc.createTextNode(matchStartNode.data.substring(0, startPortion.indexInNode))
        followingTextNode = doc.createTextNode(matchEndNode.data.substring(endPortion.endIndexInNode!))

        const firstNode = this.getPortionReplacementNode(startPortion, match)

        const innerNodes: Node[] = []
        for (let i = 0; i < innerPortions.length; ++i) {
          const portion = innerPortions[i]
          const innerNode = this.getPortionReplacementNode(portion, match)
          portion.node.parentNode!.replaceChild(innerNode, portion.node)
          this.reverts.push(((portionLocal: Portion, innerNodeLocal: Node) => {
            return function () {
              innerNodeLocal.parentNode!.replaceChild(portionLocal.node, innerNodeLocal)
            }
          })(portion, innerNode))
          innerNodes.push(innerNode)
        }

        const lastNode = this.getPortionReplacementNode(endPortion, match)

        matchStartNode.parentNode!.insertBefore(precedingTextNode, matchStartNode)
        matchStartNode.parentNode!.insertBefore(firstNode, matchStartNode)
        matchStartNode.parentNode!.removeChild(matchStartNode)

        matchEndNode.parentNode!.insertBefore(lastNode, matchEndNode)
        matchEndNode.parentNode!.insertBefore(followingTextNode, matchEndNode)
        matchEndNode.parentNode!.removeChild(matchEndNode)

        this.reverts.push(() => {
          precedingTextNode!.parentNode!.removeChild(precedingTextNode!)
          firstNode.parentNode!.replaceChild(matchStartNode, firstNode)
          followingTextNode!.parentNode!.removeChild(followingTextNode!)
          lastNode.parentNode!.replaceChild(matchEndNode, lastNode)
        })

        return lastNode
      }
    },
  }

  return exposed as unknown as ExposedFn
})()

export default findAndReplaceDOMText

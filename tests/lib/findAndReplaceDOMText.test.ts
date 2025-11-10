import { beforeEach, describe, expect, it } from 'vitest'
import findAndReplaceDOMText from '@/lib/findAndReplaceDOMText'

let container: HTMLDivElement

beforeEach(() => {
  container = document.createElement('div')
})

/** HTML 比较函数 */
function htmlEqual(actual: string, expected: string) {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[\r\n]/g, '').replace(/="([^"]+)"/g, '=$1')
  expect(normalize(actual)).toEqual(normalize(expected))
}

/** 测试包装函数：执行 findAndReplaceDOMText + htmlEqual + revert */
function runTest(html: string, options: Parameters<typeof findAndReplaceDOMText>[1], expected: string) {
  container.innerHTML = html
  const result = findAndReplaceDOMText(container, options)
  htmlEqual(container.innerHTML, expected)
  // 测试 revert
  if (result?.revert) {
    result.revert()
    htmlEqual(container.innerHTML, html)
  }
}

/** ------------------ Basics ------------------ */
describe('basics', () => {
  const tests: Record<string, string> = {
    'TEST': '<x>TEST</x>',
    'T<em>EST</em>': '<x>T</x><em><x>EST</x></em>',
    '<div>TEST</div>': '<div><x>TEST</x></div>',
    '<i>T</i><b>E</b><u>S</u><i>T</i>': '<i><x>T</x></i><b><x>E</x></b><u><x>S</x></u><i><x>T</x></i>',
    '<i>T</i><u>EST ok</u>': '<i><x>T</x></i><u><x>EST</x> ok</u>',
    '<i>ok T</i><em>EST</em>': '<i>ok <x>T</x></i><em><x>EST</x></em>',
    '<i>ok <i><b>T</b></i></i><em>EST</em>': '<i>ok <i><b><x>T</x></b></i></i><em><x>EST</x></em>',
  }

  Object.entries(tests).forEach(([input, expected]) => {
    it(`Element boundary: ${input}`, () => {
      runTest(input, { find: /TEST/g, wrap: 'x' }, expected)
    })
  })
})

/** ------------------ Finding ------------------ */
describe('finding', () => {
  it('string match with inline element', () => {
    runTest(
      'this is a ??te<i>st</i>',
      { find: '??test', wrap: 'x' },
      'this is a <x>??te</x><i><x>st</x></i>',
    )
  })

  it('variable length RegExp matches', () => {
    for (let i = 0; i < 50; i++) {
      const html = Array.from({ length: i + 1 }).fill('<em>x</em>').join('')
      const expected = Array.from({ length: i + 1 }).fill('<em><z>x</z></em>').join('')
      runTest(html, { find: /x+/, wrap: 'z' }, expected)
    }
  })

  it('only output specified groups', () => {
    const html = 'TEST TESThello TESThello TESThello'
    runTest(html, { find: /(TEST)hello/g, wrap: 'x', replace: '$1' }, 'TEST <x>TEST</x> <x>TEST</x> <x>TEST</x>')
    runTest(html, { find: /\s(TEST)(hello)/g, wrap: 'x', replace: '$2' }, 'TEST<x>hello</x><x>hello</x><x>hello</x>')
  })

  it('word boundaries', () => {
    const html = 'a go matching at test word cat at <p>AAA</p><p>BBB</p>'
    runTest(html, { find: /\bat\b/g, wrap: 'x' }, 'a go matching <x>at</x> test word cat <x>at</x> <p>AAA</p><p>BBB</p>')
  })

  it('explicit context configuration', () => {
    const forcedAContext = (el: Element) => el.nodeName.toLowerCase() === 'a'

    runTest('<v>Foo<v>Bar</v></v>', { find: /FooBar/, wrap: 'x' }, '<v><x>Foo</x><v><x>Bar</x></v></v>')
    runTest('<v>Foo<v>Bar</v></v>', { find: /FooBar/, wrap: 'x', forceContext: true }, '<v>Foo<v>Bar</v></v>')
    runTest('<v>Foo<v>Bar</v></v>', { find: /FooBar/, wrap: 'x', forceContext: false }, '<v><x>Foo</x><v><x>Bar</x></v></v>')

    runTest('<a>Foo<b>BarFoo</b>Bar</a>', { find: /FooBar/, wrap: 'x', forceContext: forcedAContext }, '<a><x>Foo</x><b><x>Bar</x>Foo</b>Bar</a>')
  })

  it('nON_INLINE_PROSE context fn', () => {
    runTest(
      '<p>Some</p>Thing<em>Some<span>Thing</span></em><div>Some</div>Thing',
      { find: /something/i, wrap: 'x', forceContext: findAndReplaceDOMText.NON_INLINE_PROSE },
      '<p>Some</p>Thing<em><x>Some</x><span><x>Thing</x></span></em><div>Some</div>Thing',
    )
  })
})

/** ------------------ Replacement (With Nodes) ------------------ */
describe('replacement (With Nodes)', () => {
  it('wrapper node', () => {
    runTest('test test', { find: /test/gi, wrap: 'div' }, '<div>test</div> <div>test</div>')
  })

  it('custom replacement function', () => {
    runTest('aaaaa', {
      find: /a/g,
      replace(portion) {
        return document.createTextNode(`b${portion.text}`)
      },
    }, 'bababababa')
  })

  it('custom replacement node', () => {
    runTest('test test', {
      find: /test/gi,
      replace(portion) {
        const e = document.createElement('x')
        e.className = 'f'
        e.appendChild(document.createTextNode(portion.text))
        return e
      },
    }, '<x class="f">test</x> <x class="f">test</x>')
  })
})

/** ------------------ Replacement (With Text) ------------------ */
describe('replacement (With Text)', () => {
  it('simple string replacement', () => {
    runTest('111 foo 222 foo', { find: 'foo', replace: 'bar' }, '111 bar 222 bar')
  })

  it('regex with capture group', () => {
    runTest('111 222 333', { find: /(\d+)/g, replace: 'aaa$1' }, 'aaa111 aaa222 aaa333')
  })
})

/** ------------------ Complex Capture Groups ------------------ */
describe('complex capture groups', () => {
  it('$n replacement', () => {
    runTest('111abc333', { find: /(a)(b)(c)/g, replace: '$3$2$1' }, '111cba333')
  })

  it('$&/$0 replacement', () => {
    runTest('111aabbcc333', { find: /[a-z]{2}/g, replace: '_$0_$&_' }, '111_aa_aa__bb_bb__cc_cc_333')
  })

  it('left (`) and Right (\') replacement', () => {
    runTest('this is a test', { find: /\ba\b/, replace: '[$`]' }, 'this is [this is ] test')
    runTest('this is a test', { find: /\ba\b/, replace: '[$\']' }, 'this is [ test] test')
  })
})

/** ------------------ Filtering ------------------ */
describe('filtering', () => {
  it('element filtering', () => {
    const html = 'foo <style>foo{}</style> foo <script>foo;</script>'
    runTest(html, {
      find: /foo/g,
      wrap: 'span',
      filterElements: (el: Element) => !/^(?:script|style)$/i.test(el.nodeName),
    }, '<span>foo</span> <style>foo{}</style> <span>foo</span> <script>foo;</script>')
  })
})

/** ------------------ Revert ------------------ */
describe('revert', () => {
  it('basic text revert', () => {
    const html = 'this is a test'
    findAndReplaceDOMText(container, { find: /\ba\b/, replace: 'something' })
    container.innerHTML = html
    htmlEqual(container.innerHTML, html)
  })
})

/** ------------------ portionMode ------------------ */
describe('portionMode', () => {
  it('portionMode:first', () => {
    runTest('Testing 123 HE<em>LLO there</em>', { find: /hello/i, wrap: 'span', portionMode: 'first' }, 'Testing 123 <span>HELLO</span><em> there</em>')
  })

  it('portionMode:retain', () => {
    runTest('Testing 123 HE<em>LLO there</em>', { find: /hello/i, wrap: 'span', portionMode: 'retain' }, 'Testing 123 <span>HE</span><em><span>LLO</span> there</em>')
  })
})

/** ------------------ indexInMatch ------------------ */
describe('indexInMatch', () => {
  it('single and multiple portions', () => {
    runTest('___AAAAA', { find: /A+/g, replace: (p: any) => (p as any).indexInMatch }, '___0')
    runTest('___AAA<em>AA</em>', { find: /A+/g, replace: (p: any) => (p as any).indexInMatch }, '___0<em>3</em>')
    runTest('___AA<em>A</em>A<u>A</u>', { find: /A+/g, replace: (p: any) => (p as any).indexInMatch }, '___0<em>2</em>3<u>4</u>')
  })
})

/** ------------------ Presets ------------------ */
describe('presets', () => {
  it('prose preset', () => {
    const html = '123<h1>123</h1><script>123;</script><p>1</p><p>2</p><p>3</p><div>1<em>23</em>123</div><div><style>123</style></div>'
    const expected = '999<h1>999</h1><script>123;</script><p>1</p><p>2</p><p>3</p><div>9<em>99</em>999</div><div><style>123</style></div>'
    runTest(html, { find: /123/g, replace: '999', preset: 'prose' }, expected)
  })
})

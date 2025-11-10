# Kanji Typesetting (formerly Han-CSS-Q)

[**Kanji Typesetting**](https://github.com/syhily/kanji-typesetting) (npm: [`kanji-typesetting`](https://www.npmjs.com/package/kanji-typesetting))
is a modernized reimplementation of [**Han-CSS**](https://github.com/ethantw/Han), a typesetting framework for Chinese and other Han-script web pages.
It integrates **semantic style normalization**, **text design**, and **advanced typesetting features** into a unified CSS + JavaScript framework.

Kanji Typesetting provides a beautiful, standardized environment for Han character typography — faithful to traditional reading habits yet optimized for digital screens — effectively solving the long-standing layout challenges in Han-script web design.

The original Han-CSS project, however, has not been actively maintained for years.
Its build system depends on an outdated version of Gulp, the code does not follow modern JavaScript conventions, and it lacks features such as **server-side rendering (SSR)** support.

**Han-CSS-Q** was created as an effort to modernize Han-CSS.
**I (syhily) have now forked Han-CSS-Q again**, continuing its modernization under the new name **Kanji Typesetting**, distributed via npm as [`kanji-typesetting`](https://www.npmjs.com/package/kanji-typesetting).
This fork inherits all improvements from Han-CSS-Q while further enhancing **usability**, **modularity**, and **compatibility** with modern front-end ecosystems.

---

## Differences from the Original Han-CSS

Compared with the original Han-CSS, Kanji Typesetting introduces several major updates:

1. **Removed the old Gulp build system** — everything now uses **ES Modules** and can be imported directly through modern bundlers.
2. **Supports server-side rendering (SSR)**.
3. **Reorganized the codebase** following modern JavaScript standards.
4. **Redesigned the API** for greater simplicity, consistency, and flexibility.
5. **Precompiled CSS distribution** — no need for Sass loaders; simply import the built stylesheet.

Kanji Typesetting is still under active development.
Most features are functional, but due to the scope of the refactor and incomplete testing, results may differ slightly from the original Han-CSS.
You can see it in production on [sharzy.in](https://sharzy.in/blog), which fully adopts Han-CSS-Q.

---

## Installation

Install Kanji Typesetting from npm:

```bash
yarn add kanji-typesetting
# or
npm install kanji-typesetting
```

Alternatively, install directly from GitHub:

```bash
yarn add git+https://github.com/syhily/kanji
# or
npm install git+https://github.com/syhily/kanji
```

---

## Usage

Kanji Typesetting consists of two parts:

- **CSS styles** for visual and typographic rendering
- **JavaScript runtime** for semantic and contextual processing

### 1. Import the CSS

Since Kanji Typesetting ships with precompiled CSS, you can import it directly from the package:

```js
import 'kanji-typesetting/style'
```

or in a CSS file:

```css
@import 'kanji-typesetting/style';
```

This works with most modern bundlers and frameworks, including **Vite**, **Next.js**, **Nuxt**, and **Webpack**.

> 💡 _Tip:_
> The CSS bundle automatically includes the default font and layout settings.
> If you need to override font paths or variables, you can do so via standard CSS overrides after import.

Example:

```css
@import 'kanji-typesetting/style';

:root {
  --han-line-height: 1.6;
  --han-article-line-height: 1.6;
}
```

---

### 2. Initialize with JavaScript

Import the JavaScript API in your entry script or component:

```js
import Han from 'kanji-typesetting'
import 'kanji-typesetting/style'
```

Create a Han instance and render:

```js
const han = new Han(
  document.querySelector('article'),
  document.documentElement,
)

han.render()
```

The default rendering pipeline runs the following steps:

```js
const defaultRoutine = [
  'initCond',
  'renderElem',
  'renderJiya',
  'renderHanging',
  'correctBiaodian',
  'renderHWS',
]
```

You can customize it:

```js
han.setRoutine(['initCond', 'renderElem', 'renderJiya', 'renderHWS']).render()
```

---

## Rendering Steps

Kanji Typesetting provides the following processing steps:

- **Initialization** — `initCond()`
- **Semantic element normalization** — `renderElem()`, including:
  - `renderRuby()` — ruby annotations
  - `renderDecoLine()` — text decoration
  - `renderEm()` — emphasized text

- **Hanging punctuation** — `renderHanging()`
- **Punctuation compression (jiya)** — `renderJiya()`
- **Han–Western spacing** — `renderHWS()`
- **Basic punctuation correction** — `correctBasicBD()` (for browsers without native support)
- **Ligature substitution** — `substCombLigaWithPUA()`
- **Character accuracy correction** — `substInaccurateChar()`

For detailed explanations, see the [Han-CSS documentation](https://hanzi.pro/manual/wenzisheji).

---

## Style Corrections

Kanji Typesetting provides typographic corrections for standard HTML elements, ensuring they conform to professional Han typesetting conventions.
See the [original documentation](https://hanzi.pro/manual/yangshi_biaozhunhua) for details.

It also defines refined font stacks for consistent rendering across platforms.
See [text design documentation](https://hanzi.pro/manual/wenzisheji) for more details.

---

✅ **Summary**

**Kanji Typesetting** (npm: [`kanji-typesetting`](https://www.npmjs.com/package/kanji-typesetting))
is a modern, production-ready reimplementation of **Han-CSS**, continuing from **Han-CSS-Q** with:

- ES Module–based architecture
- Server-side rendering support
- Precompiled CSS (no Sass required)
- Modern JavaScript API
- Simplified configuration
- npm distribution

Kanji Typesetting aims to deliver a **clean**, **modular**, and **production-ready** framework for high-quality Han character web typography.

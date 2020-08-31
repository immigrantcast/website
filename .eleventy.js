const Typograf = require('typograf')
const tp = new Typograf({locale: ['ru', 'en-US']})
const excerpt = require('eleventy-plugin-excerpt')
const { DateTime } = require('luxon')
const markdownIt = require('markdown-it')

module.exports = function (config) {
  config.addTransform('typograph', (content) => {
    return tp.execute(content)
  })

  config.addFilter('readableDate', (dateObj) => {
    return DateTime
      .fromJSDate(dateObj, { zone: 'utc' })
      .toFormat('dd.LL.yyyy')
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  config.addFilter('htmlDateString', (dateObj) => {
    return DateTime
      .fromJSDate(dateObj, { zone: 'utc' })
      .toISO()
  })

  config.addFilter('excerpt', (content) => {
    const LENGTH = 250
    let description = content.replace(/<(?:.|\n)*?>/gm, '')
      .replace(/\n\n/, '')
      .substring(0, LENGTH)
      .trim() + '...'
    return description
  })

  // Get the first `n` elements of a collection.
  config.addFilter('head', (array, n) => {
    if ( n < 0 ) {
      return array.slice(n)
    }
    return array.slice(0, n)
  })

  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  })
  config.setLibrary('md', markdownLibrary)

  config.addPassthroughCopy('src/_redirects')
  config.addPassthroughCopy('src/assets/**/*.*')
  config.addPassthroughCopy('src/media/**/*.*')

  return {
    dir: {
        input: 'src',
        output: '_site',
        includes: 'includes',
        layouts: 'layouts',
        data: 'data'
    }
  }
}
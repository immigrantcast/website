const Typograf = require('typograf')
const tp = new Typograf({locale: ['ru', 'en-US']})
const excerpt = require('eleventy-plugin-excerpt')
const { DateTime } = require('luxon')

module.exports = function (config) {
  config.addTransform('typograph', function(content, outputPath) {
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

  // Get the first `n` elements of a collection.
  config.addFilter('head', (array, n) => {
    if ( n < 0 ) {
      return array.slice(n)
    }
    return array.slice(0, n)
  });

  config.addPlugin(excerpt)

  config.addPassthroughCopy('src/_redirects');
  // config.addPassthroughCopy('src/fonts');
  // config.addPassthroughCopy('src/images');
  // config.addPassthroughCopy('src/styles');
  // config.addPassthroughCopy('src/scripts');
  // config.addPassthroughCopy('src/manifest.json');
  // config.addPassthroughCopy('src/episodes/**/*.mp3');

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
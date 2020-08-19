const Typograf = require('typograf')
const tp = new Typograf({locale: ['ru', 'en-US']})

module.exports = function (config) {
  config.addTransform('typograph', function(content, outputPath) {
      return tp.execute(content)
  })

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
const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/chatapp/' : '/',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(options => {
        options[0].title = 'Chat | Web chatappp'
        return options
      })
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/_common.scss";`,
      },
    },
  },
  publicPath: './',
}

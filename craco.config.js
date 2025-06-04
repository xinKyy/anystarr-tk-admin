// const path = require('path');
const CracoAntDesignPlugin = require("craco-antd");
const CracoAlias = require("craco-alias");

module.exports = {
  devServer: {
    proxy: {
      '/anystarr-new-web': {
        target: 'https://anystarr.shop',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
      }
    }
  },
  babel: {
    presets: [
      ['@babel/preset-env', {
        modules: false
      }]
    ],
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ['@babel/plugin-transform-logical-assignment-operators', { loose: true }]
    ]
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        /* customizeTheme 和 customizeThemeLessPath 任选其一 */
        customizeTheme: {
          "@primary-color": "#348fe4",
          "@link-color": "#348fe4"
        },
        // customizeThemeLessPath: path.join(__dirname, "src/style/theme.less"),
      }
    },
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        baseUrl: "./",
        aliases: {
          "@": "./src",
        }
      }
    }
  ],
};
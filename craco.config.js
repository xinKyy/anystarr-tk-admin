
// const path = require('path');
const CracoAntDesignPlugin = require("craco-antd");
const CracoAlias = require("craco-alias");

module.exports = {
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
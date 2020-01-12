const WebpackDevServer = require('webpack-dev-server');
const Webpack = require('webpack');
const WebpackHotMiddleware = require('webpack-hot-middleware');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InsertHtmlPlugin = require('./plugin/instert-html-plugin.js');

const WebpackBaseConfig = require('./webpack.base.config');
const vars = require('./variables');

const proxy_host = vars.proxy_host;
const port = vars.port;
const proxy = vars.proxy || [];
const dev_publicPath = vars.dev_publicPath;
const insert_htmls = vars.dev_insert_htmls || [];

var compiler;
var server;

var default_proxy = {
    "/exam/*":{
        "target":"http://114.116.116.99:88",
        "changeOrigin": true
    },
    "/ctb/*":{
        "target":"http://114.116.116.99",
        "changeOrigin": true
    }
};

var final_proxy = {};

Object.assign(final_proxy, default_proxy);

proxy.forEach(px => {
    var _px_opt = {};
    _px_opt[px] = {
        target: proxy_host,
        changeOrigin: true,
    }
    Object.assign(final_proxy, _px_opt);
})

console.log(final_proxy);

WebpackBaseConfig.mode = 'development';
WebpackBaseConfig.output.filename = `${vars.dist_static_root}/[name].[hash:8].js`;
WebpackBaseConfig.devtool = 'cheap-module-source-map';
WebpackBaseConfig.output.publicPath = dev_publicPath;
for(let p in WebpackBaseConfig.entry){
    WebpackBaseConfig.entry[p] = [`webpack-dev-server/client?http://localhost:${port}/`, WebpackBaseConfig.entry[p]];
    WebpackBaseConfig.entry[p].unshift('webpack/hot/dev-server');
}
const css_rules = WebpackBaseConfig.module.rules.find((v => `${v.test}` === '/\\.(less|css)$/'));
css_rules.use.unshift('css-hot-loader');
const css_name = `${vars.css_root}/[name].[hash:8].css`;

//WebpackBaseConfig.plugins.push(new ExtractTextPlugin(css_name));
WebpackBaseConfig.plugins.push(new MiniCssExtractPlugin(css_name));
WebpackBaseConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());
WebpackBaseConfig.plugins.push(new Webpack.NoEmitOnErrorsPlugin());

const htmls = [];
insert_htmls.forEach(html => {
    htmls.push(html)
});

WebpackBaseConfig.plugins.push(
    new InsertHtmlPlugin({
        options: {
            htmls: htmls
        }
    })
);

compiler = Webpack(WebpackBaseConfig);

server = new WebpackDevServer(compiler, {
	inline: true,
	contentBase: vars.dist_root,
	hot: true,
  	historyApiFallback: true,
  	disableHostCheck: true,
  	proxy: final_proxy,
  	publicPath: dev_publicPath,
    historyApiFallback: true,
  	stats: {
		entrypoints: false,
        children: false,
        chunks: false,  // 使构建过程更静默无输出
        colors: true,    // 在控制台展示颜色
		modules: false,
		chunkModules: false
	}
});

server.listen(port);
console.log(port)

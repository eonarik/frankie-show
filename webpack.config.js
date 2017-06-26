const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';

var cssName = isProd ? 'app-[hash].css' : 'app.css';
var jsName = isProd ? 'app-[hash].js' : 'app.js';

var plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }
    }),
    new webpack.LoaderOptionsPlugin({ debug: !isProd }),
    new ExtractTextPlugin({
        filename: cssName,
        allChunks: true,
    }),

    // NoErrorsPlugin — это стандартный плагин Webpack, который не дает перезаписать скрипты при наличии в них ошибок.
    // Это уберегает от уничтожения старой сборки как следствие нерабочего кода в продакшене.
    new webpack.NoEmitOnErrorsPlugin(),

    // CommonsChunkPlugin — выносит общие библиотеки для чанков в отдельный чанк.
    // Удобно для кеширования внешних библиотек и уменьшения веса чанков.
    new webpack.optimize.CommonsChunkPlugin({
        children: true,
        async: true,
    }),
];

var jsLoader = {
    test: /\.jsx?$/,
    use: [
        {
            loader: 'babel-loader',
            options: {
                presets: ['es2015', 'stage-0', 'react'],
                plugins: [
                    'transform-runtime',
                    'transform-react-remove-prop-types',
                    'transform-react-constant-elements',
                    'transform-react-inline-elements'
                ],
            }
        }
    ],
    exclude: /(node_modules|static)/,
};

if (isProd) {
    const CompressionPlugin = require("compression-webpack-plugin");
    plugins.push(
        // CompressionPlugin — сторонний плагин для компрессии скриптов, например, в gzip формат.
        // Большинство браузеров принимает gzip файли при установлению в headers для ответа переменной Content-Encoding:gzip.
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    );
} else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        // EnvironmentPlugin — плагин для экспорта окружения в клиентских скриптах, что очень удобно для отладки и логирования
        // new webpack.EnvironmentPlugin("NODE_ENV")
    );
    // jsLoader.use.push('react-hot-loader');
    // jsLoader.use.push('eslint-loader');
}

module.exports = {
    entry: [
        'babel-polyfill',
        './app',
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: jsName,
    },

    module: {
        rules: [
            jsLoader,
            {
                test: /\.less$/,
                include: [
                    path.join(__dirname, 'less'),
                ],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "less-loader"]
                }),
            },
            {
                test: /\.(jpg|png|ttf|woff|woff2|otf|svg)$/,
                include: [
                    path.join(__dirname, 'static'),
                ],
                use: [
                    'file-loader',
                ]
            },
        ]
    },

    plugins: plugins,

    resolve: {
        alias: {
            root: path.resolve(__dirname),
            app: 'root/app',
            less: 'root/less',
            tpl: 'root/tpl',
            cmp: 'app/cmp',
            const: 'app/const',
            lexicon: 'root/lexicon',
        },
        extensions: ['.js', '.jsx', '.less']
    },

    devtool: isProd ? false : 'source-map' ,
    // devServer: {
    //     hot: true,
    //     proxy: {
    //         '*': 'http://localhost:' + (process.env.PORT || 8080)
    //     },
    //     headers: { 'Access-Control-Allow-Origin': '*' }
    // },
};

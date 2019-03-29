const path = require('path');
module.exports = (env, argv) => {
    const conf = {
        mode: 'development',
        devServer: {
            open: true,
            openPage: 'index.html',
            contentBase: path.join(__dirname, 'public'),
            watchContentBase: true,
            port: 3000,
            disableHostCheck: true
        },
        entry: {chat: './src/index.js'},
        output: {
            path: path.join(__dirname, 'public'),
            publicPath: '/',
            filename: `[name].js`
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: [['@babel/preset-env',
                                {
                                    'modules': 'false',
                                    'useBuiltIns': 'usage',
                                    'corejs': 3,
                                    'targets': '> 0.25%, not dead'
                                }]]
                        }
                    }]
                },
                {
                    test: /\.css$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                    ]
                },
            ]
        }
    };
    return conf;
};
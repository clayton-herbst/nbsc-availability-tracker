const path = require('path')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'tracker/client', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'tracker/public'),
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: [
                    'babel-loader',
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'style-loader',
                    'sass-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    'ts-loader',
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname + '/tracker/public'),
        port: 9000
    }
}
const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader' , 'sass-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'prod.bundle.js'
    }
};
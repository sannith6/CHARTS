const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    output: {
        filename: 'visualization.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,  
                use: [{
                    loader: 'url-loader',
                    options: { 
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    } 
                }]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin(['visualization.json'])
    ]
};

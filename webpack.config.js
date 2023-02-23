module.exports = {
    entry: './src/game.ts',
    output: {
        path: require('path').resolve(__dirname, 'public'),
        filename: 'game.js'
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        { test: /\.ts$/, loader: "ts-loader" }
      ]
    },
    mode: 'development',
    plugins: [
      new (require('copy-webpack-plugin'))({
        patterns: [
          {
            from: './src/assets',
            to: './src/assets'
          }
        ]
      })
    ],
}
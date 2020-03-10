const path = require("path")

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "client", "index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "server", "public")
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "sass-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "server", "public"),
    port: 9000
  }
}

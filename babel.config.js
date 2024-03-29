module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-strict-mode',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties'
  ],
  env: {
    test: {
      plugins: [
        [
          'babel-plugin-webpack-alias',
          {
            config: './build/webpack/config.js'
          }
        ],
        [
          'react-css-modules',
          {
            context: './src',
            exclude: 'node_modules',
            generateScopedName: '[local]',
            filetypes: {
              '.scss': {
                syntax: 'postcss-scss',
                plugins: ['postcss-nested']
              }
            }
          }
        ]
      ]
    }
  }
};

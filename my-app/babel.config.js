module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@':      './src',
            '@ui':    './src/components/ui',
            '@lib':   './src/lib',
            '@theme': './src/theme',
          },
        },
      ],
      // Must be last
      'react-native-reanimated/plugin',
    ],
  };
};
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ensure all relevant extensions are resolved
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs', 'mjs'];

module.exports = withNativeWind(config, {
  // Points to your global CSS entry — NativeWind compiles Tailwind from here
  input: './global.css',
});
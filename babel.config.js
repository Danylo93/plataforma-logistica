module.exports = function (api) {
  api.cache(true)

  // Get the current environment (defaults to 'development')
  const env = process.env.NODE_ENV || 'development'
  const envFileName = `.env.${env}`

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: envFileName,
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      // Reanimated plugin has to be listed last.
      ['react-native-reanimated/plugin'],
    ],
  }
}

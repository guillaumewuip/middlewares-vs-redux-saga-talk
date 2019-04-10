const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        node: 'current',
      },
    },
  ],
];

const plugins = [
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-transform-async-to-generator',
  '@babel/plugin-transform-runtime',
];

module.exports = function (api) {
  api.cache.forever();

  return {
    presets,
    plugins,
  };
};



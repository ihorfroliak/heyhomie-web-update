/* eslint-disable no-param-reassign */
module.exports = {
    i18n: {
        locales: ['en', 'pl'],
        defaultLocale: 'pl',
    },
    webpack: (config, { isServer }) => {
        // Fixes packages that depend on fs/module module
        if (!isServer) {
            config.node = { fs: 'empty', module: 'empty' };
        }

        return config;
    },
};

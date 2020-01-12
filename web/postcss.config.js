module.exports = {
    // parser: 'sugarss',
    plugins: {
        'postcss-convert-pixel-to-viewport': {
            viewportWidth: 512,
            viewportUnit: 'vw',
            propertyBlacklist: [],
            selectorBlackList: [],
            minPixelValue: 2,
            enableConvertComment: 'on',
            disableConvertComment: 'off',
            mediaQuery: false,
            landscapeAll: false,
            landscapeManual: true,
            landscapeUnit: 'vw',
            landscapeWidth: 666
        },
        //'postcss-aspect-ratio-mini': {},
        autoprefixer: {}
    }
};

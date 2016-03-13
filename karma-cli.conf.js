// Karma configuration
// Generated on Thu Jan 09 2014 13:59:16 GMT-0500 (EST)

module.exports = function (config) {
    config.set({
        basePath: './',

        frameworks: ['mocha', 'chai-sinon'],

        exclude: [],

        reporters: ['progress'],

        port: 9876,

        runnerPort: 9100,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        files: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'mock/socket-io.js',
            'bower_components/sails.io.js/sails.io.js',
            'src/**/*.js',
            'test/**/*.spec.js'
        ],

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary (has to be installed with `npm install karma-chrome-canary-launcher`)
        // - Firefox (has to be installed with `npm install karma-firefox-launcher`)
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],

        captureTimeout: 60000,

        singleRun: false
    });
};

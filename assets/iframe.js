//  https://github.com/UpperCod/wp-uppercod-oxigen-regexp/blob/master/src/iframe.js
self.addEventListener("load", () => {
    ["regexTest", "filter"].forEach((value) => {
        const keyMethod = `${value}CustomTag`;
        const oldMethod = iframeScope[keyMethod];
        /**
         * Custom tag
         * @param {string} tag
         */
        iframeScope[keyMethod] = (tag) =>
            /^[a-z]([a-z0-9]*\-){1,}[a-z0-9]*$/.test(tag) ? tag : oldMethod(tag);
    });
    /**
     * Custom className
     * @param {string} className
     */
    iframeScope.validateClassName = (className) => /^[^\s]+$/.test(className);
});

// Disable animation
document.addEventListener("DOMContentLoaded", async () => {
    let isAnimatable = false;

    let CTFrontendBuilder = angular.module('CTFrontendBuilder');

    window.CTFrontendBuilder = CTFrontendBuilder;

    window.CTFrontendBuilder.config(['$animateProvider', function ($animateProvider) {
        $animateProvider.customFilter(function (node, event, options) {
            // Only animate if the condiniotal is true.
            return isAnimatable;
        });
    }]);
});
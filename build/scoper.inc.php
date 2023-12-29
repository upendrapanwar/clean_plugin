<?php

declare(strict_types=1);

use Isolated\Symfony\Component\Finder\Finder;

// You can do your own things here, e.g. collecting symbols to expose dynamically
// or files to exclude.
// However beware that this file is executed by PHP-Scoper, hence if you are using
// the PHAR it will be loaded by the PHAR. So it is highly recommended to avoid
// to auto-load any code here: it can result in a conflict or even corrupt
// the PHP-Scoper analysis.

$timestamp = date('Ymd');

$wp_classes   = json_decode(file_get_contents('build/php-scoper-wordpress-excludes-master/generated/exclude-wordpress-classes.json'));
$wp_functions = json_decode(file_get_contents('build/php-scoper-wordpress-excludes-master/generated/exclude-wordpress-functions.json'));
$wp_constants = json_decode(file_get_contents('build/php-scoper-wordpress-excludes-master/generated/exclude-wordpress-constants.json'));

return [
    // The prefix configuration. If a non null value is be used, a random prefix
    // will be generated instead.
    //
    // For more see: https://github.com/humbug/php-scoper/blob/master/docs/configuration.md#prefix
    'prefix' => '_Dplugins' . $timestamp,

    // By default when running php-scoper add-prefix, it will prefix all relevant code found in the current working
    // directory. You can however define which files should be scoped by defining a collection of Finders in the
    // following configuration key.
    //
    // This configuration entry is completely ignored when using Box.
    //
    // For more see: https://github.com/humbug/php-scoper/blob/master/docs/configuration.md#finders-and-paths
    // 'finders' => [
    //     Finder::create()->files()->in('src'),
    //     Finder::create()->files()->in('templates'),
    //     Finder::create()
    //         ->files()
    //         ->ignoreVCS(true)
    //         ->notName('/LICENSE|.*\\.md|.*\\.dist|Makefile|composer\\.json|composer\\.lock/')
    //         ->exclude([
    //             'doc',
    //             'test',
    //             'test_old',
    //             'tests',
    //             'Tests',
    //             'vendor-bin',
    //         ])
    //         ->in('vendor'),
    //     Finder::create()->append([
    //         'composer.json',
    //         'dplugins-sandbox.php',
    //     ]),
    // ],

    // List of excluded files, i.e. files for which the content will be left untouched.
    // Paths are relative to the configuration file unless if they are already absolute
    //
    // For more see: https://github.com/humbug/php-scoper/blob/master/docs/configuration.md#patchers
    // 'exclude-files' => [
    //     'src/a-whitelisted-file.php',
    // ],

    // When scoping PHP files, there will be scenarios where some of the code being scoped indirectly references the
    // original namespace. These will include, for example, strings or string manipulations. PHP-Scoper has limited
    // support for prefixing such strings. To circumvent that, you can define patchers to manipulate the file to your
    // heart contents.
    //
    // For more see: https://github.com/humbug/php-scoper/blob/master/docs/configuration.md#patchers
    // 'patchers' => [
    //     static function (string $filePath, string $prefix, string $contents): string {
    //         // Change the contents here.

    //         return $contents;
    //     },
    // ],

    // List of symbols to consider internal i.e. to leave untouched.
    //
    // For more information see: https://github.com/humbug/php-scoper/blob/master/docs/configuration.md#excluded-symbols
    'exclude-namespaces' => [
        // 'Acme\Foo'                     // The Acme\Foo namespace (and sub-namespaces)
        // '~^PHPUnit\\\\Framework$~',    // The whole namespace PHPUnit\Framework (but not sub-namespaces)
        // '~^$~',                        // The root namespace only
        // '',                            // Any namespace
    ],
    'exclude-classes' => array_merge(
        $wp_classes,
        [
            // 'ReflectionClassConstant',

            'Oxygen_Revisions',
        ]
    ),
    'exclude-functions' => array_merge(
        $wp_functions,
        [
            // 'mb_str_split',
        ]
    ),
    'exclude-constants' => array_merge(
        $wp_constants,
        [
            'WP_CONTENT_DIR',
            'WP_CONTENT_URL',
            'ABSPATH',
            'WPINC',
            'WP_DEBUG_DISPLAY',
            'WPMU_PLUGIN_DIR',
            'WP_PLUGIN_DIR',
            'WP_PLUGIN_URL',
            'WPMU_PLUGIN_URL',
            'MINUTE_IN_SECONDS',
            'HOUR_IN_SECONDS',
            'DAY_IN_SECONDS',
            'MONTH_IN_SECONDS',
            //'WAKALOKA_PLAIN_CLASSES_FILE',
            'DPlUGINS_PLAIN_CLASSES_FILE',
            //'WAKALOKA_PLAIN_CLASSES_EDD_STORE',
            'DPlUGINS_PLAIN_CLASSES_EDD_STORE',
            'CT_PLUGIN_MAIN_FILE',
            'debugger',

            'OXYMADE_PLUGIN_FILE',
            'OXYNINJA_PLUGIN_FILE',
            'ACSS_PLUGIN_FILE',
        ]
    ),

    // List of symbols to expose.
    //
    // For more information see: https://github.com/humbug/php-scoper/blob/master/docs/configuration.md#exposed-symbols
    'expose-global-constants' => true,
    'expose-global-classes' => true,
    'expose-global-functions' => true,
    'expose-namespaces' => [
        // 'Acme\Foo'                     // The Acme\Foo namespace (and sub-namespaces)
        // '~^PHPUnit\\\\Framework$~',    // The whole namespace PHPUnit\Framework (but not sub-namespaces)
        // '~^$~',                        // The root namespace only
        // '',                            // Any namespace
    ],
    'expose-classes' => [],
    'expose-functions' => [],
    'expose-constants' => [],
];

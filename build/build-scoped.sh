#!/usr/bin/env bash

# see https://stackoverflow.com/questions/66644233/how-to-propagate-colors-from-bash-script-to-github-action?noredirect=1#comment117811853_66644233
export TERM=xterm-color

# show errors
set -e

# script fails if trying to access to an undefined variable
set -u


# functions
note()
{
    MESSAGE=$1;

    printf "\n";
    echo "[NOTE] $MESSAGE";
    printf "\n";
}


# configure here
BUILD_DIRECTORY=$1
RESULT_DIRECTORY=$2

# ---------------------------

note "Starts"

# download whitelist of php-scoper
note "Downloading whitelist of php-scoper"
wget https://github.com/snicco/php-scoper-wordpress-excludes/archive/refs/heads/master.zip -O "php-scoper-wordpress-excludes-master.zip"

# extract whitelist of php-scoper
note "Extracting whitelist of php-scoper"
unzip "php-scoper-wordpress-excludes-master.zip" -d "$BUILD_DIRECTORY/build"

# move scoper.inc.php file from $BUILD_DIRECTORY to current directory
# note "Moving scoper.inc.php file from $BUILD_DIRECTORY to current directory"
# mv "$BUILD_DIRECTORY/build/scoper.inc.php" .

# 2. scope it
note "Download php-scoper"
wget https://github.com/humbug/php-scoper/releases/download/0.17.2/php-scoper.phar -N --no-verbose

# Work around possible PHP memory limits
note "Running scoper to $RESULT_DIRECTORY"
if test -z ${PHP80_BIN_PATH+y}; then
    php -d memory_limit=-1 php-scoper.phar add-prefix --output-dir "../$RESULT_DIRECTORY" --config "build/scoper.inc.php" --force --ansi --working-dir "$BUILD_DIRECTORY";
else
    echo "scoping with specify PHP80_BIN_PATH env";
    $PHP80_BIN_PATH -d memory_limit=-1 php-scoper.phar add-prefix --output-dir "../$RESULT_DIRECTORY" --config "build/scoper.inc.php" --force --ansi --working-dir "$BUILD_DIRECTORY";
fi

# note "Dumping Composer Autoload"
composer dump-autoload --working-dir "$RESULT_DIRECTORY" --ansi --classmap-authoritative --no-dev

# clean build files and directories
rm -rf "$BUILD_DIRECTORY"
rm -rf "$RESULT_DIRECTORY/build"
rm -f "$RESULT_DIRECTORY/composer.json"
rm -f "$RESULT_DIRECTORY/composer.lock"
rm -f "$RESULT_DIRECTORY/.gitattributes"
rm -f "$RESULT_DIRECTORY/.gitignore"

note "Finished"
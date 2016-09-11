/******************************************************************************
Functions for managing the option values that minimist returns.
******************************************************************************/

/**
This reference assumes the module is loaded in the variable `optionhelp`.

@module optionhelp
*/

var _ = require('lodash');

/**
 * Turns boolean arguments off when suffixed by `-`. Minimist provides a `--no-<arg>` option for setting the value of `<arg>` to false. When an argument defaults to true (maybe because of an environment variable) and the user may need to frequently set it to false, the minimist way gets a bit cumbersome.
 *
 * @param options Options output of minimist, which the function modifies.
 * @param minimistConfig The configuration options provided to minimist to produces the given options. The function uses this to identify the boolean arguments and their aliases.
 */

exports.applyBooleanOffSwitch = function (options, minimistConfig) {
    if (_.isUndefined(minimistConfig.boolean))
        return;
    var aliases = minimistConfig.alias;
    minimistConfig.boolean.forEach(function (letter) {
        if (options[letter] === '-') {
            options[letter] = false;
            if (aliases && !_.isUndefined(aliases[letter]))
                options[aliases[letter]] = false;
        }
    });
};

/**
 * Generates a string that shows the help information for a group of options. The option templates are all left-aligned, the option descriptions are all left aligned to the right of the longest option template, and the option descriptions wrap at word boundaries at the given right margin.
 *
 * @param group An array of array pairs `[optionTemplate, optionDescription]`. The optionDescription can have multiple lines, including blank lines.
 * @param delim The delimiter to place between the option template and the start of its description. Use space characters to space the two apart.
 * @param leftMargin The margin at which to list the options templates.
 * @param rightMargin The margin at which to wrap the option descriptions. Lines are wrapped at spaces.
 * @param spaceEntries Whether to put a blank line between consecutive entries.
 * @returns a string compilation of all of group's options, ending with `\n`
 */

exports.generateHelpGroup = function (
        group, delim, leftMargin, rightMargin, spaceEntries)
{
    var maxArgLength = 0;
    group.forEach(function (helpEntry) {
        if (helpEntry[0].length > maxArgLength)
            maxArgLength = helpEntry[0].length;
    });
    var leftTextMargin = leftMargin + maxArgLength + delim.length;
    var maxTextWidth = rightMargin - leftTextMargin;

    var leftMarginSpaces = ' '.repeat(leftMargin);
    var argumentPadding = ' '.repeat(maxArgLength);
    var textMarginSpaces = ' '.repeat(leftTextMargin);

    var help = '';
    group.forEach(function (helpEntry) {
        if (help !== '' && spaceEntries)
            help += "\n";
        var arg = helpEntry[0];
        var text = helpEntry[1];
        if (text[text.length - 1] === "\n")
            text = text.substr(0, text.length - 1);
        var lines = text.split("\n");
        var startLine = leftMarginSpaces + arg +
                argumentPadding.substr(arg.length) + delim;
        lines.forEach(function (line) {
            var wrappedLines = exports.wrapLine(line, maxTextWidth);
            wrappedLines.forEach(function (wrappedLine) {
                help += startLine + wrappedLine;
                startLine = "\n"+ textMarginSpaces;
            });
        });
        help += "\n";
    });
    return help;
}

/**
 * Returns the boolean value of a flag according to a flag list, where flags are case-sensitive letters.
 *
 * @param flags String of letters for flags that are true
 * @param flagLetter Letter of flag to look for in flags
 * @returns true if the letter is found in the flag list; false otherwise
 */

exports.getFlag = function (flags, flagLetter) {
    if (_.isUndefined(flags))
        return false;
    return (flags.indexOf(flagLetter) >= 0);
};

/**
 * Minimist collects multiple assignments of the same option into an array of all of the assigned values. This feature is useful for allowing the command to support a default set of options, such as via an environment variable. Applying the default options before the actual options makes the last value of the array the intended value of the option. This function returns the last value of all array options except for those for which multiple values are allowed.
 *
 * @param options Options output of minimist, which the function modifies.
 * @param multiplesAllowed Array of options that collect all values instead of using only the last value supplied.
 */

exports.keepLastOfDuplicates = function (options, multiplesAllowed) {
    multiplesAllowed.push('_');
    Object.keys(options).forEach(function (key) {
        var option = options[key];
        if (_.isArray(option) && multiplesAllowed.indexOf(key) < 0)
            options[key] = option[option.length - 1];
    });
};

/**
 * Returns the name of the last option to appear in the argument list from a set of mutually exclusive alternatives, or null if none of the alternatives appears in the argument list.
 *
 * @param argv Array of arguments input to minimist.
 * @param alternatives Array of names of mutually exclusive options.
 * @returns name of last mutually exclusive option, or null if none provided.
 */

exports.lastOfMutuallyExclusive = function (argv, alternatives) {
    var lastOption = null;
    var greatestIndex = -1;
    alternatives.forEach(function (option) {
        var lastIndex = argv.lastIndexOf('--'+ option);
        if (lastIndex > greatestIndex) {
            lastOption = option;
            greatestIndex = lastIndex;
        }
    });
    return lastOption;
};

/**
 * Wraps the provided line at the given maximum width and return an array of the wrapped lines. Lines are wrapped the space boundary between words. Useful for generating help output.
 *
 * @param line Line to wrap, without trailing `\n`
 * @param maxWidth Column at which to wrap the line. This width includes the margin that leftMarginSize specifies.
 * @param leftMarginSize Number of spaces that are to precede each wrapped line. (defaults to 0)
 * @returns an array of the lines that result from wrapping line at maxWidth
 */
 
exports.wrapLine = function (line, maxWidth, leftMarginSize) {
    if (line.length === 0)
        return [''];
    if (_.isUndefined(leftMarginSize))
        leftMarginSize = 0;
    var wrappedLines = [];
    var leftMargin = ' '.repeat(leftMarginSize);
    
    // not terribly efficient, but does the job
    var words = line.split(' ');
    var run = leftMargin;
    var delim = '';
    words.forEach(function (word) {
        if (run.length + delim.length + word.length <= maxWidth) {
            run += delim + word;
            delim = ' ';
        }
        else {
            wrappedLines.push(run);
            run = leftMargin + word;
        }
    });
    if (delim !== '')
        wrappedLines.push(run);
        
    return wrappedLines;
};

/**
 * Wraps the lines of the provided text at the given maximum width and returns the wrapped text as a string. Lines are wrapped on the space boundary between words. The function optionally automatically indents each wrapped line to the indentation at which the line begins. Useful for wrapping help output.
 *
 * @param text Text string of one or more lines to wrap.
 * @param maxWidth Column at which to wrap the lines. This width includes the margin that leftMarginSize specifies.
 * @param autoIndent Whether to automatically indent wrapped lines to the indentation at which they begin.
 * @returns a string containing the text with all lines wrapped
 */
 
exports.wrapText = function (text, maxWidth, autoIndent) {
    var lines = text.split("\n");
    var wrappedText = '';
    var delim = '';
    var leftMarginSize;
    var wrappedLines;
    
    lines.forEach(function (line) {
        leftMarginSize = (autoIndent ? line.match(/^ */)[0].length : 0);
        if (leftMarginSize > 0)
            line = line.substr(leftMarginSize);
        wrappedLines = exports.wrapLine(line, maxWidth, leftMarginSize);
        wrappedLines.forEach(function (wrappedLine) {
            wrappedText += delim + wrappedLine;
            delim = "\n";
        });
    });
    return wrappedText;
};
    
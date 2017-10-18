/******************************************************************************
Functions for managing the command line arguments and minimist options.
******************************************************************************/

/**
This reference assumes the module is loaded in the variable `optionhelp`.

@module optionhelp
*/

var _ = require('lodash');

/**
 * Turns boolean arguments off when suffixed by `-`. Minimist provides a `--no-<arg>` option for setting the value of `<arg>` to false. When an argument defaults to true (maybe because of an environment variable) and the user may need to frequently set it to false, the minimist way gets a bit cumbersome.
 *
 * @param args Options output of minimist, which the function modifies.
 * @param configOptions The configuration options provided to minimist to produces the given args. The function uses this to identify the boolean arguments and their aliases.
 */

exports.applyBooleanOffSwitch = function (args, configOptions) {
    if (_.isUndefined(configOptions.boolean))
        return;
    var aliases = configOptions.alias;
    configOptions.boolean.forEach(function (letter) {
        if (args[letter] === '-') {
            args[letter] = false;
            if (aliases && !_.isUndefined(aliases[letter]))
                args[aliases[letter]] = false;
        }
    });
};

/**
 * Generates a string that shows the help information for a group of command line options. The option templates are all left-aligned, the option descriptions are all left aligned to the right of the longest option template, and the option descriptions wrap at word boundaries at the given right margin.
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
 * Minimist collects multiple assignments of the same option into an array of all of the values assigned to that option. This feature is useful for allowing the command to support a default set of option values, such as via an environment variable. Applying the default option values before the actually provided options makes the last value of the array the intended value of the option. This function returns the last value of all array arguments except for those for which the caller specifies that multiple values are allowed.
 *
 * @param args Arguments output by minimist, which the function modifies by reducing arrays other than multiplesAllowed to just the last array element.
 * @param multiplesAllowed Array of the names of options that collect all values instead of using only the last value supplied.
 */

exports.keepLastOfDuplicates = function (args, multiplesAllowed) {
    multiplesAllowed.push('_');
    Object.keys(args).forEach(function (key) {
        var arg = args[key];
        if (_.isArray(arg) && multiplesAllowed.indexOf(key) < 0)
            arg[key] = arg[arg.length - 1];
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
 * Wraps the provided line at the given maximum width and return an array of the wrapped lines. Lines are wrapped at the space boundary between words. Useful for generating help output.
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
    var run = '';
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
 * @param autoIndentDelta Whether to automatically indent wrapped lines. Boolean or integer, but optional. When boolean, indicates whether to wrap to the prior line's indentation column. Defaults to false, which starts wrapped lines in the first column. When an integer, automatic indentation is enabled to a the column given by the prior line plus this integer. For example, a delta of 4 further indents wraps lines by 4 spaces. The delta may be negative to unindent.
 * @returns a string containing the text with all lines wrapped
 */
 
exports.wrapText = function (text, maxWidth, autoIndentDelta) {
    var lines = text.split("\n");
    var wrappedText = '';
    var delim = '';
    var leftMarginSize;
    var wrappedLines;
    var autoIndenting = (autoIndentDelta || autoIndentDelta === 0);
    
    if (autoIndentDelta === true)
        autoIndentDelta = 0;
    lines.forEach(function (line) {
        leftMarginSize = (autoIndenting ? line.match(/^ */)[0].length : 0);
        if (autoIndenting) {
            leftMarginSize += autoIndentDelta;
            if (leftMarginSize < 0)
                leftMarginSize = 0;
        }
        wrappedLines = exports.wrapLine(line, maxWidth, leftMarginSize);
        wrappedLines.forEach(function (wrappedLine) {
            wrappedText += delim + wrappedLine;
            delim = "\n";
        });
    });
    return wrappedText;
};
    
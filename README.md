# option-help
some functions that help manage command line options

## Overview

This is a library of utility functions that assist with making command line executables. It consists mainly of tools to help work with [`minimist`](https://github.com/substack/minimist) options and with outputting nicely formatted help pages.

## API Reference
This reference assumes the module is loaded in the variable `optionhelp`.


* [optionhelp](#module_optionhelp)

    * [.applyBooleanOffSwitch(args, configOptions)](#module_optionhelp.applyBooleanOffSwitch)

    * [.generateHelpGroup(group, delim, leftMargin, rightMargin, spaceEntries)](#module_optionhelp.generateHelpGroup)

    * [.getFlag(flags, flagLetter)](#module_optionhelp.getFlag)

    * [.keepLastOfDuplicates(args, multiplesAllowed)](#module_optionhelp.keepLastOfDuplicates)

    * [.lastOfMutuallyExclusive(argv, alternatives)](#module_optionhelp.lastOfMutuallyExclusive)

    * [.wrapLine(line, maxWidth, leftMarginSize)](#module_optionhelp.wrapLine)

    * [.wrapText(text, maxWidth, autoIndent)](#module_optionhelp.wrapText)


<a name="module_optionhelp.applyBooleanOffSwitch"></a>

### *optionhelp*.applyBooleanOffSwitch(args, configOptions)

| Param | Description |
| --- | --- |
| args | Options output of minimist, which the function modifies. |
| configOptions | The configuration options provided to minimist to produces the given args. The function uses this to identify the boolean arguments and their aliases. |

Turns boolean arguments off when suffixed by `-`. Minimist provides a `--no-<arg>` option for setting the value of `<arg>` to false. When an argument defaults to true (maybe because of an environment variable) and the user may need to frequently set it to false, the minimist way gets a bit cumbersome.

<a name="module_optionhelp.generateHelpGroup"></a>

### *optionhelp*.generateHelpGroup(group, delim, leftMargin, rightMargin, spaceEntries)

| Param | Description |
| --- | --- |
| group | An array of array pairs `[optionTemplate, optionDescription]`. The optionDescription can have multiple lines, including blank lines. |
| delim | The delimiter to place between the option template and the start of its description. Use space characters to space the two apart. |
| leftMargin | The margin at which to list the options templates. |
| rightMargin | The margin at which to wrap the option descriptions. Lines are wrapped at spaces. |
| spaceEntries | Whether to put a blank line between consecutive entries. |

Generates a string that shows the help information for a group of command line options. The option templates are all left-aligned, the option descriptions are all left aligned to the right of the longest option template, and the option descriptions wrap at word boundaries at the given right margin.

**Returns**: a string compilation of all of group's options, ending with `\n`  
<a name="module_optionhelp.getFlag"></a>

### *optionhelp*.getFlag(flags, flagLetter)

| Param | Description |
| --- | --- |
| flags | String of letters for flags that are true |
| flagLetter | Letter of flag to look for in flags |

Returns the boolean value of a flag according to a flag list, where flags are case-sensitive letters.

**Returns**: true if the letter is found in the flag list; false otherwise  
<a name="module_optionhelp.keepLastOfDuplicates"></a>

### *optionhelp*.keepLastOfDuplicates(args, multiplesAllowed)

| Param | Description |
| --- | --- |
| args | Arguments output by minimist, which the function modifies by reducing arrays other than multiplesAllowed to just the last array element. |
| multiplesAllowed | Array of the names of options that collect all values instead of using only the last value supplied. |

Minimist collects multiple assignments of the same option into an array of all of the values assigned to that option. This feature is useful for allowing the command to support a default set of option values, such as via an environment variable. Applying the default option values before the actually provided options makes the last value of the array the intended value of the option. This function returns the last value of all array arguments except for those for which the caller specifies that multiple values are allowed.

<a name="module_optionhelp.lastOfMutuallyExclusive"></a>

### *optionhelp*.lastOfMutuallyExclusive(argv, alternatives)

| Param | Description |
| --- | --- |
| argv | Array of arguments input to minimist. |
| alternatives | Array of names of mutually exclusive options. |

Returns the name of the last option to appear in the argument list from a set of mutually exclusive alternatives, or null if none of the alternatives appears in the argument list.

**Returns**: name of last mutually exclusive option, or null if none provided.  
<a name="module_optionhelp.wrapLine"></a>

### *optionhelp*.wrapLine(line, maxWidth, leftMarginSize)

| Param | Description |
| --- | --- |
| line | Line to wrap, without trailing `\n` |
| maxWidth | Column at which to wrap the line. This width includes the margin that leftMarginSize specifies. |
| leftMarginSize | Number of spaces that are to precede each wrapped line. (defaults to 0) |

Wraps the provided line at the given maximum width and return an array of the wrapped lines. Lines are wrapped the space boundary between words. Useful for generating help output.

**Returns**: an array of the lines that result from wrapping line at maxWidth  
<a name="module_optionhelp.wrapText"></a>

### *optionhelp*.wrapText(text, maxWidth, autoIndent)

| Param | Description |
| --- | --- |
| text | Text string of one or more lines to wrap. |
| maxWidth | Column at which to wrap the lines. This width includes the margin that leftMarginSize specifies. |
| autoIndent | Whether to automatically indent wrapped lines to the indentation at which they begin. |

Wraps the lines of the provided text at the given maximum width and returns the wrapped text as a string. Lines are wrapped on the space boundary between words. The function optionally automatically indents each wrapped line to the indentation at which the line begins. Useful for wrapping help output.

**Returns**: a string containing the text with all lines wrapped  

## LICENSE

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Copyright © 2016 Joseph T. Lapp
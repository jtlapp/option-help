
import Minimist = require("minimist");

export function applyBooleanOffSwitch(
    args: Minimist.ParsedArgs,
    configOptions: Minimist.Opts
): void;

export function generateHelpGroup(
    group: Array<[string, string]>,
    delim: string,
    leftMargin: number,
    rightMargin: number,
    spaceEntries: boolean
): string;

export function getFlag(
    flags: string,
    flagLetter: string
): boolean;

export function keepLastOfDuplicates(
    args: Minimist.ParsedArgs,
    multiplesAllowed: string[]
): void;

export function lastOfMutuallyExclusive(
    args: Minimist.ParsedArgs,
    alternatives: string[]
): string;

export function wrapLine(
    line: string,
    maxWidth: number,
    leftMarginSize: number
): string[];

export function wrapText(
    text: string,
    maxWidth: number,
    autoIndent: boolean
): string;

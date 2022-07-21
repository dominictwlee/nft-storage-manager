import chalk from "chalk";

const infoColor = chalk.white;
const warningColor = chalk.yellowBright;
const errorColor = chalk.redBright;
const successColor = chalk.greenBright;

export function info(...text: unknown[]) {
  console.log(infoColor(text));
}

export function warning(...text: unknown[]) {
  console.log(warningColor(text));
}

export function error(...text: unknown[]) {
  console.log(errorColor(text));
}

export function success(...text: unknown[]) {
  console.log(successColor(text));
}

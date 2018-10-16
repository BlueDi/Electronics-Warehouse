let chalk = require('chalk');

// simple print colorful consoles util for universal usage
const print = {
  error(message, code) {
    console.error(chalk.red(`${message}\n`));
    code && process && process.exit(code);
  },
  info(message, code) {
    console.info(chalk.cyan(`${message}\n`));
    code && process && process.exit(code);
  },
  warn(message, code) {
    console.warn(chalk.yellow(`${message}\n`));
    code && process && process.exit(code);
  },
  success(message, code) {
    console.log(chalk.green(`${message}\n`));
    code && process && process.exit(code);
  }
};

export default print;

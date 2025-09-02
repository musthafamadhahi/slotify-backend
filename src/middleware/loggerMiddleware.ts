import chalk from 'chalk';
import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on('finish', () => {
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    const statusColor =
      status >= 500
        ? chalk.redBright
        : status >= 400
        ? chalk.red
        : status >= 300
        ? chalk.yellow
        : chalk.green;

    console.log(statusColor(`[${method}] ${url} : ${status}`));
  });

  next();
};

export const logError = (err: unknown) => {
  if (err instanceof Error) {
    console.error(chalk.red('[ERROR]'), err.stack);
  } else {
    console.error(chalk.red('[ERROR]'), err);
  }
};

export const logInfo = (...args: unknown[]) => {
  console.log(chalk.blue('[INFO]'), ...args);
};

export const logSuccess = (...args: unknown[]) => {
  console.log(chalk.green('[SUCCESS]'), ...args);
};

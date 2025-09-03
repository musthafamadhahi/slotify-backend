import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

// Define the logs directory path
// const logsDirectory = path.join(process.cwd(), 'logs');

// Create the logs directory if it doesn't exist
// if (!fs.existsSync(logsDirectory)) {
//   fs.mkdirSync(logsDirectory, { recursive: true });
// }

// Create a writable stream for logging to a file in the logs directory
// const logStream = fs.createWriteStream(
//   path.join(logsDirectory, 'requests.log'),
//   {
//     flags: 'a',
//   }
// );

const customFormat: morgan.FormatFn = (tokens, req, res) => {
  const date = new Date();
  const formattedDate = `${date
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  return [
    `[${formattedDate}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), // Response length
  ].join(' ');
};

// Set up morgan to log requests to the console and the log file with custom format
const logger = morgan(customFormat, {
  stream: {
    write: (message) => {
      // Log to the file
      // logStream.write(message);
      // Also log to the console
      console.log(message.trim());
    },
  },
});

export default logger;

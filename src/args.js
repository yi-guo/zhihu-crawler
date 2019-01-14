/**
 * @format
 * @flow
 */

'use strict';

const invariant = require('invariant');
const path = require('path');
const yargs = require('yargs');

const args = yargs
  .usage('$0 <command> [options]')
  .command(
    'question <id>',
    'Crawl images in answers to a Zhihu question',
    yargs =>
      yargs
        .positional('id', {
          type: 'number',
        })
        .option('max-answers', {
          type: 'number',
          default: 0,
          describe:
            'Maximum number of Zhihu answers to crawl. Useful for popular ' +
            'Zhihu questions that may have thousands of answers. Crawl ' +
            'everything if 0.',
        }),
  )
  .command('answer <id>', 'Crawl images in a Zhihu answer', yargs =>
    yargs.positional('id', {type: 'number'}),
  )
  .option('output', {
    alias: 'o',
    type: 'string',
    coerce: path.resolve,
    describe: 'Path of a directory to store the crawled images',
  })
  .option('max-concurrency', {
    type: 'number',
    default: 20,
    requiresArg: true,
    describe: 'Maximum number of concurrent HTTP requests',
  })
  .option('max-attempts', {
    type: 'number',
    default: 5,
    requiresArg: true,
    describe: 'Maximum number of attempts upon an HTTP error',
  })
  .check(argv => {
    invariant(
      argv._.length < 2,
      `Unrecognized argument(s): ${argv._.slice(1).join(', ')}`,
    );
    ['id', 'max-concurrency', 'max-attempts'].forEach(key =>
      assertNonNegativeInteger(key, argv[key]),
    );
    if (argv._[0] === 'question') {
      const key = 'max-answers';
      assertNonNegativeInteger(key, argv[key]);
    }
    return true;
  })
  .help().argv;

function assertNonNegativeInteger(label: string, value: any): void {
  const valueInt = parseInt(value);
  invariant(
    !isNaN(valueInt) && valueInt >= 0,
    `Invalid ${label}: ${value} must be a positive integer`,
  );
}

module.exports = args;

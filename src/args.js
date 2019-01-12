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
          default: '0',
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
    ['id', 'max-answers', 'max-concurrency', 'max-attempts'].forEach(key => {
      invariant(
        !isNaN(argv[key]) && argv[key] >= 0,
        `Invalid ${key}: ${key} must be a positive integer`,
      );
    });
    return true;
  })
  .help().argv;

module.exports = args;

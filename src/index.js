/**
 * @format
 * @flow
 */

const Answer = require('./Answer');
const invariant = require('invariant');
const Question = require('./Question');
const yargs = require('yargs');

yargs
  .usage('$0 [args]')
  .option('question', {
    alias: 'q',
    type: 'number',
    describe:
      'ID of a question. Images that reside in answers to this question will ' +
      'be parsed and downloaded.',
  })
  .option('answer', {
    alias: 'a',
    type: 'number',
    describe:
      'ID of an answer. Images that reside in this answer will be parsed and ' +
      'downloaded.',
  })
  .option('total', {
    alias: 't',
    type: 'number',
    default: 0,
    describe:
      'Total number of answers to crawl when a question ID is provided. ' +
      'Crawl all if 0.',
  })
  .help();

function main() {
  const {question, answer, total} = yargs.argv;
  invariant(
    question || answer,
    'You need to provide a question ID or an answer ID to start with.',
  );
  if (question) {
    new Question(question, total).downloadImages();
  }
  if (answer) {
    new Answer(answer).downloadImages();
  }
}

main();

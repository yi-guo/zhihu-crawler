/**
 * @format
 * @flow
 */

const Answer = require('./Answer');
const API = require('./API');
const args = require('./args');
const idx = require('idx');
const invariant = require('invariant');
const Question = require('./Question');

const TIMEOUT_BEFORE_SUMMARY_MS = 500;

function main(): void {
  const {id, maxAnswers} = args;
  const command = idx(args, _ => _._[0]);
  const onComplete = () =>
    setTimeout(
      () => console.log(API.getOutputSummary()),
      TIMEOUT_BEFORE_SUMMARY_MS,
    );
  switch (command) {
    case 'question':
      new Question(id, maxAnswers).downloadImages(onComplete);
      break;
    case 'answer':
      new Answer(id).downloadImages(onComplete);
      break;
    default:
      invariant(false, 'Unrecognized command');
  }
}

main();

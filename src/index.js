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

function main(): void {
  const {id, maxAnswers} = args;
  const command = idx(args, _ => _._[0]);
  console.log(`Output: ${API.getOutputPath()}`);
  switch (command) {
    case 'question':
      (new Question(id, maxAnswers)).downloadImages();
      break;
    case 'answer':
      (new Answer(id)).downloadImages();
      break;
    default:
      invariant(false, 'Unrecognized command');
  }
}

main();

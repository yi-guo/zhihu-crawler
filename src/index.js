/**
 * @format
 * @flow
 */

const args = require('./args');
const Answer = require('./Answer');
const idx = require('idx');
const invariant = require('invariant');
const Question = require('./Question');

function main() {
  const {id, maxAnswers} = args;
  const command = idx(args, _ => _._[0]);
  if (command === 'question') {
    new Question(id, maxAnswers).downloadImages();
  }
  if (command === 'answer') {
    new Answer(id).downloadImages();
  }
}

main();

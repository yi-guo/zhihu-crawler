/**
 * @format
 * @flow
 */

'use strict';

const Answer = require('./Answer');
const {get} = require('./API');
const idx = require('idx');
const invariant = require('invariant');
const ProgressBar = require('ascii-progress');

const LIMIT = 20;

class Question {
  _id: number;
  _maxAnswers: number;
  _progressBar: ProgressBar;

  constructor(id: number, maxAnswers?: number) {
    this._id = id;
    this._maxAnswers =
      maxAnswers && maxAnswers > 0 ? maxAnswers : Number.MAX_SAFE_INTEGER;
  }

  async downloadImages(): Promise<void> {
    const promises = [];
    const answers = await this._populateAnswers();
    answers.forEach(answer =>
      promises.push(answer.downloadImages(() => this._progressBar.tick())),
    );
    await Promise.all(promises);
  }

  async _populateAnswers(): Promise<Set<Answer>> {
    const answers = new Set();
    const path = `/questions/${this._id}/answers`;
    const {paging} = await get(path);

    invariant(
      paging.totals >= 0,
      `Malformed paging.totals: expected<number>, received<${paging.totals}>`,
    );

    const promises = [];
    const total = Math.min(paging.totals, this._maxAnswers);
    this._progressBar = new ProgressBar({
      schema: `Question<${
        this._id
      }>:.magenta .white:bar.green  :percent :current/:total :elapseds :etas`,
      total: total,
      blank: ' ',
    });

    for (let offset = 0; offset < total; offset += LIMIT) {
      promises.push(
        get(path, {
          limit: Math.min(LIMIT, total - offset),
          offset: offset,
        }),
      );
    }

    const responses = await Promise.all(promises);
    responses.forEach(response => {
      const {data} = response;
      invariant(
        Array.isArray(data),
        `Malformed data: expected<Array>. received<${data}>`,
      );
      data.forEach(answer => answers.add(new Answer(answer.id, true)));
    });

    return answers;
  }
}

module.exports = Question;

/**
 * @format
 * @flow
 */

'use strict';

const Answer = require('./Answer');
const API = require('./API');
const idx = require('idx');
const invariant = require('invariant');
const CliProgress = require('cli-progress');

const LIMIT = 20;

class Question {
  _id: number;
  _maxAnswers: number;
  _progressBar: CliProgress.Bar;

  constructor(id: number, maxAnswers?: number) {
    this._id = id;
    this._maxAnswers =
      maxAnswers && maxAnswers > 0 ? maxAnswers : Number.MAX_SAFE_INTEGER;
  }

  async downloadImages(callback?: () => void): Promise<void> {
    const promises = [];
    const answers = await this._populateAnswers();
    answers.forEach(answer =>
      promises.push(answer.downloadImages(() => this._progressBar.increment())),
    );
    await Promise.all(promises);
    callback && callback();
  }

  async _populateAnswers(): Promise<Set<Answer>> {
    const answers = new Set();
    const path = `/questions/${this._id}/answers`;
    const {paging} = await API.get(path);

    invariant(
      paging.totals >= 0,
      `Malformed paging.totals: expected<number>, received<${paging.totals}>`,
    );

    const promises = [];
    const total = Math.min(paging.totals, this._maxAnswers);
    this._progressBar = new CliProgress.Bar({
      format: `Question<${this._id}>: [{bar}] {percentage}% {value}/{total} {duration_formatted}`,
      stopOnComplete: true,
    });
    this._progressBar.start(total, 0);

    for (let offset = 0; offset < total; offset += LIMIT) {
      promises.push(
        API.get(path, {
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

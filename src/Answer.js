/**
 * @format
 * @flow
 */

'use strict';

const API = require('./API');
const idx = require('idx');
const invariant = require('invariant');
const {JSDOM} = require('jsdom');
const CliProgress = require('cli-progress');

const ATTRIBUTE_SRC = 'src';
const ATTRIBUTE_DATA_ORIGINAL = 'data-original';
const ATTRIBUTE_DATA_ACTUAL_SRC = 'data-actualsrc';

class Answer {
  _id: number;
  _disableProgressBar: boolean;

  constructor(id: number, disableProgressBar: boolean = false) {
    this._id = id;
    this._disableProgressBar = disableProgressBar;
  }

  async downloadImages(callback?: () => void): Promise<void> {
    const {content} = await API.get(`/answers/${this._id}`, {
      include: 'data[*].content',
    });

    if (typeof content !== 'string') {
      callback && callback();
      return;
    }

    const images = idx(new JSDOM(content), _ => _.window.document.images);

    if (!(images && images.length > 0)) {
      callback && callback();
      return;
    }

    let progressBar = null;
    if (!this._disableProgressBar) {
      progressBar = new CliProgress.Bar({
        format: `Answer<${this._id}>: [{bar}] {percentage}% {value}/{total} {duration_formatted}`,
        stopOnComplete: true,
      });
      progressBar.start(images.length, 0);
    }

    const promises = [];
    for (let i = 0; i < images.length; i++) {
      promises.push(
        API.download(this._getImageURI(images[i]), () => {
          progressBar && progressBar.increment();
        }),
      );
    }

    await Promise.all(promises);
    callback && callback();
  }

  _getImageURI(image: Object): string {
    const imageURI =
      image.getAttribute(ATTRIBUTE_DATA_ORIGINAL) ||
      image.getAttribute(ATTRIBUTE_DATA_ACTUAL_SRC) ||
      image.getAttribute(ATTRIBUTE_SRC);
    invariant(
      typeof imageURI === 'string',
      `Malformed image_uri: expected<string>, received<${imageURI}>`,
    );
    return imageURI;
  }
}

module.exports = Answer;

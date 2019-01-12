/**
 * @format
 * @flow
 */

'use strict';

const API = require('./API');
const idx = require('idx');
const invariant = require('invariant');
const {JSDOM} = require('jsdom');
const ProgressBar = require('ascii-progress');

const ATTRIBUTE_SRC = 'src';
const ATTRIBUTE_DATA_ORIGINAL = 'data-original';
const ATTRIBUTE_DATA_ACTUAL_SRC = 'data-actualsrc';

class Answer {
  _id: number;
  _disableProgressBar: boolean;

  constructor(id: number, disableProgressBar: boolean = false) {
    this._id = id;
    this._disableProgressBar;
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

    if (!(images && images.length)) {
      callback && callback();
      return;
    }

    const promises = [];
    const progressBar =
      this._disableProgressBar &&
      new ProgressBar({
        schema: `Answer<${
          this._id
        }>:.magenta .white:bar.green  :percent :current/:total :elapseds :etas`,
        total: images.length,
        blank: ' ',
      });

    for (let i = 0; i < images.length; i++) {
      promises.push(
        API.download(this._getImageURI(images[i]), () => {
          progressBar && progressBar.tick();
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

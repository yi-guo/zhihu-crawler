/**
 * @format
 * @flow
 */

'use strict';

const args = require('./args');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const promiseLimit = require('promise-limit');
const URI = require('urijs');

const BASE_URI = 'https://www.zhihu.com/api/v4';
const REQUEST_OPTIONS = {
  method: 'GET',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
  },
};

class API {
  _outputPath: string;
  _promiseLimit: (() => Promise<any>) => Promise<any>;

  constructor() {
    this._outputPath = this._populateOutputPath();
    this._promiseLimit = promiseLimit(args.maxConcurrency);
  }

  async get(path: string, query?: Object): Promise<Object> {
    const uri = URI(BASE_URI)
      .path(URI.joinPaths(BASE_URI, path))
      .query(URI.buildQuery(query));
    return this._promiseLimit(async () => {
      const response = await this._fetchWithRetry(
        uri.toString(),
        REQUEST_OPTIONS,
      );
      return await response.json();
    });
  }

  async download(uri: string, callback?: () => void): Promise<void> {
    const filePath = path.join(this._outputPath, URI.parse(uri).path);
    if (fs.existsSync(filePath)) {
      callback && callback();
      return;
    }

    return await this._promiseLimit(async () => {
      const response = await this._fetchWithRetry(uri, REQUEST_OPTIONS);
      const arrayBuffer = await response.arrayBuffer();
      fs.appendFile(
        filePath,
        Buffer.from(arrayBuffer),
        () => callback && callback(),
      );
    });
  }

  getOutputPath(): string {
    return this._outputPath;
  }

  async _fetchWithRetry<T>(
    uri: string,
    options: Object,
    attempt: number = 1,
  ): Promise<T> {
    try {
      return await fetch(uri, options);
    } catch (e) {
      if (attempt++ > args.maxAttempts) {
        throw e;
      }
      console.log(`Retry ${attempt}/${args.maxAttempts}: ${uri}`);
      return await this._fetchWithRetry(uri, options, attempt);
    }
  }

  _populateOutputPath(): string {
    let outputPath = path.resolve(args.output || `output_${args.id}`);
    if (fs.existsSync(outputPath)) {
      return fs.mkdtempSync(`${outputPath}_`);
    }
    fs.mkdirSync(outputPath);
    return outputPath;
  }
}

const api = new API();
Object.freeze(api);

module.exports = api;

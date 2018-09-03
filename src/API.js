/**
 * @format
 * @flow
 */

'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const promiseLimit = require('promise-limit');
const URI = require('urijs');

const MAX_ATTEMPTS = 5;
const MAX_CONCURRENCY = 20;
const BASE_URI = 'https://www.zhihu.com/api/v4';
const REQUEST_OPTIONS = {
  method: 'GET',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
  },
};

const limit = promiseLimit(MAX_CONCURRENCY);

async function get(path: string, query?: Object): Promise<Object> {
  const uri = URI(BASE_URI)
    .path(URI.joinPaths(BASE_URI, path))
    .query(URI.buildQuery(query));
  return limit(async () => {
    const response = await _fetchWithRetry(uri.toString(), REQUEST_OPTIONS);
    return await response.json();
  });
}

async function download(uri: string, callback?: () => void): Promise<void> {
  const directory = 'output';
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  const filePath = directory + URI.parse(uri).path;
  if (fs.existsSync(filePath)) {
    callback && callback();
    return;
  }

  return await limit(async () => {
    const response = await _fetchWithRetry(uri, REQUEST_OPTIONS);
    const arrayBuffer = await response.arrayBuffer();
    fs.appendFile(
      filePath,
      Buffer.from(arrayBuffer),
      () => callback && callback(),
    );
  });
}

async function _fetchWithRetry<T>(
  uri: string,
  options: Object,
  attempt: number = 0,
): Promise<T> {
  try {
    return await fetch(uri, options);
  } catch (e) {
    if (++attempt > MAX_ATTEMPTS) {
      throw e;
    }
    console.log(`Retry ${attempt}/${MAX_ATTEMPTS}: ${uri}`);
    return await _fetchWithRetry(uri, options, attempt);
  }
}

module.exports = {
  get,
  download,
};

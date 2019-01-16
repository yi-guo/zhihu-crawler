# zhihu-crawler

A web crawler for https://www.zhihu.com that crawls and downloads all of the images in the specified Zhihu question or answer.

System Requirements
- `node.js`
- `yarn`

If you have the above requirements and wish to run this script directly, follow the guidence below to get started. Alternatively, if you prefer `docker`, check out https://hub.docker.com/r/yiguo/zhihu-crawler.

1) Install dependencies
```
$ yarn install
```
2) Run the script
```
$ yarn start <question|answer> <question_id|answer_id> [--output <output_path>]
```

You may find the question and answer ID in the URL. For example, if you are at https://www.zhihu.com/question/12345/answer/67890, then `12345` is your question ID, and `67890` is your answer ID.

By default, a directory named `output_<question_id|answer_id>` will be created to hold the images to be downloaded. In the occasion of conflict, a few random characters will be appended in the end. You may also choose to control the download location by using the `--output` parameter.

Note that images will be crawled and downloaded concurrently and retried automatically upon failure. If you'd like to control the maximum concurrency and retries, you may specify `--max-concurrency` and `--max-attempts` as part of the above command.

To learn more about what you can do, simply invoke
```
$ yarn start --help
```

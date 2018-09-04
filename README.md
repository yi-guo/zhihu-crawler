# zhihu-crawler

A web crawler for https://www.zhihu.com.

A Zhihu question consists a number of Zhihu answers, and an answer may have pictures as part of its content. This crawler with a Zhihu question ID or an answer ID will crawl and download all of the pictures that reside in its answers, or the answer itself, respectively, to the specified location.

To run, you need
- `node.js`
- `yarn`

1) Install all of the dependencies with the following inside the root of the respository.
```
$ yarn install
```
2) Start by
```
$ yarn start <question|answer> <question_id|answer_id> --output <output_path>
```

For example, if you are at https://www.zhihu.com/question/12345/answer/67890, then `12345` is your question ID, and `67890` is your answer ID.

Note that answers and images will be crawled concurrently, and automatically retried upon failure. If you'd like to control the maximum concurrency and attempts, you add `--max-concurrency` and `--max-attempts` to the above command.

To learn more about what you can do, simply invoke
```
$ yarn start --help
```
at any time.

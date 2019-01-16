# zhihu-crawler

A web crawler for https://www.zhihu.com that crawls and downloads all of the images in the specified Zhihu question or answer. To get started, you need to know the ID of the Zhihu question or answer that contains the images to download. This can be found in your Zhihu URL. For example, if you have https://www.zhihu.com/question/12345/answer/67890, then `12345` is your question ID, and `67890` is your answer ID.

### Run With Docker
```
$ docker run --rm -it \
      -v <host_destination>:/output \
      yiguo/zhihu-crawler \
      <question|answer> <question_id|answer_id>
```

The above command mounts the directory on your host machine specified by `host_destination` and binds it to `/output` in the container such that images will be available to view immediately on your host machine as the crawler continuously downloads them to `/output` within the container.

### Run Directly
System Requirements
- `node.js`
- `yarn`

1) Install dependencies
```
$ yarn install
```
2) Run the script
```
$ yarn start <question|answer> <question_id|answer_id> [--output <output_path>]
```

By default, a directory named `output_<question_id|answer_id>` will be created to hold the images to be downloaded. In the occasion of conflict, a few random characters will be appended in the end. You may also choose to control the download location by using the `--output` parameter.

To learn more about what you can do, simply invoke
```
$ yarn start --help
```

Note that images will be crawled and downloaded concurrently and retried automatically upon failure. If you'd like to control the maximum concurrency and retries regardless of how you run it, you may append `--max-concurrency` and `--max-attempts` to the end of either of the above command.

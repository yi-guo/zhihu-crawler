# Use a debian image instead of node due to an error that requires dependencies
# to be reinstalled (yarn install) per every run
FROM debian:latest

# Set work directory
WORKDIR /usr/app

# Bind volume to hold the downloaded content
VOLUME /output

# Install nodejs and yarn
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y build-essential curl make \
    && apt-get remove cmdtest \
    && curl -sL https://deb.nodesource.com/setup_11.x | bash - \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y nodejs yarn

# Copy source code
COPY . .

# Install dependencies
RUN yarn install

# Set entry command with output path pointing to the binded volume
ENTRYPOINT ["yarn", "start", "--output", "/output"]

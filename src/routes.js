const express = require('express');
const shelljs = require('shelljs');
const fs = require('fs');

const routes = express.Router();

const PATH_FILE = process.env.CONFIG_FILE || './config.json';

(function setup() {
  try {
    const config = JSON.parse(fs.readFileSync(PATH_FILE));
    const { paths } = config;

    if (!paths) {
      throw new Error('Missing paths');
    }

    for (let i = 0; i < paths.length; i += 1) {
      const {
        provider, name, stderr, stderr_text, stdout, stdout_text, ...slack_options
      } = paths[i];

      routes.get(`/${encodeURI(name)}`, (_, res) => {
        const result = shelljs.exec(`${provider.path}1 ${provider.arguments}`);

        const attachments = [{ text: '' }];

        if (slack_options.attachments) {
          attachments.push(...slack_options.attachments);
        }

        const slackMessage = { ...slack_options, attachments };

        if (stderr && result.code !== 0) {
          slackMessage.attachments[0].text = stderr ? `${stderr_text} \n\n ${result.stderr}` : '';
        } else if (stdout && result.code === 0) {
          slackMessage.attachments[0].text = stdout ? `${stdout_text} \n\n ${result.stdout}` : '';
        } else {
          slackMessage.attachments.splice(0, 1);
        }

        return res.send(slackMessage);
      });
    }
  } catch (_) {
    throw new Error('Failed to setup routes. (check your config file)');
  }
}());

module.exports = routes;

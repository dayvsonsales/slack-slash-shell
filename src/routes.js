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
        provider, name, stderr, stderr_text, stdout, stdout_text, response_type,
      } = paths[i];

      routes.post(`/${encodeURI(name)}`, (_, res) => {
        const result = shelljs.exec(`${provider.path} ${provider.arguments}`);

        const slackMessage = { response_type, attachments: [{ text: '' }] };

        if (result.code !== 0) {
          slackMessage.attachments[0].text = stderr ? `${stderr_text} \n\n ${result.stderr}` : '';
        } else {
          slackMessage.attachments[0].text = stdout ? `${stdout_text} \n\n ${result.stdout}` : '';
        }

        return res.send(slackMessage);
      });
    }
  } catch (_) {
    throw new Error('Failed to setup routes. (check your config file)');
  }
}());

module.exports = routes;

# slack-slash-shell 

This is a simple script that helps you to execute shell scripts via slash commands on Slack.

## How to use

Firstly, edit the `.env.example` file, add your slack signing secret and rename it to `.env`. Then you need to put your commands in `config.json`. This script just read the config file and creates the POST routes dynamically based on config attributes (see the example below). 

Example:

Create a echo test route:

```javascript

"paths": [
    {
        "name": "echo",
        "response_type": "in_channel",
        "provider": {
            "path": "echo",
            "arguments": "test"
        },
        "stdout": true,
        "stdout_text": "Everything ok",
        "stderr": true,
        "stderr_text": "Something went wrong"
    }
]

```

It will create a ``/echo`` POST route that executes an echo command with 'test' as an argument, if command executes successfully a "Everything ok" will be printed, otherwise, a "Something went wrong" will be printed instead. You need to put this as [slash command](https://api.slack.com/interactivity/slash-commands) to use it in your workspace. 


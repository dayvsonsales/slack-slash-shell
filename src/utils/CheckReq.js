const crypto = require('crypto');
const qs = require('qs');

function checkReq(req, res, next) {
  const timestamp = req.headers['x-slack-request-timestamp'];

  if (!timestamp || !req.body) {
    return res.send({
      error: true,
      message: 'Invalid request! (Missing body or timestamp)',
      body: req.body,
      headers: req.headers,
    });
  }

  if (Math.abs(Date.now() / 1000 - timestamp) > 60 * 5) {
    return res.send({
      error: true,
      message: 'Invalid request! (Timestamp error)',
      body: req.body,
      headers: req.headers,
    });
  }

  const slack_signing_secret = process.env.SLACK_SECRET;
  const message = `v0:${timestamp}:${qs.stringify(req.body, { format: 'RFC1738' })}`;
  const hmac = crypto
    .createHmac('sha256', slack_signing_secret)
    .update(message, 'utf8')
    .digest('hex');

  const my_signature = `v0=${hmac}`;

  const slack_signature = req.headers['x-slack-signature'];

  if (
    crypto.timingSafeEqual(
      Buffer.from(my_signature),
      Buffer.from(slack_signature),
    )
  ) {
    return next();
  }

  return res.send({
    error: true,
    message: 'Invalid request! (Not equal signature)',
    body: req.body,
    headers: req.headers,
  });
}

module.exports = checkReq;

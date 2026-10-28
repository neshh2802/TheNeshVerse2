const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = {
  name: 120,
  email: 254,
  topic: 80,
  message: 5000
};

function clean(value, max) {
  return String(value || '').trim().slice(0, max);
}

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.json(payload);
}

module.exports = async function contactHandler(req, res) {
  res.setHeader('Allow', 'POST');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  const body = req.body || {};
  // Honeypot: bots that fill this hidden field receive a neutral success response.
  if (body.website) return json(res, 200, { ok: true });

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email).toLowerCase();
  const topic = clean(body.topic || 'General inquiry', MAX.topic);
  const message = clean(body.message, MAX.message);

  const errors = {};
  if (name.length < 2) errors.name = 'Please provide your name.';
  if (!EMAIL_PATTERN.test(email)) errors.email = 'Please provide a valid email.';
  if (message.length < 10) errors.message = 'Please provide a longer message.';
  if (Object.keys(errors).length) return json(res, 400, { ok: false, errors });

  const to = process.env.CONTACT_TO_EMAIL || 'neshakar.murali10@gmail.com';
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return json(res, 503, {
      ok: false,
      error: 'Contact delivery is not configured yet. Please email neshakar.murali10@gmail.com directly.'
    });
  }

  try {
    const resend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'The Neshverse Contact <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `[The Neshverse] ${topic} — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`
      })
    });

    if (!resend.ok) {
      console.error('Resend rejected contact submission:', await resend.text());
      return json(res, 502, { ok: false, error: 'The message could not be delivered. Please email directly.' });
    }

    return json(res, 200, { ok: true, message: 'Thanks — your message is on its way.' });
  } catch (error) {
    console.error('Contact submission failed:', error);
    return json(res, 500, { ok: false, error: 'The message could not be delivered. Please email directly.' });
  }
};

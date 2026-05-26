// api/trigger.js — sends a motor trigger to OOCSI Dropin_Motor channel

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { motor, value } = req.body || {};

  try {
    // OOCSI requires a named client to send — connect as a virtual client first
    // then send JSON to the channel via the sendjson command over HTTP
    const response = await fetch('https://oocsi.id.tue.nl/send/Dropin_Motor', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        motor: parseInt(motor ?? 0),
        value: parseInt(value ?? 1),
        sender: 'dropin-app'
      })
    });

    const text = await response.text();
    console.log('OOCSI response:', response.status, text);
    return res.status(200).json({ ok: true, oocsiStatus: response.status, response: text });

  } catch (err) {
    console.error('OOCSI error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

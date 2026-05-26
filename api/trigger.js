// api/trigger.js — sends a motor trigger to OOCSI Dropin_Motor channel

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { motor, value } = req.body || {};

  const payload = {
    sender: 'dropin-app',
    motor:  motor ?? 0,
    value:  value ?? 1
  };

  try {
    const response = await fetch('http://oocsi.id.tue.nl/send/Dropin_Motor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    return res.status(200).json({ ok: true, oocsiStatus: response.status, response: text });

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

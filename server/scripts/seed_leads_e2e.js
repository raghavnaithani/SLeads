const fetch = globalThis.fetch;
(async () => {
  try {
    const token = process.env.E2E_TOKEN;
    if (!token) throw new Error('Provide E2E_TOKEN env var');
    const base = 'http://localhost:5000/api/v1';
    for (let i = 1; i <= 11; i++) {
      const name = `E2E Lead ${i}`;
      const email = `e2e.lead${i}+${Date.now()}@example.com`;
      const res = await fetch(`${base}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, source: i % 2 === 0 ? 'instagram' : 'website' }),
      });
      const body = await res.text();
      console.log(i, res.status, body);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

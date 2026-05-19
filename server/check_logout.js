// Use global fetch available in Node 18+
const fetch = globalThis.fetch;
const API = 'http://localhost:5000/api/v1';

async function run() {
  const email = `logouttest${Date.now()}@test.com`;
  const pw = 'Password123!';

  // Register
  let res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Logout Test', email, password: pw }),
  });
  const reg = await res.json();
  console.log('register status', res.status);

  // Login
  res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pw }),
  });
  const login = await res.json();
  console.log('login status', res.status);
  const token = login.data.token;

  // Logout
  res = await fetch(`${API}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  console.log('logout status', res.status);

  // Try protected endpoint
  res = await fetch(`${API}/leads`, { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
  console.log('protected request after logout status', res.status);
  const body = res.headers.get('content-type')?.includes('application/json') ? await res.json() : await res.text();
  console.log('body', body);
}

run().catch(e => { console.error(e); process.exit(1); });

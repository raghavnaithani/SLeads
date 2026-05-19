(async () => {
  try {
    const token = process.env.E2E_TOKEN;
    if (!token) throw new Error('Provide E2E_TOKEN env var');
    const base = 'http://localhost:5000/api/v1/leads';
    for (const p of [1, 2]) {
      const res = await fetch(`${base}?page=${p}&limit=10`, { headers: { Authorization: `Bearer ${token}` } });
      const j = await res.json();
      console.log('page', p, 'status', res.status, 'total', j.pagination?.total, 'page', j.pagination?.page, 'limit', j.pagination?.limit, 'totalPages', j.pagination?.totalPages, 'dataLen', j.data?.length);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

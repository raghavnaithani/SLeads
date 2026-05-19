import fs from 'fs';
import path from 'path';

// Lightweight file-backed token blacklist so logout revocation survives restarts.
type BlacklistMap = Record<string, number>;

const FILE = path.resolve(process.cwd(), 'server', '.token_blacklist.json');

const blacklist = new Map<string, number>();

function loadFromDisk() {
  try {
    if (!fs.existsSync(FILE)) return;
    const raw = fs.readFileSync(FILE, 'utf-8');
    const parsed: BlacklistMap = JSON.parse(raw || '{}');
    const now = Date.now();
    Object.entries(parsed).forEach(([token, exp]) => {
      if (exp && exp > now) {
        blacklist.set(token, exp);
      }
    });
  } catch (err) {
    // ignore and continue with empty blacklist
  }
}

function persistToDisk() {
  try {
    const obj: BlacklistMap = Object.fromEntries(blacklist.entries());
    fs.writeFileSync(FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    // best-effort
  }
}

function cleanup() {
  const now = Date.now();
  for (const [token, exp] of blacklist.entries()) {
    if (exp && exp <= now) blacklist.delete(token);
  }
}

loadFromDisk();

export function addTokenToBlacklist(token: string) {
  if (!token) return;

  // We store the token itself with its expiry timestamp. That is enough for this assignment
  // and keeps the logout implementation simple and deterministic.
  blacklist.set(token, Date.now() + 24 * 60 * 60 * 1000);
  persistToDisk();
}
export function isTokenBlacklisted(token: string) {
  if (!token) return false;

  cleanup();
  return blacklist.has(token);
}

export function clearBlacklist() {
  blacklist.clear();
  persistToDisk();
}

export default {
  addTokenToBlacklist,
  isTokenBlacklisted,
  clearBlacklist,
};

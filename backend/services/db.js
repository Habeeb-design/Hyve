import pg from "pg";

let pool = null;

export async function getDb() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("DATABASE_URL not set — using in-memory storage (data lost on restart)");
      return null;
    }
    pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });
    await initTables();
  }
  return pool;
}

async function initTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vaults (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    )
  `);
  console.log("Database tables initialized");
}

// --- Vault CRUD ---

export async function saveVault(vaultId, vaultData) {
  const db = await getDb();
  if (!db) return;
  await db.query(
    `INSERT INTO vaults (id, data) VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET data = $2`,
    [vaultId, JSON.stringify(vaultData)]
  );
}

export async function loadVault(vaultId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.query("SELECT data FROM vaults WHERE id = $1", [vaultId]);
  return result.rows[0]?.data || null;
}

export async function loadAllVaults() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.query("SELECT id, data FROM vaults ORDER BY created_at");
  return result.rows.map((r) => ({ id: r.id, ...r.data }));
}

// --- Config (rlusdIssuer, etc.) ---

export async function saveConfig(key, value) {
  const db = await getDb();
  if (!db) return;
  await db.query(
    `INSERT INTO config (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2`,
    [key, JSON.stringify(value)]
  );
}

export async function loadConfig(key) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.query("SELECT value FROM config WHERE key = $1", [key]);
  return result.rows[0]?.value || null;
}

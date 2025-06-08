import { Database } from 'better-sqlite3'

export async function upSleepRecords(sqlite: Database) {
  sqlite.exec(`

    CREATE TABLE IF NOT EXISTS sleep_records (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id          INTEGER NOT NULL,
      start_time       TEXT    NOT NULL,
      end_time         TEXT    NOT NULL,
      duration_minutes INTEGER NOT NULL,
      quality          INTEGER NOT NULL DEFAULT 3,
      notes            TEXT,
      created_at       TEXT    NOT NULL,
      updated_at       TEXT    NOT NULL,
	  FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `)
}

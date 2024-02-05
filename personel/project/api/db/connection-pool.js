import pg from "pg";
import camelcaseKeys from "camelcase-keys";

export const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
});

export async function queryNormalized(...args) {
    const result = await pool.query(...args);
    return camelcaseKeys(result.rows);
}
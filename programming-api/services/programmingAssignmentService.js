import { sql } from "../database/database.js";

const find = async (id) => {
  return await sql`
    SELECT * 
    FROM programming_assignments
    WHERE id = ${id};
  `;
};

const findAll = async () => {
  return await sql`SELECT * FROM programming_assignments;`;
};

const findRandom = async () => {
  return await sql`SELECT * FROM programming_assignments ORDER BY RANDOM() LIMIT 1;`;
};

const findSpecific = async (id) => {
  return await sql`SELECT * FROM programming_assignments WHERE id = ${id};`;
};

export { find, findAll, findRandom, findSpecific };

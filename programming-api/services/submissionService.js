import { sql } from "../database/database.js";

const findAll = async () => {
  return await sql`SELECT * FROM programming_assignment_submissions;`;
};

// Todo get real values and check if user have already submission to specific exercise with same code
const addNewSubmission = async () => {
  const programming_assignment_id = 1;
  const code = 'def hello():\n\treturn "Hello"';
  const user_uuid = "123";
  const grader_feedback = "correct";
  const correct = false;

  try {
    const result = await sql`
        INSERT INTO programming_assignment_submissions 
        (programming_assignment_id, code, user_uuid, grader_feedback, correct) 
        VALUES (${programming_assignment_id}, ${code}, ${user_uuid}, ${grader_feedback}, ${correct})
        RETURNING *;
    `;
    console.log("New submission added successfully:", result.rows[0]);
  } catch (error) {
    console.error("Error adding new submission:", error.message);
  }
};

export { findAll, addNewSubmission };

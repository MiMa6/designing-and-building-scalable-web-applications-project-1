import { sql } from "../database/database.js";

const findAll = async () => {
  return await sql`SELECT * FROM programming_assignment_submissions;`;
};

const addNewSubmission = async ({
  programming_assignment_id,
  code,
  user_uuid,
  grader_feedback,
  correct,
}) => {
  // TODO: check if user have already submission to specific exercise with same code

  try {
    await sql`
        INSERT INTO programming_assignment_submissions 
        (programming_assignment_id, code, user_uuid, grader_feedback, correct) 
        VALUES (${programming_assignment_id}, ${code}, ${user_uuid}, ${grader_feedback}, ${correct})
    `;
    console.log("New submission added successfully:");
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error adding new submission:", error.message);
    return new Response("err", { status: 400 });
  }
};

export { findAll, addNewSubmission };

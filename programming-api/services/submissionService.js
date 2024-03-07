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


const addNewSubmissionCopy = async ({
  programming_assignment_id,
  code,
  user_uuid,
  grader_feedback,
  correct,
}) => {
  try {
    await sql`
      WITH latest_submissions AS (
        SELECT 
          grader_feedback,
          correct,
          ROW_NUMBER() OVER (PARTITION BY user_uuid, code, programming_assignment_id ORDER BY last_updated DESC) as rn
        FROM programming_assignment_submissions
        WHERE user_uuid = ${user_uuid} AND code = ${code} AND programming_assignment_id = ${programming_assignment_id}
      )

      INSERT INTO programming_assignment_submissions 
      (programming_assignment_id, code, user_uuid, grader_feedback, correct) 
      SELECT 
        ${programming_assignment_id}, 
        ${code}, 
        ${user_uuid}, 
        grader_feedback, 
        correct
      FROM latest_submissions
      WHERE rn = 1;
    `;

    console.log("New submission added successfully:");
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error adding new submission:", error.message);
    return new Response("err", { status: 400 });
  }
};

const checkSubmission = async ({
  programming_assignment_id,
  code,
  user_uuid,
}) => {
  try {
    const result = await sql`
      SELECT * FROM programming_assignment_submissions 
      WHERE programming_assignment_id = ${programming_assignment_id} 
      AND code = ${code} 
      AND user_uuid = ${user_uuid};
    `;

    if (result.length > 0) {
      console.log("Submission already exists");
      return new Response(
        JSON.stringify({ message: "Submission already exists" }),
        { status: 200 }
      );
    } else {
      // TODO: change 404 to 200 and use other logic to see in component response status
      console.log("Submission does not exists");
      return new Response(
        JSON.stringify({ message: "Submission does not exists" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error checking submission:", error.message);
    return new Response("err", { status: 400 });
  }
};

const updateSubmissions = async ({
  programming_assignment_id,
  code,
  user_uuid,
  grader_feedback,
  correct,
}) => {
  try {
    await sql`
      UPDATE programming_assignment_submissions 
      SET grader_feedback = ${grader_feedback}, correct = ${correct} 
      WHERE programming_assignment_id = ${programming_assignment_id} 
      AND code = ${code} 
      AND user_uuid = ${user_uuid};
    `;
    console.log("Submission updated successfully");
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error updating submission:", error.message);
    return new Response("err", { status: 400 });
  }
};

export { findAll, addNewSubmission, addNewSubmissionCopy, checkSubmission, updateSubmissions };

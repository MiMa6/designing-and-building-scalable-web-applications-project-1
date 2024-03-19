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

const checkIfSubmissionExists = async ({
  programming_assignment_id,
  code,
  user_uuid,
}) => {
  
  try {
    const result = await sql`
      SELECT *
      FROM programming_assignment_submissions 
      WHERE programming_assignment_id = ${programming_assignment_id} 
      AND code = ${code} 
      AND user_uuid = ${user_uuid}
      ORDER BY last_updated DESC;
    `;

    if (result.length > 0) {
      console.log("Submission already exists");
      return new Response(
        JSON.stringify({
          status: 200,
          data: result[0],
        })
      );
    } else {
      // TODO: change 404 to 200 and use other logic to see in component response status
      console.log("Submission does not exists");
      return new Response(
        JSON.stringify({
          status: 400,
          data: "Submission does not exist",
        })
      );
    }
  } catch (error) {
    console.error("Error checking submission:", error.message);
    return new Response("err", { status: 400 });
  }
};

const checkSubmissionStatus = async (eventData) => {
  const data = JSON.parse(eventData);
  try {
    const result = await sql`
      SELECT status, grader_feedback, correct
      FROM programming_assignment_submissions
      WHERE programming_assignment_id = ${data.programming_assignment_id} 
      AND code = ${data.code} 
      AND user_uuid = ${data.user_uuid}
      ORDER BY last_updated DESC;
    `;
    console.log("Submission status checked successfully");
    console.log(result);
    if (result.length > 0) {
      return result[0];
    } else {
      return "no submissions";
    }
  } catch (error) {
    console.error("Error checking submission status:", error.message);
    return "error";
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

const fetchPoints = async ({ user_uuid }) => {
  console.log("Fetching points");
  try {
    const result = await sql`
    WITH correctassignment AS (
      SELECT DISTINCT programming_assignment_id
      FROM programming_assignment_submissions
      WHERE user_uuid = ${user_uuid}
      AND correct = true
    )
    
    SELECT COUNT(*) as points
    FROM correctassignment;
    `;

    return new Response(
      JSON.stringify({
        status: 200,
        data: result[0].points,
      })
    );
  } catch (error) {
    console.error("Error fetching points:", error.message);
    return new Response("err", { status: 400 });
  }
};

export {
  findAll,
  addNewSubmission,
  addNewSubmissionCopy,
  checkIfSubmissionExists,
  checkSubmissionStatus,
  updateSubmissions,
  fetchPoints,
};

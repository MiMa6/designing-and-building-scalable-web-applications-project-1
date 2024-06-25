import { sql } from "../database/database.js";

const findAll = async () => {
  return await sql`SELECT * FROM programming_assignment_submissions;`;
};

const addNewSubmission = async ({
  programming_assignment_id,
  code,
  user_uuid,
  graderFeedback,
}) => {
  try {
    await sql`
        INSERT INTO programming_assignment_submissions 
        (programming_assignment_id, code, user_uuid, grader_feedback) 
        VALUES (${programming_assignment_id}, ${code}, ${user_uuid}, ${graderFeedback})
    `;
    console.log("New submission added successfully:");

    const result = await sql`
      SELECT *
      FROM programming_assignment_submissions 
      WHERE programming_assignment_id = ${programming_assignment_id} 
      AND code = ${code} 
      AND user_uuid = ${user_uuid}
      ORDER BY last_updated DESC;
    `;
    console.log(result[0]);
    return new Response(JSON.stringify(result[0]), { status: 200 });
  } catch (error) {
    console.error("Error adding new submission:", error.message);
    return new Response("err", { status: 400 });
  }
};

const findSubmissionById = async (submissionID) => {
  try {
    const result = await sql`
      SELECT *
      FROM programming_assignment_submissions 
      WHERE id = ${submissionID};
    `;

    return new Response(JSON.stringify(result[0]), { status: 200 });
  } catch (error) {
    console.error("Error fetching submission:", error.message);
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
      AND grader_feedback != ''
      ORDER BY last_updated DESC;
    `;

    if (result.length > 0) {
      console.log("Submission already exists");
      return new Response(
        JSON.stringify({
          status: 200,
          data: true,
        })
      );
    } else {
      // TODO: change 404 to 200 and use other logic to see in component response status
      console.log("Submission with graderfeedback does not exixst");
      return new Response(
        JSON.stringify({
          status: 400,
          data: false,
        })
      );
    }
  } catch (error) {
    console.error("Error checking submission:", error.message);
    return new Response("err", { status: 400 });
  }
};

const findLegacyGradingValues = async ({
  programming_assignment_id,
  code,
  user_uuid,
  submissionId,
}) => {
  try {
    const result = await sql`
      WITH latest_submissions_with_grader_feedback AS (
        SELECT 
          grader_feedback,
          correct,
          ROW_NUMBER() OVER (PARTITION BY user_uuid, code, programming_assignment_id ORDER BY last_updated DESC) as rn
        FROM programming_assignment_submissions
        WHERE user_uuid = ${user_uuid} 
        AND code = ${code} 
        AND programming_assignment_id = ${programming_assignment_id} 
        AND grader_feedback != ''
      )

      SELECT * 
      FROM latest_submissions_with_grader_feedback
      WHERE rn = 1;
    `;

    console.log("Legacy submission grading values copied succesfully");
    console.log(result[0]);
    return new Response(JSON.stringify(result[0]), { status: 200 });
  } catch (error) {
    console.error("Error copying grading values:", error.message);
    return new Response("err", { status: 400 });
  }
};

const updateSubmission = async ({
  grader_feedback,
  correct,
  submissionID,
  status,
}) => {
  console.log("update sub service");
  console.log(status);
  try {
    await sql`
      UPDATE programming_assignment_submissions 
      SET grader_feedback = ${grader_feedback}, correct = ${correct}, status = ${status}
      WHERE id = ${submissionID};
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
  findSubmissionById,
  checkIfSubmissionExists,
  findLegacyGradingValues,
  updateSubmission,
  fetchPoints,
};

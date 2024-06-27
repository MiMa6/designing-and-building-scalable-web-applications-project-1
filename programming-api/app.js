import * as programmingAssignmentService from "./services/programmingAssignmentService.js";
import * as submissionService from "./services/submissionService.js";
import { serve } from "./deps.js";
import { cacheMethodCalls } from "./util/cacheUtil.js";

const cachedprogrammingAssignmentService = cacheMethodCalls(programmingAssignmentService, [
  "find",
  "findAll",
  "findSpecific",
]);

const handleGetRoot = async (request) => {
  return new Response(`Hello from programmin API server`);
};

const handleGetAllAssignmentsRequest = async (request) => {
  const programmingAssignments = await cachedprogrammingAssignmentService.findAll();

  return new Response(JSON.stringify(programmingAssignments), {
    headers: { "content-type": "application/json" },
  });
};

const handleFechAssignmentByIdRequest = async (request) => {
  const requestData = await request.json();
  const assignmentId = requestData.assignmentId;

  console.log("assignmentId");
  console.log(assignmentId);

  const programmingAssignments = await cachedprogrammingAssignmentService.find(
    assignmentId
  );

  return new Response(JSON.stringify(programmingAssignments), {
    headers: { "content-type": "application/json" },
  });
};

const handleGetAllSubmissionsRequest = async (request) => {
  console.log("handleGetAllSubmissionsRequest");

  const submissions = await submissionService.findAll();

  return new Response(JSON.stringify(submissions), {
    headers: { "content-type": "application/json" },
  });
};

const handlePostGraderRequest = async (request) => {
  const requestData = await request.json();
  const assignmentId = requestData.programming_assignment_id;

  const programmingAssignments =
    await cachedprogrammingAssignmentService.findSpecific(assignmentId);

  console.log(programmingAssignments);

  const testCode = programmingAssignments[0]["test_code"];

  const data = {
    testCode: testCode,

    code: requestData.code,
  };

  try {
    const response = await fetch("http://grader-api:7000/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    console.error("Error in grader-image:", error.message);

    return new Response("err", { status: 400 });
  }
};

const handlePollSubmissionById = async (request) => {
  const requestData = await request.json();
  const submissionId = requestData.submissionId;

  const response = await submissionService.findSubmissionById(submissionId);
  return response;
};

const handlePostSubmissionNewRequest = async (request) => {
  const requestData = await request.json();

  const submissionData = {
    programming_assignment_id: requestData.programming_assignment_id,
    code: requestData.code,
    user_uuid: requestData.user_uuid,
    graderFeedback: requestData.graderFeedback,
  };

  console.log(submissionData);
  const response = await submissionService.addNewSubmission(submissionData);

  return response;
};

const handlePostSubmissionCheckRequest = async (request) => {
  const requestData = await request.json();

  const submissionData = {
    programming_assignment_id: requestData.programming_assignment_id,
    code: requestData.code,
    user_uuid: requestData.user_uuid,
  };

  console.log(submissionData);

  const response = await submissionService.checkIfSubmissionExists(
    submissionData
  );

  return response;
};
const handlePostSubmissionCopyLegacyGradingRequest = async (request) => {
  const requestData = await request.json();

  const submissionData = {
    programming_assignment_id: requestData.programming_assignment_id,
    code: requestData.code,
    user_uuid: requestData.user_uuid,
  };

  console.log(submissionData);
  const response = await submissionService.findLegacyGradingValues(
    submissionData
  );

  console.log("handlePostSubmissionCopyRequest");
  console.log(response);
  return response;
};

const handlePostSubmissionUpdateRequest = async (request) => {
  const requestData = await request.json();

  const updatedSubmissionData = {
    programming_assignment_id: requestData.programming_assignment_id,
    code: requestData.code,
    submissionID: requestData.submissionId,
    user_uuid: requestData.user_uuid,
    grader_feedback: requestData.grader_feedback,
    correct: requestData.correct,
    status: requestData.status,
  };

  console.log("updatedSubmissionData");
  console.log(updatedSubmissionData);

  const response = await submissionService.updateSubmission(
    updatedSubmissionData
  );

  return response;
};

const handleFetchCorrectAssignmentIdsRequest = async (request) => {
  const requestData = await request.json();
  const userData = { user_uuid: requestData.user_uuid };
  const response = await submissionService.fetchCorrectAssignmentIds(userData);

  return response;
};

const handleGetCorrectssignmenstRequest = async (request) => {
  const requestData = await request.json();
  const userData = { user_uuid: requestData.user_uuid };
  const response = await submissionService.fetchCorrectAssignements(userData);

  return response;
};

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    fn: handleGetRoot,
  },
  // Grade related patterns
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/grade" }),
    fn: handlePostGraderRequest,
  },
  // Assignment related patterns
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/assignment" }),
    fn: handleFechAssignmentByIdRequest,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/assignments" }),
    fn: handleGetAllAssignmentsRequest,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/assignments/correct" }),
    fn: handleFetchCorrectAssignmentIdsRequest,
  },
  // Submission related patterns
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/submissions" }),
    fn: handleGetAllSubmissionsRequest,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/submissions/new" }),
    fn: handlePostSubmissionNewRequest,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/submissions/poll" }),
    fn: handlePollSubmissionById,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/submissions/check" }),
    fn: handlePostSubmissionCheckRequest,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/submissions/copy" }),
    fn: handlePostSubmissionCopyLegacyGradingRequest,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/submissions/update" }),
    fn: handlePostSubmissionUpdateRequest,
  },
];

const handleRequest = async (request) => {
  console.log(request.method, request.url);

  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);

  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);

    return new Response(e.stack, { status: 500 });
  }
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };

serve(handleRequest, portConfig);

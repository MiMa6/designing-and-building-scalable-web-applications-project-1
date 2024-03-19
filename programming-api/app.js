import * as programmingAssignmentService from "./services/programmingAssignmentService.js";
import * as submissionService from "./services/submissionService.js";
import { serve } from "./deps.js";
import { sql } from "./database/database.js";

const sockets = new Set();

const sendMessage = (event) => {
  sockets.forEach((socket) => socket.send(event.data));
};

const handleSocketRequest = async (request) => {
  const { socket, response } = Deno.upgradeWebSocket(request);

  socket.onmessage = async (event) => {
    console.log("message event data");
    console.log(event.data);
    const submissionStatus = await submissionService.checkSubmissionStatus(
      event.data
    );
    const data = JSON.stringify(submissionStatus);
    socket.send(data);
  };

  return response;
};

const handleGetRoot = async (request) => {
  return new Response(`Hello from programmin API server`);
};

const handleGetAllAssignmentsRequest = async (request) => {
  const programmingAssignments = await programmingAssignmentService.findAll();

  return new Response(JSON.stringify(programmingAssignments), {
    headers: { "content-type": "application/json" },
  });
};

const handlePostAssignmensRequest = async (request) => {
  const requestData = await request.json();
  const assignmentId = requestData.assignmentId;

  console.log("assignmentId");
  console.log(assignmentId);

  const programmingAssignments = await programmingAssignmentService.find(
    assignmentId
  );

  return new Response(JSON.stringify(programmingAssignments), {
    headers: { "content-type": "application/json" },
  });
};

const handleGetRandomAssignmentRequest = async (request) => {
  const programmingAssignments =
    await programmingAssignmentService.findRandom();

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

const handlePostAssignmentRequest = async (request) => {
  const requestData = await request.json();
  const assignmentId = requestData.programming_assignment_id;

  const programmingAssignments =
    await programmingAssignmentService.findSpecific(assignmentId);

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

const handlePostSubmissionNewRequest = async (request) => {
  const requestData = await request.json();

  const submissionData = {
    programming_assignment_id: requestData.programming_assignment_id,
    code: requestData.code,
    user_uuid: requestData.user_uuid,
    grader_feedback: requestData.grader_feedback,
    correct: requestData.correct,
    status: requestData.status,
  };

  console.log(submissionData);
  const response = await submissionService.addNewSubmission(submissionData);

  return response;
};

const handlePostSubmissionCopyRequest = async (request) => {
  console.log("handlePostSubmissionCopyRequest");

  const requestData = await request.json();

  const submissionData = {
    programming_assignment_id: requestData.programming_assignment_id,
    code: requestData.code,
    user_uuid: requestData.user_uuid,
  };

  console.log(submissionData);
  const response = await submissionService.addNewSubmissionCopy(submissionData);

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

// TODO delete when not needded anymore

const handlePostSubmissionUpdateRequest = async (request) => {
  const requestData = await request.json();

  const updatedSubmissionData = {
    programming_assignment_id: requestData.programming_assignment_id,
    code: requestData.code,
    user_uuid: requestData.user_uuid,
    grader_feedback: requestData.grader_feedback,
    correct: requestData.correct,
  };

  const response = await submissionService.updateSubmission(
    updatedSubmissionData
  );

  return response;
};

const handlePostUserPointsRequest = async (request) => {
  const requestData = await request.json();
  const userData = { user_uuid: requestData.user_uuid };
  const response = await submissionService.fetchPoints(userData);
  console.log("response.data");

  return response;
};

// TODO: Update submission related requests to start with /submission, e.g. /submission/check

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    fn: handleGetRoot,
  },

  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/ws" }),
    fn: handleSocketRequest,
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/assignment" }),
    fn: handlePostAssignmensRequest,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/assignments" }),
    fn: handleGetAllAssignmentsRequest,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/assignments/random" }),
    fn: handleGetRandomAssignmentRequest,
  },

  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/submissions" }),
    fn: handleGetAllSubmissionsRequest,
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/grade" }),
    fn: handlePostAssignmentRequest,
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/submissions/new" }),
    fn: handlePostSubmissionNewRequest,
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/submissions/copy" }),
    fn: handlePostSubmissionCopyRequest,
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/check" }),
    fn: handlePostSubmissionCheckRequest,
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/update" }),
    fn: handlePostSubmissionUpdateRequest,
  },

  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/points" }),
    fn: handlePostUserPointsRequest,
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

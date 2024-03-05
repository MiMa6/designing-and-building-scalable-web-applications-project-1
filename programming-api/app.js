import * as programmingAssignmentService from "./services/programmingAssignmentService.js";
import * as submissionService from "./services/submissionService.js";
import { serve } from "./deps.js";
import { sql } from "./database/database.js";

const handleGetRoot = async (request) => {
  return new Response(`Hello from programmin API server`);
};

const handleGetAllAssignmentsRequest = async (request) => {
  const programmingAssignments = await programmingAssignmentService.findAll();
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
  const submissions = await submissionService.findAll();
  return new Response(JSON.stringify(submissions), {
    headers: { "content-type": "application/json" },
  });
};

const handlePostAssignmentRequest = async (request) => {
  const requestData = await request.json();
  const assignmentId = requestData.id;

  const programmingAssignments =
    await programmingAssignmentService.findSpecific(assignmentId);

  console.log(programmingAssignments);
  const testCode = programmingAssignments[0]["test_code"];
  const data = {
    testCode: testCode,
    code: requestData.code,
  };

  const response = await fetch("http://grader-api:7000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};

const handlePostSubmissionRequest = async (request) => {
  console.log("Post Submission")
  await submissionService.addNewSubmission();
};

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    fn: handleGetRoot,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/assignments" }),
    fn: handleGetAllAssignmentsRequest,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/assignment" }),
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
    pattern: new URLPattern({ pathname: "/submissions" }),
    fn: handlePostSubmissionRequest,
  },
];

const handleRequest = async (request) => {
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

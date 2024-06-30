import http from "k6/http";

export const options = {
  duration: "10s",
  vus: 10,
};

export default function () {
  const submissionData = {
    programming_assignment_id: 1,
    code: "Testing Testing Testing",
    user_uuid: "0987654321",
    graderFeedback: "",
  };

  http.post(
    "http://localhost:7800/api/submissions/new",
    JSON.stringify(submissionData)
  );
}

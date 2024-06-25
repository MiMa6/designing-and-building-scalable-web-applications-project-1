<script>
  import { userUuid } from "../stores/stores.js";
  import { assignment } from "../stores/assignmentStore.js";
  import { textAreaValue } from "../stores/textAreaStore.js";
  import { totalPoints } from "../stores/scoreStore.js";
  import { onMount } from "svelte";
  import Handout from "./Handout.svelte";

  let submissionStatus = "";
  let graderFeedback = "";
  let correctAnswer = "";

  const clearnErrorMessage = (errorMessage) => {
    const lines = errorMessage.split("\n");
    let lastLine = lines[lines.length - 1];
    lastLine = lastLine.trim();
    const words = lastLine.split(" ");
    const firstWord = words[0];
    const firstWordClean = firstWord.replace(":", "").replace(/[\n\t]/g, "");
    return firstWordClean;
  };

  const createSubmission = async () => {
    submissionStatus = "pending";
    graderFeedback = "";
    correctAnswer = "";
    
    let data = {
      programming_assignment_id: $assignment.id,
      code: $textAreaValue,
      user_uuid: $userUuid,
      graderFeedback: graderFeedback,
    };

    console.log("Post submission code");
    const response = await fetch("/api/submissions/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseDataSubmission = await response.json();
    console.log(responseDataSubmission);

    const dataUpdated = { ...data, submissionId: responseDataSubmission.id };

    console.log("Poll submission status every 2 seconds...");
    console.log(responseDataSubmission.id);
    pollSubmissionStatus(responseDataSubmission.id);

    
    console.log("Check if submission already exists...");
    const ifSubmissionExistsResponseData =
      await checkIfSubmissionExists(dataUpdated);

    const dataGrading = {
      programming_assignment_id: $assignment.id,
      code: $textAreaValue,
      user_uuid: $userUuid,
      submissionId: responseDataSubmission.id,
    };
    if (ifSubmissionExistsResponseData.data == true) {
      console.log(
        "Submission already exists, copy latest grader feedback values..."
      );

      const legacyGradingValues = await copyLegacyGrading(dataGrading);
    } else {
      console.log("Submission does not exists, lets do grading...");
      await doGrading(dataGrading);
    }
  };

  async function pollSubmissionStatus(submissionId) {
    const interval = setInterval(async () => {
      let data = {
        submissionId: submissionId,
      };

      const response = await fetch("/api/submissions/poll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      console.log(`Submission status: ${responseData.status}`);
      submissionStatus = responseData.status;

      if (responseData.status === "processed") {
        graderFeedback = responseData.grader_feedback;
        correctAnswer = responseData.correct;
        fetchTotalPoints();
        clearInterval(interval);
      }
    }, 2000);
  }

  async function checkIfSubmissionExists(data) {
    const response = await fetch("/api/submissions/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log("check");
    console.log(responseData);

    return responseData;
  }

  const copyLegacyGrading = async (data) => {
    console.log("copy legacy grading values...");

    const response = await fetch("/api/submissions/copy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log("copy values");
    console.log(responseData.correct);
    console.log(responseData.grader_feedback);

    updateSubmission({
      ...data,
      grader_feedback: responseData.grader_feedback,
      correct: responseData.correct,
      status: "processed",
    });
    return responseData;
  };

  const doGrading = async (dataForGrading) => {
    console.log("Sent data to grader:");
    const response = await fetch("/api/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForGrading),
    });
    console.log("Done grading");

    const graderResponseData = await response.json();
    const errorType = clearnErrorMessage(graderResponseData.result);

    graderFeedback = graderResponseData.result;
    console.log(`errorType ${errorType}`);

    if (errorType === "OK") {
      console.log("errortype == OK, answer correct, update submission...");
      updateSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: true,
        status: "processed",
      });
    } else {
      console.log("errortype != OK, answer false, update submission...");
      updateSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: false,
        status: "processed",
      });
    }
  };

  const updateSubmission = async (data) => {
    console.log("Updating submission");
    const response = await fetch("/api/submissions/update", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response);
  };

  const fetchTotalPoints = async () => {
    const data = {
      user_uuid: $userUuid,
    };

    const response = await fetch("/api/points", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData);
    totalPoints.set(responseData.data);
  };

  onMount(fetchTotalPoints);
</script>

<div class="w-full md:w-1/2 py-5 px-10">
  <div class="prosess">
    <p>
      Submission status: <span class="text-green-500">{submissionStatus}</span>
    </p>
    <p>
      Grader feedback: <span class="text-green-500">{graderFeedback}</span>
    </p>
    <p>Correct: <span class="text-green-500">{correctAnswer}</span></p>
    <p class="text-lg text-slate-500 font-medium text-center">
      Total points: {$totalPoints * 100}
    </p>
  </div>
</div>
<div class="flex justify-between mt-2"></div>

<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  on:click={createSubmission}
>
  Grading
</button>

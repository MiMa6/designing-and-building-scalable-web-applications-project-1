<script>
  import { userUuid } from "../stores/stores.js";
  import { assignment } from "../stores/assignmentStore.js";
  import { textAreaValue } from "../stores/textAreaStore.js";
  import { totalPoints } from "../stores/scoreStore.js";
  import { queue, currentSubmission } from "../stores/queueStore.js";

  import { onMount } from "svelte";

  let submissionStatus = "";
  let graderFeedback = "";
  let correctAnswer = "";
  let isProcessing = false;

  const clearnErrorMessage = (errorMessage) => {
    const lines = errorMessage.split("\n");
    let lastLine = lines[lines.length - 1];
    lastLine = lastLine.trim();
    const words = lastLine.split(" ");
    const firstWord = words[0];
    const firstWordClean = firstWord.replace(":", "").replace(/[\n\t]/g, "");
    return firstWordClean;
  };

  function addToQueue() {
    let submissionData = {
      programming_assignment_id: $assignment.id,
      code: $textAreaValue,
      user_uuid: $userUuid,
      graderFeedback: graderFeedback,
    };

    queue.update((q) => [...q, submissionData]);
    processQueue();
  }

  async function processQueue() {
    if (isProcessing) return;

    queue.subscribe(async (q) => {
      if (q.length > 0 && !isProcessing) {
        isProcessing = true;
        const submission = q[0];
        currentSubmission.set(submission);
        await createSubmission(currentSubmission);

        isProcessing = false;
        queue.update((q) => q.slice(1));
        currentSubmission.set(null);
        processQueue();
      }
    });
  }

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
    console.log(dataForGrading)
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

      console.log("add assignment id to completed list...");
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

    const response = await fetch("/api/assignments/correct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData.data);
    totalPoints.set(responseData.data.length);
  };

  onMount(fetchTotalPoints);
  onMount(() => {
    processQueue();
  });
</script>

<div
  class="w-full md:w-2/3 mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
>
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
    <h2 class="text-2xl font-bold text-white text-center">Submission Status</h2>
  </div>

  <div class="p-6">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-gray-700 font-semibold">Status:</p>
        <span
          type="submission-status"
          class={`px-3 py-1 rounded-full text-sm font-medium ${
            submissionStatus === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {submissionStatus}
        </span>
      </div>

      <div class="space-y-2">
        <p class="text-gray-700 font-semibold">Grader Feedback:</p>
        <p
          type="grader-feedback"
          class="text-gray-600 bg-gray-50 p-3 rounded-md"
        >
          {graderFeedback || "No feedback yet"}
        </p>
      </div>

      <div class="flex items-center justify-between">
        <p class="text-gray-700 font-semibold">Correct:</p>
        <span
          type="is-correct"
          class={`px-3 py-1 rounded-full text-sm font-medium ${
            correctAnswer === false
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {correctAnswer !== null ? (correctAnswer ? "Yes" : "No") : "N/A"}
        </span>
      </div>
    </div>
  </div>

  <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
    <button
      type="submitButton"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      on:click={addToQueue}
    >
      Submit for Grading
    </button>
  </div>
</div>

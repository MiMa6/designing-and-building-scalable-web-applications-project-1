<script>
  import { userUuid } from "../stores/stores.js";
  import { assignment } from "../stores/assignmentStore.js";
  import { textAreaValue } from "../stores/textAreaStore.js";

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

  const doGrading = async (dataForGrading) => {
    console.log("Sent data to grader: \n" + dataForGrading.code);

    const response = await fetch("/api/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForGrading),
    });

    const graderResponseData = await response.json();
    const errorType = clearnErrorMessage(graderResponseData.result);

    graderFeedback = graderResponseData.result;
    (submissionStatus = "processed"), console.log(`errorType ${errorType}`);

    if (errorType === "OK") {
      console.log("errortype ok, creating new sub");
      postSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: true,
        status: "processed",
      });
      correctAnswer = true;
      alert("Your Answer Was Correct\n Well done!");
    } else if (errorType === "FAILED") {
      postSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: false,
        status: "processed",
      });
      correctAnswer = false;
      alert(graderResponseData.result);
    } else if (errorType === "SyntaxError") {
      postSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: false,
        status: "processed",
      });
      correctAnswer = true;
      alert(graderResponseData.result);
    } else {
      postSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: false,
        status: "processed",
      });
      correctAnswer = true;
      console.log("Other error");

      submissionStatus = "";
      graderFeedback = responseData.data.grader_feedback;
      correctAnswer = "";
      alert(graderResponseData.result);
    }
    console.log("Done");
  };

  const checkSubmission = async () => {
    submissionStatus = "pending";
    let data = {
      programming_assignment_id: $assignment.id,
      code: $textAreaValue,
      user_uuid: $userUuid,
    };

    console.log("Check if existing submission in db");

    const response = await fetch("/api/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    if (responseData.status === 200) {
      console.log(
        "Submission already exists, copy latest grader feedback values..."
      );

      const response2 = await fetch("/api/submissions/copy", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (responseData.data.status) {
        submissionStatus = responseData.data.status;
        graderFeedback = responseData.data.grader_feedback;
        correctAnswer = responseData.data.correct;
      }

      console.log("New submission created");
      submissionStatus = "processed";

      graderFeedback = responseData.data.grader_feedback;
      alert(responseData.data.grader_feedback);
    } else if (responseData.status === 400) {
      console.log("Submission does not exists");
      doGrading(data);
      submissionStatus = "processed";
    } else {
      submissionStatus = "processed";
      console.log("Error in checking submission");
      alert("Error in checking submission");
    }
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
  };

  const postSubmission = async (dataForNewSubmission) => {
    const response = await fetch("/api/submissions/new", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForNewSubmission),
    });

    console.log("New submission created");
    console.log(response);

    console.log("Fetching total points for userUuid");
    fetchTotalPoints();
  };
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
  </div>
</div>
<div class="flex justify-between mt-2"></div>

<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  on:click={checkSubmission}
>
  Grading
</button>

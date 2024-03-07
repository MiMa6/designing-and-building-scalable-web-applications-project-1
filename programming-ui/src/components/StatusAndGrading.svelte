<script>
  import { userUuid } from "../stores/stores.js";
  import { graderData } from "../stores/graderStore.js";
  import { assignment } from "../stores/assignmentStore.js";
  import { textAreaValue } from "../stores/textAreaStore.js";

  const clearnErrorMessage = (errorMessage) => {
    const lines = errorMessage.split("\n");
    let lastLine = lines[lines.length - 1];
    lastLine = lastLine.trim();
    const words = lastLine.split(" ");
    const firstWord = words[0];
    const firstWordClean = firstWord.replace(":", "").replace(/[\n\t]/g, "");
    return firstWordClean;
  };

  // TODO bidirectional communication
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
    console.log(`errorType ${errorType}`);
    // alert(JSON.stringify(jsonData));

    if (errorType === "OK") {
      console.log("errortype ok, creating new sub");
      postSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: true,
      });
    } else if (errorType === "FAILED") {
      postSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: false,
      });
    } else if (errorType === "SyntaxError") {
      postSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: false,
      });
    } else {
      postSubmission({
        ...dataForGrading,
        grader_feedback: graderResponseData.result,
        correct: false,
      });
      console.log("Infinite loop");
    }
    console.log("Done");
  };

  const checkSubmission = async () => {
    // TODO: change submission status to "processing" and create submission Store
    const data = {
      programming_assignment_id: $assignment.id,
      code: $textAreaValue,
      user_uuid: $userUuid,
    };

    console.log("Check if existing submission in db");

    // TOdo if exists save valut to response
    const response = await fetch("/api/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response;
    console.log(responseData);

    if (responseData.status === 200) {

      console.log("Submission already exists, copy values...");

      // TODO instead of updating copy values from db to new submissio
      const response = await fetch("/api/submissions/copy", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response from new submission");
    console.log(response);
    console.log("New submission created");

      //const responseData = await response;
      //console.log(responseData);
    } else if (responseData.status === 404) {
      // TODO: create submission
      doGrading(data);
      // TODO: update submission
    } else {
      console.log("Error in checking submission");
    }
  };

  // TODO correct values to dataSubmission
  const postSubmission = async (dataForNewSubmission) => {

    const response = await fetch("/api/submissions/new", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForNewSubmission),
    });

    console.log("Response from new submission");
    console.log(response);
    console.log("New submission created");
  };

  // TODO: Combine buttons to single grading button but save logic for submissions in same file
  // Rename file to grading
</script>

<div class="w-full md:w-1/2">
  <h2 class="text-2xl font-bold mb-4">Submission Status</h2>
  <div class="prose">
    <p>Submission status: <span class="text-green-500">Processed</span></p>
    <p>Grader feedback: <span class="text-green-500">Well done</span></p>
    <p>Correct: <span class="text-green-500">Yes</span></p>
  </div>
</div>
<div class="flex justify-between mt-2"></div>

<button
  class="bg-green-500 hover:bg-brown-700 text-white font-bold p-4 rounded m-4"
  on:click={doGrading}
>
  Do grading!
</button>

<button
  class="bg-red-500 hover:bg-brown-700 text-white font-bold p-4 rounded m-4"
  on:click={checkSubmission}
>
  Check existing Sub
</button>

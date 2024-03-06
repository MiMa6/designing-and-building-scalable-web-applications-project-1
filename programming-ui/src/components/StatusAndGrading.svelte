<script>
  import { userUuid } from "../stores/stores.js";
  import { assignment } from "../stores/assignmentStore.js";
  import {textAreaValue} from "../stores/textAreaStore.js";
  
  // Sends code written to textare to grader API
  const doGrading = async () => {
    const data = {
      user: $userUuid,
      // code: `def hello(): return "Hello"`,
      code: $textAreaValue,
      id: $assignment.id,
    };

    console.log("Sent data to grader: \n" + data.code);

    const response = await fetch("/api/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonData = await response.json();
    console.log(jsonData);
    alert(JSON.stringify(jsonData));
  };
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

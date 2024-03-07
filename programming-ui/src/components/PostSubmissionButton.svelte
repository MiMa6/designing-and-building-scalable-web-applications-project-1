<script>
  import { assignment } from "../stores/assignmentStore.js";
  import { textAreaValue } from "../stores/textAreaStore.js";
  import { userUuid } from "../stores/stores.js";
  
  const postSubmission = async () => {

    const dataBefore = {
      programming_assignment_id: $assignment.id,
      code: $textAreaValue,
      user_uuid: $userUuid,
      grader_feedback: "",
      correct: false,
    }
 
    const response = await fetch("/api/submissions", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataBefore),
    });

    console.log("Response from check  sub")
    console.log(response);
  };
</script>

<button
  class="bg-pink-100 hover:bg-red-700 text-white font-bold p-4 rounded m-4"
  on:click={postSubmission}
>
  Post submissions
</button>

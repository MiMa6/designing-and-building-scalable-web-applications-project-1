<script>
  import { assignment } from "../stores/assignmentStore.js";
  import { userUuid } from "../stores/stores.js";
  
  const fetchAssignments = async () => {

    // TODO: real assignment values
    console.log("assignment", assignment)
    const data = {
      programming_assignment_id: $assignment.id,
      code: "Koodi Koodi Koodi", //todo code from field
      user_uuid: $userUuid,
      grader_feedback: "",
      correct: false,
    }
 
    const response = await fetch("/api/submissions", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response);
  };
</script>

<button
  class="bg-pink-100 hover:bg-red-700 text-white font-bold p-4 rounded m-4"
  on:click={fetchAssignments}
>
  Post submissions
</button>

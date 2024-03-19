<script>
  import {textAreaValue} from "../../stores/textAreaStore.js";
  import { assignment } from "../../stores/assignmentStore.js";
  import { onMount } from "svelte";

  const fetchAssignment = async () => {
    let assignmentId = sessionStorage.getItem("assignmentId");

    if (assignmentId === null) {
      assignmentId = 1;
    }

    console.log("Fetching assignment");
    const response = await fetch("/api/assignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assignmentId: assignmentId }),
    });

    const jsonData = await response.json();
    assignment.set(jsonData[0]);
  };

  const fetchNextAssignment = async () => {
    textAreaValue.set("");
    let assignmentId = parseInt(sessionStorage.getItem("assignmentId"));

    if (assignmentId === null) {
      assignmentId = 1;
    } else if (assignmentId === 3) {
      assignmentId = 1;
    } else {
      assignmentId += 1;
    }
    sessionStorage.setItem("assignmentId", assignmentId);
    fetchAssignment();
  };

  onMount(fetchAssignment);
</script>

<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  on:click={fetchNextAssignment}
>
  Next Assignment
</button>

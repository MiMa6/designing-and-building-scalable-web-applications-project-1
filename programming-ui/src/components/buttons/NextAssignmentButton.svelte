<script>
  import { textAreaValue } from "../../stores/textAreaStore.js";
  import { assignment } from "../../stores/assignmentStore.js";
  import { onMount } from "svelte";

  const fetchAssignment = async () => {
    let assignmentId = 1;

    if (sessionStorage.getItem("assignmentId")) {
      assignmentId = sessionStorage.getItem("assignmentId");
    }

    console.log("Fetching assignment");
    const response = await fetch("/api/assignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assignmentId: assignmentId }),
    });

    sessionStorage.setItem("assignmentId", assignmentId);
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
    window.location.reload();
  };

  onMount(fetchAssignment);
</script>

<div class="w-full md:w-2/3 mx-auto mt-8 mb-12">
  <button
    class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
    on:click={fetchNextAssignment}
  >
    <span class="mr-2">Next Assignment</span>
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
    </svg>
  </button>
</div>
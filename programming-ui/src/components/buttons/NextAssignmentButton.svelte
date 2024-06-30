<script>
  import { textAreaValue } from "../../stores/textAreaStore.js";
  import { assignment } from "../../stores/assignmentStore.js";
  import { userUuid } from "../../stores/stores.js";
  import { onMount } from "svelte";

  let correctAssignmentIds = [];
  const allAssignments = [1, 2, 3];

  const fetchNextAssignmentHandler = async () => {
    correctAssignmentIds = await fetchCorrectAssignments();
    getRandomUncompletedAssignment();
  };

  const fetchCorrectAssignments = async () => {
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
    const jsonData = await response.json();
    console.log("Correct assignments");
    console.log(jsonData.data);
    return jsonData.data;
  };

  const getRandomUncompletedAssignment = async () => {
    textAreaValue.set("");

    // If assignment id saved to session fetch that else assign it to 1
    let assignmentId = 1;
    if (sessionStorage.getItem("assignmentId")) {
      assignmentId = sessionStorage.getItem("assignmentId");
    }

    const allAssignments = [1, 2, 3];
    const uncompletedAssignments = allAssignments.filter(
      (id) => !correctAssignmentIds.includes(id)
    );

    if (uncompletedAssignments.length === 0) {
      // If all assignments are completed, return a random number between 1 and 3
      console.log("All assignemnts completed, take random of 3");
      assignmentId = Math.floor(Math.random() * 3) + 1;
      console.log(assignmentId);
    } else {
      console.log("Take random of uncompleted assignments");
      const randomIndex = Math.floor(
        Math.random() * uncompletedAssignments.length
      );
      assignmentId = uncompletedAssignments[randomIndex];
      console.log(assignmentId);
    }

    sessionStorage.setItem("assignmentId", assignmentId);
    fetchAssignment(assignmentId);
  };

  const fetchAssignment = async (assignmentId) => {
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

    console.log("Assignment data:");
    console.log(jsonData[0]);
  };
  onMount(fetchNextAssignmentHandler);
</script>

<div class="w-full md:w-2/3 mx-auto mt-8 mb-12">
  <button
    type="nextButton"
    class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
    on:click={fetchNextAssignmentHandler}
  >
    <span class="mr-2">Next Assignment</span>
    <svg
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      ></path>
    </svg>
  </button>
</div>

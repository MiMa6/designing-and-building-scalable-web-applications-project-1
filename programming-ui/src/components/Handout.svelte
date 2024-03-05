<script>
  import { assignment } from "../stores/assignmentStore.js";
  import { onMount } from "svelte";

  const fetchRandomAssignment = async () => {
    console.log("Fetching random assignment");
    const response = await fetch("/api/assignment", {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = await response.json();
    assignment.set(jsonData[0]);

    console.log(jsonData);
    console.log($assignment);
  };

  onMount(fetchRandomAssignment);
</script>

<div class="flex w-full p-8 border-b-4 border-gray-300">
  <span class="flex-shrink-0 w-12 h-12 bg-blue-400 rounded-full"></span>

  <div class="flex flex-col flex-grow ml-4">
    <div class="p-4 bg-white rounded shadow"></div>
    <h2 class="text-xl font-bold mb-2">
      {$assignment ? $assignment.title : "loading"}
    </h2>
    <p class="text-gray-700">
      {$assignment ? $assignment.handout : "Loading"}
    </p>
  </div>
</div>

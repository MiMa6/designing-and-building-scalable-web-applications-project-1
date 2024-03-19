<script>
  import { assignment } from "../stores/assignmentStore.js";
  import { totalPoints } from "../stores/scoreStore.js";
  import { userUuid } from "../stores/stores.js";
  import { onMount } from "svelte";

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
    totalPoints.set(responseData.data);
  };
  onMount(fetchTotalPoints);

  const fetchRandomAssignment = async () => {
    console.log("Fetching random assignment");
    const response = await fetch("/api/assignments/random", {
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
  //onMount(fetchRandomAssignment);
</script>

<div class="flex py-5 px-10 flex-col flex-grow ml-4">
  <p class="text-xl text-black font-semibold text-left">
    {$assignment ? $assignment.title : "loading"}
  </p>
  <p class="text-lg text-black font-medium text-left">
    {$assignment ? $assignment.handout : "Loading"}
  </p>
</div>

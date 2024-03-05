<script>
  const fetchAssignments = async () => {
    const response = await fetch("/api/assignments", {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = await response.json();
    console.log(jsonData);
  };
</script>

<button
  class="bg-yellow-500 hover:bg-purple-700 text-white font-bold p-4 rounded m-4"
  on:click={fetchAssignments}
>
  Get assignments
</button>

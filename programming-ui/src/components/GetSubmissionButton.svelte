<script>
  const fetchAssignments = async () => {
    const response = await fetch("/api/submissions", {
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
  class="bg-pink-500 hover:bg-red-700 text-white font-bold p-4 rounded m-4"
  on:click={fetchAssignments}
>
  Get submissions
</button>

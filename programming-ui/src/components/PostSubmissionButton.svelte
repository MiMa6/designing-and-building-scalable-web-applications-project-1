<script>
  const fetchAssignments = async () => {
    const response = await fetch("/api/submissions", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
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

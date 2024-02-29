<script>
  let item = "";
  console.log(item);

  let assignment = {
    name: "Basic Python Assignment",
    handout:
      "Write a Python function that takes two numbers as arguments and returns their sum.",
  };

</script>

<div class="flex w-full p-8 border-b-4 border-gray-300">
  <span class="flex-shrink-0 w-12 h-12 bg-blue-400 rounded-full"></span>

  <div class="flex flex-col flex-grow ml-4">
    <div class="p-4 bg-white rounded shadow">
      <h2 class="text-xl font-bold mb-2">{assignment.name}</h2>
      <p class="text-gray-700">{assignment.handout}</p>
    </div>
    <textarea
      bind:value={item}
      class="p-3 bg-transparent border border-gray-500 rounded-sm"
      name=""
      id=""
      rows="3"
      placeholder="Write your Python code here..."
    ></textarea>

    <div class="w-full md:w-1/2">
      <h2 class="text-2xl font-bold mb-4">Submission Status</h2>
      <div class="prose">
        <p>Submission status: <span class="text-green-500">Processed</span></p>
        <p>Grader feedback: <span class="text-green-500">Well done</span></p>
        <p>Correct: <span class="text-green-500">Yes</span></p>
      </div>
    </div>
    <div class="flex justify-between mt-2">

    </div>
  </div>
</div>

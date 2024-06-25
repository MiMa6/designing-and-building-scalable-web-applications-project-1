<script>

  import {textAreaValue} from "../stores/textAreaStore.js";

  // Lets user to create intentions with "tab" in textarea
  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;

      $textAreaValue =
        $textAreaValue.substring(0, start) + "\t" + $textAreaValue.substring(end);

      event.target.selectionStart = event.target.selectionEnd = start + 1;
    }
  };
</script>

<div class="w-full md:w-2/3 mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-6">
  <div class="bg-gradient-to-r from-green-500 to-teal-600 p-4">
    <h2 class="text-2xl font-bold text-white text-center">Code Editor</h2>
  </div>
  
  <div class="p-6">
    <div class="relative">
      <textarea
        bind:value={$textAreaValue}
        class="w-full h-64 p-4 text-gray-800 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-200 ease-in-out resize-none font-mono text-sm"
        placeholder="Write your Python code here..."
        on:keydown={handleKeyDown}
      ></textarea>
      <div class="absolute top-3 right-3">
        <span class="text-xs text-gray-500">Python</span>
      </div>
    </div>
  </div>
</div>
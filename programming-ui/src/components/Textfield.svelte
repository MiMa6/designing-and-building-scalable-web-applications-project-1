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

<textarea
  bind:value={$textAreaValue}
  style="width: 100%; padding: 1rem; border: 1px solid gray; border-radius: 0.25rem;"
  class="text-base text-black font-base"
  name=""
  id=""
  rows="10"
  placeholder="Write your Python code here..."
  on:keydown={handleKeyDown}
></textarea>

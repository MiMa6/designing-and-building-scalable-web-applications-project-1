<script>
  import { assignment } from "../stores/assignmentStore.js";
</script>

<div class="flex py-5 px-10 flex-col flex-grow ml-4">
  <p class="text-xl text-black font-semibold text-left">
    {$assignment ? $assignment.title : "loading"}
  </p>
  <p class="text-lg text-black font-medium text-left">
    {$assignment ? $assignment.handout : "Loading"}
  </p>
</div>

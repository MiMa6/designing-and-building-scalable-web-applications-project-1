<script>
  import { assignment } from "../stores/assignmentStore.js";
</script>
<div class="w-full md:w-2/3 mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-6">
  <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
    <h2 class="text-2xl font-bold text-white text-center">Current Assignment</h2>
  </div>
  
  <div class="p-6 space-y-4">
    {#if $assignment}
      <div>
        <h3 class="text-xl text-gray-800 font-semibold mb-2">
          {$assignment.title}
        </h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-700 whitespace-pre-wrap">
            {$assignment.handout}
          </p>
        </div>
      </div>
    {:else}
      <div class="flex items-center justify-center h-32">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    {/if}
  </div>
</div>
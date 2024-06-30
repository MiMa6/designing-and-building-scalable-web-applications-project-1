<script>
  import { userUuid } from "../stores/stores.js";
  import { totalPoints } from "../stores/scoreStore.js";
</script>

<header
  class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg mb-8"
>
  <div class="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center justify-between sm:flex-row">
      <div class="text-center sm:text-left mb-4 sm:mb-0">
        <h1 class="text-3xl font-extrabold text-white">WAPPY</h1>
        <p class="mt-1 text-lg text-indigo-200">
          Web App for Python Code Checking
        </p>
      </div>

      <div
        class="bg-white bg-opacity-20 rounded-full px-4 py-2 flex items-center"
      >
        <svg
          class="h-6 w-6 text-indigo-200 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
        <span class="text-sm font-medium text-white">
          User: {$userUuid}
        </span>
      </div>
      <div
        class="bg-white bg-opacity-20 rounded-full px-4 py-2 flex items-center"
      >
        <span type="total-points" class="text-sm font-medium text-white">
          Total Points: <span class="text-white">{$totalPoints * 100}</span>
        </span>
      </div>
    </div>
  </div>
</header>

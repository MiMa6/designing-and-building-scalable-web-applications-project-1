<script>
  import { userUuid } from "../stores/stores.js";
  import { totalPoints } from "../stores/scoreStore.js";
</script>

<div class="py-5 px-10 mx-auto bg-white rounded-xl shadow-lg space-y-1">
  <p class="text-2xl text-slate-700 font-bold text-center">
    WAPPY - Web app for practicing Python
  </p>

  <p class="text-lg text-slate-500 font-medium text-center">
    User: {$userUuid}
  </p>

  <p class="text-lg text-slate-500 font-medium text-center">
    Total points: {$totalPoints * 100}
  </p>
</div>

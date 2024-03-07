import { writable } from "svelte/store";

const graderData = writable({ grader_feedback: "", correct: false });
export { graderData };

import { writable } from "svelte/store";

const queue = writable([]);
const currentSubmission = writable(null);

export { queue, currentSubmission };

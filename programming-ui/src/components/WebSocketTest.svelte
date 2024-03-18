<script>
  import { userUuid } from "../stores/stores.js";
  
  let messages = [];
  let ws;

  const openConnection = () => {
    console.log("Connection opened");
    const host = window.location.hostname;
    ws = new WebSocket("ws://" + host + ":7800/api/ws");

    ws.onmessage = (event) => {
      messages = [...messages, event.data];
    };
  };

  const sendMessage = () => {
    ws.send($userUuid);
  };

  const closeConnection = () => {
    console.log("Connection closed");
    ws.close();
  };
</script>

<h2>WebSocket messages</h2>

<button
  class="bg-purple-500 hover:bg-red-700 text-white font-bold p-4 rounded m-4"
  on:click={openConnection}>Open connection</button
>

<button
  class="bg-purple-500 hover:bg-red-700 text-white font-bold p-4 rounded m-4"
  on:click={closeConnection}>CLose connection</button
>

<button
  class="bg-pink-500 hover:bg-red-700 text-white font-bold p-4 rounded m-4"
  on:click={sendMessage}>Send Message</button
>

<ul>
  {#each messages as message}
    <li>{message}</li>
  {/each}
</ul>

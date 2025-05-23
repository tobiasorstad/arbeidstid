<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  let startTime: Date;
  let currentTime: Date = new Date();
  let intervalId: NodeJS.Timeout;
  let selectedTime: string = ''; // Variable to hold the selected time string from the input
  let editingStartTime: boolean = false; // Variable to control visibility of time picker

  // Function to toggle the editing state
  function toggleEditing() {
    editingStartTime = !editingStartTime;
    if (editingStartTime && startTime) {
      // Initialize selectedTime with the current startTime when editing starts
      const hours = startTime.getHours().toString().padStart(2, '0');
      const minutes = startTime.getMinutes().toString().padStart(2, '0');
      selectedTime = `${hours}:${minutes}`;
    }
  }

  // Function to update the start time based on the selected time input
  function updateStartTime() {
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const today = new Date();
      // Create a new Date object with today's date and the selected time
      const newStartTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);
      startTime = newStartTime;
      localStorage.setItem('startTime', startTime.toISOString());
      editingStartTime = false; // Hide time picker after updating
    }
  }

  onMount(() => {
    const storedStartTime = localStorage.getItem('startTime');
    if (storedStartTime) {
      const parsedStartTime = new Date(storedStartTime);
      const today = new Date();
      // Check if the stored date is today
      if (parsedStartTime.getDate() === today.getDate() &&
          parsedStartTime.getMonth() === today.getMonth() &&
          parsedStartTime.getFullYear() === today.getFullYear()) {
        startTime = parsedStartTime;
      } else {
        // If not today, start a new timer
        startTime = new Date();
        localStorage.setItem('startTime', startTime.toISOString());
      }
    } else {
      // If no start time is stored, start a new timer
      startTime = new Date();
      localStorage.setItem('startTime', startTime.toISOString());
    }

    currentTime = new Date(); // Initialize currentTime as well
    // Update time every second
    intervalId = setInterval(() => {
      currentTime = new Date();
    }, 1000);
  });

  onDestroy(() => {
    // Clear the interval when the component is destroyed
    if (intervalId) {
      clearInterval(intervalId);
    }
    // Save the current startTime to localStorage when the component is destroyed
    if (startTime) {
      localStorage.setItem('startTime', startTime.toISOString());
    }
  });

  // Helper function to format a Date object to a time string (HH:MM:SS)
  function formatTime(date: Date): string {
    if (!date) return '...'; // Handle case where date might be undefined initially
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  // Helper function to format the duration between two dates
  function formatDuration(start: Date, end: Date): string {
    if (!start) return 'Calculating...';
    const diffMs = end.getTime() - start.getTime();
    
    if (diffMs < 0) return 'Calculating...'; // Should not happen if startTime is set correctly

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Pad with leading zeros
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedHours}h ${paddedMinutes}m ${paddedSeconds}s`;
  }

  // Helper function to format the duration as decimal hours
  function formatDurationAsDecimalHours(start: Date, end: Date): string {
    if (!start) return 'Calculating...';
    const diffMs = end.getTime() - start.getTime();

    if (diffMs < 0) return 'Calculating...';

    const hours = diffMs / (1000 * 60 * 60);
    const roundedHours = Math.round(hours * 10) / 10;
    return `${roundedHours.toFixed(1)} timer`;
  }
</script>

<main>
  {#if startTime}
    <div class="time-info">
      <p>
        <strong>Startet:</strong>
        {#if !editingStartTime}
          {formatTime(startTime)}
          <button on:click={toggleEditing}>✏️</button>
        {:else}
          <input type="time" id="startTime" bind:value={selectedTime}>
          <button on:click={updateStartTime}>✔️</button>
          <button on:click={toggleEditing}>❌</button>
        {/if}
      </p>
      <p><strong>Tid:</strong> {formatDuration(startTime, currentTime)}</p>
      <p><strong>Current:</strong> {formatDurationAsDecimalHours(startTime, currentTime)}</p>
    </div>
  {:else}
    <p>Initializing timer...</p>
  {/if}
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1em;
    box-sizing: border-box;
    text-align: center;
    background-color: #f0f0f0; /* Light background for the window */
    color: #333; /* Dark text for readability */
  }

  .time-info p {
    margin: 0.5em 0;
    font-size: 1.1em; /* Slightly larger font for clarity */
    display: flex; /* Use flexbox to align items in the paragraph */
    align-items: center; /* Vertically align items */
    justify-content: center; /* Center items horizontally */
  }

  .time-info strong {
    margin-right: 0.5em;
  }

  .time-info button {
    background: none;
    border: none;
    margin-left: 0.5em; /* Adjust margin for icon spacing */
    padding: 0; /* Remove padding for a cleaner icon look */
    font-size: 1.2em; /* Increase font size for better icon visibility */
    cursor: pointer;
    color: inherit; /* Ensure icons use the parent text color */
  }


  /* Remove default body margin if any, to ensure main fills the window */
  :global(body) {
    margin: 0;
    overflow: hidden; /* Prevent scrollbars in the small window */
  }
</style>

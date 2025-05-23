<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  let startTime: Date;
  let currentTime: Date = new Date();
  let intervalId: NodeJS.Timeout;

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
</script>

<main>
  {#if startTime}
    <div class="time-info">
      <p><strong>Started:</strong> {formatTime(startTime)}</p>
      <p><strong>Elapsed:</strong> {formatDuration(startTime, currentTime)}</p>
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
  }

  .time-info strong {
    margin-right: 0.5em;
  }

  /* Remove default body margin if any, to ensure main fills the window */
  :global(body) {
    margin: 0;
    overflow: hidden; /* Prevent scrollbars in the small window */
  }
</style>

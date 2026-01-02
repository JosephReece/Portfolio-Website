<script lang="ts">
  import { fly, fade, scale } from "svelte/transition";
  import { cubicOut, cubicInOut } from "svelte/easing";
  import { ChevronDown } from "lucide-svelte";
  import { currentView } from "$lib/view";

  type View =
    | "home"
    | "projects"
    | "careers"
    | "education"
    | "hobbies"
    | "contact";

  const viewLabels: { value: View; label: string }[] = [
    { value: "home", label: "Home" },
    { value: "projects", label: "Projects" },
    { value: "careers", label: "Careers" },
    { value: "education", label: "Education" },
    { value: "hobbies", label: "Hobbies" },
    { value: "contact", label: "Contact" },
  ];

  let isOpen = false;

  function handleSelect(value: View) {
    currentView.set(value);
    isOpen = false;
  }

  $: selectedLabel =
    viewLabels.find((v) => v.value === $currentView)?.label ?? "Select";
</script>

<!-- Trigger Button -->
<button
  on:click={() => (isOpen = !isOpen)}
  class="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white flex items-center justify-between shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-slate-800/70 active:scale-[0.98]"
>
  <span class="font-medium mr-1">{selectedLabel}</span>

  <span
    class="inline-flex origin-center transition-transform duration-300 ease-in-out"
    style="transform: rotate({isOpen ? 180 : 0}deg)"
  >
    <ChevronDown size={20} />
  </span>
</button>

<!-- Dropdown -->
{#if isOpen}
  <div
    class="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden z-10"
    in:fly={{ y: -10, duration: 200, easing: cubicOut }}
    out:fly={{ y: -10, duration: 150, easing: cubicInOut }}
  >
    {#each viewLabels as item, index}
      <button
        on:click={() => handleSelect(item.value)}
        class={`w-full px-4 py-3 text-left transition-all duration-200 ${
          $currentView === item.value
            ? "bg-blue-600/20 text-blue-400 font-medium"
            : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
        }`}
        style="animation-delay: {index * 50}ms"
        in:fly={{ x: -20, duration: 200, easing: cubicOut }}
      >
        {item.label}
      </button>
    {/each}
  </div>
{/if}

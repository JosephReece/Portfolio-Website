<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { ChevronDown } from "lucide-svelte";
  import { currentView, groupings, type View } from "$lib/view";

  let isOpen = $state(false);
  let selectedLabel = $state("");

  const viewLabels = Object.entries(groupings).map(([name, details]) => ({
    label: details.label,
    value: name,
  }));

  function handleSelect(value: View) {
    currentView.set(value);
    isOpen = false;
  }

  $effect(() => {
    selectedLabel = groupings[$currentView].label ?? "Select";
  });
</script>

<div class="fixed top-4 right-4 z-10 select-none">
  <div class="relative min-w-[180px]">
    <button
      onclick={() => (isOpen = !isOpen)}
      class="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-between transition-all duration-500 hover:border-white/40 group"
    >
      <span class="text-[11px] uppercase tracking-[0.2em] font-light"
        >{selectedLabel}</span
      >

      <span
        class="flex items-center justify-center w-5 transition-transform duration-500 ease-out opacity-40 group-hover:opacity-100"
        style="transform: rotate({isOpen ? 180 : 0}deg)"
      >
        <ChevronDown size={14} strokeWidth={1} />
      </span>
    </button>

    {#if isOpen}
      <div
        class="absolute top-full left-0 right-0 mt-1 bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl z-50"
        transition:fade={{ duration: 200 }}
      >
        <div class="flex flex-col py-1">
          {#each viewLabels as item, index}
            <button
              onclick={() => handleSelect(item.value as View)}
              class="w-full px-4 py-4 text-left transition-all duration-300 group relative"
              in:fly={{
                y: -5,
                delay: index * 30,
                duration: 400,
                easing: cubicOut,
              }}
            >
              <div
                class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>

              <div class="relative flex items-center justify-between">
                <span
                  class="text-[10px] uppercase tracking-[0.2em] font-light {$currentView ===
                  item.value
                    ? 'text-white'
                    : 'text-white/40 group-hover:text-white/80'}"
                >
                  {item.label}
                </span>

                <div class="flex items-center justify-center w-5">
                  {#if $currentView === item.value}
                    <div
                      in:fade={{ duration: 300 }}
                      class="w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    ></div>
                  {/if}
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- <style>
  button {
    cursor: crosshair;
  }
</style> -->

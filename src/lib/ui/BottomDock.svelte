<script lang="ts">
  import { tooltip } from "$lib/view";
  import { Spring } from "svelte/motion";

  const visibility = new Spring(0, {
    stiffness: 0.1,
    damping: 0.5
  });

  // This is what we actually render
  let displayedTooltip = $state<typeof $tooltip>(null);

  $effect(() => {
    if ($tooltip) {
      // When showing, update immediately
      displayedTooltip = $tooltip;
      visibility.target = 1;
    } else {
      // When hiding, animate out
      visibility.target = 0;
    }
  });

  // Detect when fully hidden
  $effect(() => {
    if (visibility.current < 0.01 && !$tooltip) {
      displayedTooltip = null;
    }
  });
</script>

<div class="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
  <div class="mx-auto max-w-6xl px-8 pb-12">
    <div
      class="bg-black/60 backdrop-blur-2xl border border-white/15
             text-white rounded-2xl px-12 py-10
             shadow-[0_-20px_80px_rgba(0,0,0,0.7)]"
      style="
        opacity: {visibility.current};
        transform: translateY({(1 - visibility.current) * 40}px);
      "
    >
      <div class="flex flex-col gap-4">
        <div
          class="text-sm uppercase tracking-[0.2em] text-white/60 font-light"
        >
          {displayedTooltip?.title}
        </div>

        <div
          class="text-lg leading-relaxed text-white/85 font-light max-w-4xl"
        >
          {displayedTooltip?.description}
        </div>
      </div>
    </div>
  </div>
</div>
<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import { Spring } from "svelte/motion";
  import { changeView, currentView } from "$lib/view";

  interactivity();

  const { view, centroid = $bindable(), children, ...rest } = $props();

  const scale = new Spring(1, { stiffness: 0.15, damping: 0.4 });
  const hover = new Spring(0, { stiffness: 0.2, damping: 0.5 });

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    changeView(view === $currentView ? "home" : view);

    scale.target = 1;
    hover.target = 0;
  }
</script>

<T.Group
  scale={scale.current}
  position={centroid}
  onclick={handleClick}
  onpointerenter={() => {
    if (view !== $currentView) {
      scale.target = 1.05;
      hover.target = 1;
    }
  }}
  onpointerleave={() => {
    scale.target = 1;
    hover.target = 0;
  }}
  {...rest}
>
  {@render children()}
</T.Group>

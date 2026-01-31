<script lang="ts">
  import { T } from "@threlte/core";

  let props = $props();

  const turretY = 0.08;
  const turretSize: [number, number, number] = [0.01, 0.01, 0.01];
  const spacing = 0.015;

  const coords = [-1, 0, 1];
</script>

{#snippet rookMaterial()}
  <T.MeshPhysicalMaterial 
    color="#000"
    metalness={1}
    roughness={0.2}
  />
{/snippet}

<T.Group scale={2} {...props}>
  <T.Mesh position.y={0.01}>
    <T.BoxGeometry args={[0.05, 0.015, 0.05]} />
    {@render rookMaterial()}
  </T.Mesh>

  <T.Mesh position.y={0.025}>
    <T.BoxGeometry args={[0.028, 0.06, 0.028]} />
    {@render rookMaterial()}
  </T.Mesh>

  <T.Mesh position.y={0.065}>
    <T.BoxGeometry args={[0.04, 0.02, 0.04]} />
    {@render rookMaterial()}
  </T.Mesh>

  {#each coords as x}
    {#each coords as z}
      {#if !(x === 0 && z === 0)}
        <T.Mesh position={[x * spacing, turretY, z * spacing]}>
          <T.BoxGeometry args={turretSize} />
          {@render rookMaterial()}
        </T.Mesh>
      {/if}
    {/each}
  {/each}
</T.Group>
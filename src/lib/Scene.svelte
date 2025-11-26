<script lang="ts">
  import { interactivity } from "@threlte/extras";
  import { T } from "@threlte/core";
  import { currentView, lightOn, type View } from "$lib/view";

  interactivity();
  const goTo = (view: View) => {
    if (view === $currentView) {
      console.log(view + " ---> home");
      currentView.set("home");
    } else {
      console.log($currentView + " ---> " + view);
      currentView.set(view);
    }
  };
</script>

<T.Group>
  <!-- Walls -->
  <T.Group>
    <T.Mesh position={[-1.25, 1.7, -0.6]}>
      <T.PlaneGeometry args={[5, 5]} />
      <T.MeshStandardMaterial color={"#066"} />
    </T.Mesh>

    <T.Mesh position={[1.25, 1.7, 1.9]} rotation={[0, -Math.PI / 2, 0]}>
      <T.PlaneGeometry args={[5, 5]} />
      <T.MeshStandardMaterial color={"#066"} />
    </T.Mesh>

    <T.Mesh position={[-1.25, -0.7, 1.9]} rotation={[-Math.PI / 2, 0, 0]}>
      <T.PlaneGeometry args={[5, 5]} />
      <T.MeshStandardMaterial color={"#066"} />
    </T.Mesh>
  </T.Group>

  <!-- Desk -->
  <T.Group>
    <T.Mesh position={[0, 0, 0]}>
      <T.BoxGeometry args={[2.5, 1.5, 1.2]} />
      <T.MeshStandardMaterial color={"#964B00"} />
    </T.Mesh>
  </T.Group>

  <!-- Bookshelf (Education) -->
  <T.Group>
    <!-- Upper Shelf -->
    <T.Group
      onclick={(e: MouseEvent) => {
        e.stopPropagation();
        goTo("education-1");
      }}
    >
      <T.Mesh position={[-0.9, 1, -0.4]}>
        <T.BoxGeometry args={[0.5, 0.6, 0.4]} />
        <T.MeshStandardMaterial color={"#654321"} />
      </T.Mesh>
    </T.Group>

    <!-- Lower Shelf -->
    <T.Group
      onclick={(e: MouseEvent) => {
        e.stopPropagation();
        goTo("education-2");
      }}
    >
      <T.Mesh position={[-0.9, 1.6, -0.4]}>
        <T.BoxGeometry args={[0.5, 0.6, 0.4]} />
        <T.MeshStandardMaterial color={"#654321"} />
      </T.Mesh>
    </T.Group>
  </T.Group>

  <!-- Shelf -->
  <T.Group
    position={[0.3, 1.8, -0.5]}
    onclick={(e: MouseEvent) => {
      e.stopPropagation();
      goTo("hobbies");
    }}
  >
    <T.Mesh position={[0, 0, 0]}>
      <T.BoxGeometry args={[1.1, 0.02, 0.2]} />
      <T.MeshStandardMaterial color={"#654321"} />
    </T.Mesh>

    <T.Mesh position={[-0.4, 0.05, 0]}>
      <T.BoxGeometry args={[0.1, 0.1, 0.1]} />
      <T.MeshStandardMaterial color={"#f00"} />
    </T.Mesh>

    <T.Mesh position={[-0.18, 0.07, 0]}>
      <T.BoxGeometry args={[0.15, 0.15, 0.15]} />
      <T.MeshStandardMaterial color={"#0f0"} />
    </T.Mesh>

    <T.Mesh position={[0.25, 0.07, 0]}>
      <T.BoxGeometry args={[0.5, 0.12, 0.12]} />
      <T.MeshStandardMaterial color={"#00f"} />
    </T.Mesh>
  </T.Group>

  <!-- Notebook (Work) -->
  <T.Group
    position={[0, 1.02, 0]}
    onclick={(e: MouseEvent) => {
      e.stopPropagation();
      goTo("work");
    }}
  >
    <T.Mesh position={[0.7, -0.25, 0.2]} rotation={[0, -0.4, 0]}>
      <T.BoxGeometry args={[0.25, 0.05, 0.4]} />
      <T.MeshStandardMaterial color={"#2e86ab"} />
    </T.Mesh>
  </T.Group>

  <!-- Screen (Projects) -->
  <T.Group
    position={[0, 1.02, -0.2]}
    rotation={[0, 0, 0]}
    onclick={(e: MouseEvent) => {
      e.stopPropagation();
      goTo("projects");
    }}
  >
    <T.Mesh position={[0, 0.25, 0]}>
      <T.BoxGeometry args={[1.1, 0.7, 0.1]} />
      <T.MeshStandardMaterial color={"#445"} />
    </T.Mesh>

    <T.Mesh position={[0, 0, -0.1]}>
      <T.BoxGeometry args={[0.175, 0.5, 0.1]} />
      <T.MeshStandardMaterial color={"#252525"} />
    </T.Mesh>

    <T.Mesh position={[0, -0.25, -0.1]}>
      <T.BoxGeometry args={[0.5, 0.05, 0.3]} />
      <T.MeshStandardMaterial color={"#252525"} />
    </T.Mesh>

    <T.Mesh position={[0, -0.25, 0.3]}>
      <T.BoxGeometry args={[0.6, 0.05, 0.23]} />
      <T.MeshStandardMaterial color={"#252525"} />
    </T.Mesh>
  </T.Group>

  <!-- Lamp -->
  <T.Group
    position={[1, 1.02, -0.2]}
    rotation={[0, 0, 0]}
    onclick={(e: MouseEvent) => {
      e.stopPropagation();
      lightOn.set(!$lightOn);
    }}
  >
    <T.Mesh position={[0, 0.2, 0]} scale={[0.15, 0.15, 0.15]}>
      <T.CylinderGeometry args={[1, 1.5, 2, 32, 1]} />
      <T.MeshStandardMaterial color={"#f0cd13"} />
    </T.Mesh>

    <T.Mesh position={[0, 0, 0]}>
      <T.BoxGeometry args={[0.05, 0.5, 0.05]} />
      <T.MeshStandardMaterial color={"#654321"} />
    </T.Mesh>

    <T.Mesh position={[0, -0.25, 0]}>
      <T.BoxGeometry args={[0.2, 0.05, 0.2]} />
      <T.MeshStandardMaterial color={"#654321"} />
    </T.Mesh>

    <!-- Warm light -->
    {#if $lightOn}
      <T.PointLight
        position={[-0.5, 0.2, 0.5]}
        intensity={1.5}
        distance={3}
        color={"#ffdca8"}
        castShadow={true}
      />
    {/if}
  </T.Group>
</T.Group>

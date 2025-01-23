<script lang="ts">
    // Import project data from an external file
    import { projects as projectData } from "$lib/projects"; // Adjust path as needed
    import { goto } from "$app/navigation";

    // Dynamically assign projects to use the imported data
    let projects = Object.keys(projectData).map((key) => ({
        key,
        name: projectData[key].title,
        description: projectData[key].shortDescription,
        tags: projectData[key].tags,
    }));

    import { onMount } from "svelte";

    let waveElement: HTMLSpanElement | null = null;

    onMount(() => {
        const triggerWave = () => {
            waveElement && (waveElement.style.animationPlayState = "running");
            setTimeout(() => {
                waveElement && (waveElement.style.animationPlayState = "paused");
            }, 2000); // Pause the animation after 2 seconds
        };

        const randomiseWave = () => {
            triggerWave();
            setTimeout(randomiseWave, Math.random() * 2000 + 6000); // Random interval between 3-8 seconds
        };

        randomiseWave();
    });
</script>

<div class="min-h-screen bg-custom-dark text-custom-blush p-6">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="h-dvh flex items-center justify-center flex-col">
            <h1 class="text-7xl mb-4 text-custom-blush">
                Hello, I'm Joe <span bind:this={waveElement} class="wave"
                    >👋</span
                >
            </h1>
            <p class="text-3xl text-custom-blush mb-8">
                A <span class="text-custom-red">React</span> Developer
            </p>
        </div>

        <!-- Projects Section -->
        <section>
            <h2 class="text-3xl font-semibold mb-4 text-custom-blush">
                Explore My <span class="text-custom-red">Projects</span>
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each projects as project}
                    <div
                        class="bg-custom-blush text-custom-dark p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                        on:click={() => goto(`/projects/${project.key}`)}
                        on:keydown={() => {}}
                        role="button"
                        tabindex="0"
                        aria-label="go to project"
                    >
                        <h3 class="text-lg font-semibold text-custom-red">
                            {project.name}
                        </h3>
                        <p class="text-sm text-custom-coral mt-2">
                            {project.description}
                        </p>
                        {#if project.tags.length > 0}
                            <div class="flex flex-wrap mt-4 gap-2">
                                {#each project.tags as tag}
                                    <span
                                        class="bg-custom-dark text-custom-peach px-2 py-1 rounded text-xs font-medium"
                                    >
                                        {tag}
                                    </span>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </section>
    </div>
</div>

<style>
    @keyframes wave {
        0% {
            transform: rotate(0deg);
        }
        15% {
            transform: rotate(15deg);
        }
        30% {
            transform: rotate(-15deg);
        }
        45% {
            transform: rotate(10deg);
        }
        60% {
            transform: rotate(-10deg);
        }
        75% {
            transform: rotate(5deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }

    .wave {
        display: inline-block;
        animation: wave 2s ease-in-out infinite;
        animation-play-state: paused;
        transform-origin: bottom center;
    }
</style>

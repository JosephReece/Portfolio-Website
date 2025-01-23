<script lang="ts">
    import { page } from '$app/stores'; // For accessing the project name from the URL params
    import { projects as projectData } from '$lib/projects'; // Import project data

    // Dynamically fetch the current project based on the route parameter
    $: projectName = $page.params.project_name; // The project name from the URL
    $: project = projectData[projectName]; // Fetch the project details
</script>

<div class="min-h-screen bg-custom-dark text-custom-blush p-6">
    <div class="max-w-4xl mx-auto">
        <!-- Project Content -->
        {#if project}
            <h1 class="text-4xl font-bold mb-4 text-custom-blush">{project.title}</h1>
            <p class="text-lg text-custom-peach mb-6">{project.shortDescription}</p>

            <div class="bg-custom-blush text-custom-dark p-6 rounded-lg shadow-md">
                <p class="text-sm text-custom-coral leading-relaxed">
                    {project.longDescription}
                </p>

                <!-- Tags Section -->
                {#if project.tags.length > 0}
                    <div class="flex flex-wrap mt-4 gap-2">
                        {#each project.tags as tag}
                            <span class="bg-custom-dark text-custom-peach px-2 py-1 rounded text-xs font-medium">
                                {tag}
                            </span>
                        {/each}
                    </div>
                {/if}
            </div>
        {:else}
            <!-- Fallback if project not found -->
            <h1 class="text-3xl font-bold mb-6 text-custom-red">Project Not Found</h1>
            <p class="text-lg text-custom-coral">The requested project does not exist. Please check the URL and try again.</p>
        {/if}
    </div>
</div>
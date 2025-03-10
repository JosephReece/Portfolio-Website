<script lang="ts">
    export let text = "Hover over me!"
    export let size = 8;

    const calculateTranslation = (direction: number) => `${(direction * size) / 10}rem`;
</script>

<div class="container" style={`font-size: ${size}rem; --red-translate: ${calculateTranslation(-1)}; --green-translate: ${calculateTranslation(1)}; --blue-translate: ${calculateTranslation(0)};`}>
    <div class="text-wrapper">
        <span class="channel red" data-text={text}>{text}</span>
        <span class="channel green" data-text={text}>{text}</span>
        <span class="channel blue" data-text={text}>{text}</span>
        <span class="text" data-text={text}>{text}</span>
    </div>
</div>

<style>
    .container {
        font-weight: 600;
        isolation: isolate;
        user-select: none;
    }

    .container * {
        mix-blend-mode: multiply;
    }

    .text-wrapper {
        position: relative;
    }

    .text {
        position: relative;
        color: black;
        transition:
            transform 0.3s ease-in-out,
            opacity 0.3s ease-in-out;
    }

    .channel {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        transition:
            transform 0.3s ease-in-out,
            opacity 0.3s ease-in-out;
        opacity: 0;
    }

    .channel.red {
        color: #ff0000;
        transform: translate(0, 0);
    }

    .channel.green {
        color: #00ff00;
        transform: translate(0, 0);
    }

    .channel.blue {
        color: #0000ff;
        transform: translate(0, 0);
    }

    .text-wrapper:hover .channel.red {
        transform: translate(var(--red-translate), var(--red-translate));
        opacity: 0.9;
    }

    .text-wrapper:hover .channel.green {
        transform: translate(var(--green-translate), var(--green-translate));
        opacity: 0.9;
    }

    .text-wrapper:hover .channel.blue {
        transform: translate(var(--blue-translate), var(--blue-translate));
        opacity: 0.9;
    }

    .text-wrapper:hover .text {
        opacity: 0;
    }
</style>
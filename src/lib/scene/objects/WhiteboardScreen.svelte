<script lang="ts">
  import { onMount } from "svelte";
  import { Tween } from "svelte/motion";
  import { cubicOut, linear } from "svelte/easing";

  import { T } from "@threlte/core";
  import { CanvasTexture, DoubleSide } from "three";

  import rough from "roughjs";
  import * as s2r from "svg2roughjs";

  let { focused = false, width = 0.8, height = 1, ...rest } = $props();

  let fontsLoaded = false;

  async function loadFonts() {
    const font = new FontFace(
      "Cabin Sketch",
      "url(/fonts/Cabin_Sketch/CabinSketch-Regular.ttf)",
    );

    await font.load();
    document.fonts.add(font);
    fontsLoaded = true;
  }

  const globalOpacity = new Tween(0, { duration: 400, easing: cubicOut });
  const contentOpacity = new Tween(1, { duration: 250, easing: linear });
  const slideOpacity = $derived(globalOpacity.current * contentOpacity.current);

  $effect(() => {
    globalOpacity.target = focused ? 1 : 0;
  });

  let currentIndex = $state(0);
  let canvas = $state<HTMLCanvasElement>();
  let texture = $state<CanvasTexture>();
  let navCanvas = $state<HTMLCanvasElement>();
  let navTexture = $state<CanvasTexture>();

  let pageCanvas = $state<HTMLCanvasElement>();
  let pageTexture = $state<CanvasTexture>();

  const sketchCache = new Map<string, HTMLImageElement>();

  async function sketchSvgToImage(
    url: string,
    options?: {
      roughConfig?: Record<string, any>;
      seed?: number;
      width?: number;
      height?: number;
    },
  ): Promise<HTMLImageElement> {
    if (sketchCache.has(url)) {
      return sketchCache.get(url)!;
    }

    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Failed to fetch SVG");

    const svgText = await resp.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const sourceSvg = svgDoc.querySelector("svg") as SVGSVGElement | null;

    if (!sourceSvg) throw new Error("Invalid SVG");

    // ---- size resolution (SVG-correct) ----
    let width: number | undefined = options?.width;
    let height: number | undefined = options?.height;

    // 1. width/height attributes (if both present)
    if (width == null || height == null) {
      const attrWidth = parseFloat(sourceSvg.getAttribute("width") ?? "");
      const attrHeight = parseFloat(sourceSvg.getAttribute("height") ?? "");

      if (
        Number.isFinite(attrWidth) &&
        attrWidth > 0 &&
        Number.isFinite(attrHeight) &&
        attrHeight > 0
      ) {
        width ??= attrWidth;
        height ??= attrHeight;
      }
    }

    // 2. viewBox (only if still missing something)
    if (width == null || height == null) {
      const viewBox = sourceSvg.getAttribute("viewBox");
      if (viewBox) {
        const parts = viewBox.trim().split(/\s+/).map(Number);
        if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
          const [, , vbWidth, vbHeight] = parts;
          if (vbWidth > 0 && vbHeight > 0) {
            width ??= vbWidth;
            height ??= vbHeight;
          }
        }
      }
    }

    // 3. final fallback
    width ??= 512;
    height ??= 512;
    // -------------------------------------

    const outputSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );

    outputSvg.setAttribute("width", String(width));
    outputSvg.setAttribute("height", String(height));
    outputSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const converter = new s2r.Svg2Roughjs(
      outputSvg,
      s2r.OutputType.SVG,
      options?.roughConfig ?? {},
    );

    converter.svg = sourceSvg;
    converter.randomize = false;
    converter.seed = options?.seed ?? 42;

    const sketchedSvg = await converter.sketch(true);
    if (!sketchedSvg) throw new Error("Sketch failed");

    const svgString = new XMLSerializer().serializeToString(sketchedSvg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const objectUrl = URL.createObjectURL(blob);

    const img = new Image();
    img.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve();
      };
      img.onerror = reject;
    });

    sketchCache.set(url, img);
    return img;
  }

  function fillMultilineText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    lineHeight: number,
  ) {
    const lines = text.split("\n");

    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * lineHeight);
    });
  }

  type Section = {
    title: string;
    text: string;
    yPos: number;
  };

  type GenericSlideOptions = {
    logoPath: string;
    logoScale: number;
    logoY?: number;
    logoRoughConfig?: Record<string, any>;
    sections: Section[];
    techLogos?: string[];
  };

  async function drawGenericSlide(
    rc: any,
    w: number,
    h: number,
    ctx: CanvasRenderingContext2D,
    options: GenericSlideOptions,
  ) {
    // ---- Logo ----
    const logo = await sketchSvgToImage(options.logoPath, {
      roughConfig: options.logoRoughConfig,
    });

    const logoWidth = logo.width * options.logoScale;
    const logoHeight = logo.height * options.logoScale;
    const logoX = (w - logoWidth) / 2;
    const logoY = options.logoY ?? 170;

    ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

    // ---- Sections ----
    const margin = 20;
    ctx.textAlign = "left";
    ctx.fillStyle = "#000";

    for (const section of options.sections) {
      ctx.font = "bold 36px 'Cabin Sketch'";
      ctx.fillText(section.title, margin, h * section.yPos);

      ctx.font = "28px 'Cabin Sketch'";
      fillMultilineText(
        ctx,
        section.text,
        margin,
        h * (section.yPos + 0.04),
        32,
      );
    }

    // ---- Tech Stack Row (optional) ----
    if (options.techLogos?.length) {
      const targetHeight = 100;
      const gap = 50;
      let currentX = w / 2 - 275;
      const startY = h * 0.85;

      for (const logoPath of options.techLogos) {
        const img = await sketchSvgToImage(logoPath, {
          roughConfig: {
            roughness: 1,
            strokeWidth: 2,
            fillStyle: "solid",
            fillWeight: 5,
          },
        });

        const aspect = img.width / img.height;
        const drawWidth = targetHeight * aspect;

        ctx.drawImage(img, currentX, startY, drawWidth, targetHeight);
        currentX += drawWidth + gap;
      }
    }
  }

  const slides: {
    name: string;
    draw: (
      rc: any,
      w: number,
      h: number,
      ctx: CanvasRenderingContext2D,
    ) => Promise<void> | void;
  }[] = [
    // Timeline
    {
      name: "Career Timeline",
      draw: async (
        rc: any,
        w: number,
        h: number,
        ctx: CanvasRenderingContext2D,
      ) => {
        const items = [
          {
            title: "Freelance",
            date: "Jan 24 - Dec 24",
            desc: "Small independent contract\nwork across multiple\nlangauges for various clients.",
          },
          {
            title: "Fueld",
            date: "May 24 - Aug 24",
            desc: "Cross platform development\nfor an AI-based health app\nusing Ionic Capacitor.",
          },
          {
            title: "ASU",
            date: "Jul 25 - Present",
            desc: "Full stack website development\nand CRM integration using\nRAG systems and LLMs.",
          },
        ];

        const centerX = w / 2;
        const startY = h * 0.22;
        const gapY = 200;

        // --- vertical timeline line
        rc.line(
          centerX,
          startY - 40,
          centerX,
          startY + gapY * (items.length - 1) + 40,
          {
            stroke: "#000",
            strokeWidth: 3,
            roughness: 1.5,
          },
        );

        items.forEach((item, i) => {
          const y = startY + i * gapY;
          const isLeft = i % 2 === 0;

          const boxWidth = 350;
          const boxHeight = 200;

          const connector = 40;

          const contentX = isLeft ? centerX - connector : centerX + connector;

          // --- dot
          rc.circle(centerX, y, 32, {
            fill: "#fff",
            stroke: "#000",
            strokeWidth: 3,
            fillStyle: "solid",
          });

          // --- connector
          rc.line(
            isLeft ? centerX - 16 : centerX + 16,
            y,
            isLeft ? centerX - connector : centerX + connector,
            y,
            {
              stroke: "#000",
              roughness: 1.2,
              strokeWidth: 3,
            },
          );

          // --- content box
          rc.rectangle(
            isLeft ? contentX - boxWidth : contentX,
            y - boxHeight / 2,
            boxWidth,
            boxHeight,
            {
              fill: "#f5f5f5",
              fillStyle: "zigzag",
              roughness: 1.5,
              strokeWidth: 2,
              strokeGap: 2,
            },
          );

          const descX = isLeft ? contentX - boxWidth + 15 : contentX + 15;
          const titleY = y - boxHeight / 2 + 40;

          ctx.textAlign = "left";
          ctx.fillStyle = "#000";

          ctx.font = "bold 28px 'Cabin Sketch'";
          ctx.fillText(`${item.title} (${item.date})`, descX, titleY);

          ctx.font = "24px 'Cabin Sketch'";
          fillMultilineText(ctx, item.desc, descX, titleY + 40, 30);
        });
      },
    },

    // ASU
    {
      name: "Full-Stack\nSoftware Development",
      draw: async (rc, w, h, ctx) => {
        await drawGenericSlide(rc, w, h, ctx, {
          logoPath: "/asu-logo.svg",
          logoScale: 1.6,
          logoY: 200,
          sections: [
            {
              title: "Platform & Architecture",
              text:
                "• Designed and built internal web tools end-to-end\n" +
                "• Integrated directly with Monday's CRM tool",
              yPos: 0.4,
            },
            {
              title: "AI & Automation",
              text:
                "• Built RAG-powered contract analysis using LLMs\n" +
                "• Automated notice ingestion pipelines with public APIs",
              yPos: 0.55,
            },
            {
              title: "Governance & Readiness",
              text:
                "• Security-first design using OAuth 2.0 authentication\n" +
                "• Futureproofed architecture for handling sensitive data",
              yPos: 0.7,
            },
          ],
          techLogos: [
            "/openai-icon.svg",
            "/firebase-icon.svg",
            "/monday-icon.svg",
            "/react-icon.svg",
          ],
        });
      },
    },

    // Fueld
    {
      name: "Cross-Platform\nSoftware Development",
      draw: async (rc, w, h, ctx) => {
        await drawGenericSlide(rc, w, h, ctx, {
          logoPath: "/fueld-logo.svg",
          logoScale: 0.45,
          logoY: 200,
          logoRoughConfig: {
            roughness: 2.5,
            strokeWidth: 8,
            fillStyle: "zigzag",
            fillWeight: 7,
            hachureGap: 12,
            hachureAngle: 34,
            fixedDecimalPlaceDigits: 3,
          },
          sections: [
            {
              title: "Core Achievements",
              text:
                "• Refactored and optimized uploads: ~10s to ~1s latency\n" +
                "• Developed and maintained using Firebase cloud functions",
              yPos: 0.4,
            },
            {
              title: "Analytics",
              text:
                "• Built Retool dashboards for tracking stickiness & activity\n" +
                "• Automated user activation via SendGrid & CRON Scheduling",
              yPos: 0.55,
            },
            {
              title: "Architecture",
              text:
                "• Designed and implemented a real-time user sharing system.\n" +
                "• Developed and optimized NoSQL database schema.",
              yPos: 0.7,
            },
          ],
          techLogos: [
            "/ionic-capacitor-icon.svg",
            "/typescript-icon.svg",
            "/firebase-icon.svg",
            "/sendgrid-icon.svg",
          ],
        });
      },
    },

    // Freelance
    {
      name: "Freelance\nQuick-Build Tools",
      draw: async (rc, w, h, ctx) => {
        // --- Coffee icon ---
        const coffee = await sketchSvgToImage("/cup-of-coffee.svg", {
          roughConfig: {
            roughness: 2.5,
            strokeWidth: 3,
            fillStyle: "cross-hatch",
            fillWeight: 8,
            hachureGap: 15,
          },
        });

        const coffeeScale = 0.28;
        const cw = coffee.width * coffeeScale;
        const ch = coffee.height * coffeeScale;

        ctx.drawImage(coffee, w / 2 - cw / 2, h * 0.18, cw, ch);

        // --- Grid setup ---
        const noteW = 350;
        const noteH = 170;
        const gapX = 40;
        const gapY = 35;

        const gridTop = h * 0.45;
        const gridLeft = w / 2 - noteW - gapX / 2;

        const notes = [
          {
            title: "Who",
            text: "Friends, family, small teams\nanyone who needed\nsomething quickly.",
          },
          {
            title: "What",
            text: "Internal tools, automations,\nzippy APIs and lightweight\nbackends.",
          },
          {
            title: "How",
            text: "Minimal overhead,\nno over-engineering,\nend-to-end ownership.",
          },
          {
            title: "Why it worked",
            text: "Fast feedback, real users,\nand problems that actually\nmattered.",
          },
        ];

        ctx.textAlign = "left";
        ctx.fillStyle = "#000";

        notes.forEach((note, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);

          const x = gridLeft + col * (noteW + gapX);
          const y = gridTop + row * (noteH + gapY);

          // --- Note background ---
          rc.rectangle(x, y, noteW, noteH, {
            fill: "#fdf4c7",
            fillStyle: "solid",
            roughness: 1.7,
            strokeWidth: 2,
            strokeGap: 2,
          });

          // --- Text ---
          ctx.font = "bold 28px 'Cabin Sketch'";
          ctx.fillText(note.title, x + 14, y + 36);

          ctx.font = "24px 'Cabin Sketch'";
          fillMultilineText(ctx, note.text, x + 14, y + 68, 26);
        });

        // --- Closing line ---
        ctx.textAlign = "center";
        ctx.font = "26px 'Cabin Sketch'";
        ctx.fillText(
          "Built quickly, because people trusted me to just get it done.",
          w / 2,
          h * 0.90,
        );
      },
    },
  ];

  async function updateMainCanvas() {
    if (!fontsLoaded) {
      await loadFonts();
    }

    if (!canvas || !texture) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rc = rough.canvas(canvas);

    ctx.fillStyle = "black";
    ctx.font = "64px 'Cabin Sketch'";
    ctx.textAlign = "center";
    fillMultilineText(ctx, slides[currentIndex].name, canvas.width / 2, 60, 80);

    await slides[currentIndex].draw(rc, canvas.width, canvas.height, ctx);
    texture.needsUpdate = true;
    drawPagination();
  }

  const drawArrows = () => {
    if (!navCanvas || !navTexture) return;
    const ctx = navCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, 100, 100);

    const rc = rough.canvas(navCanvas);
    rc.linearPath(
      [
        [20, 50],
        [80, 50],
        [60, 30],
        [80, 50],
        [60, 70],
      ],
      { stroke: "black", strokeWidth: 4, roughness: 1.5 },
    );

    navTexture.needsUpdate = true;
  };

  const drawPagination = () => {
    if (!pageCanvas || !pageTexture) return;

    const ctx = pageCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);

    const rc = rough.canvas(pageCanvas);

    const count = slides.length;
    const spacing = 40;
    const radius = 10;

    const totalWidth = (count - 1) * spacing;
    const startX = pageCanvas.width / 2 - totalWidth / 2;
    const y = pageCanvas.height / 2;

    for (let i = 0; i < count; i++) {
      const x = startX + i * spacing;

      rc.circle(x, y, radius * 2, {
        fill: i === currentIndex ? "#000" : "transparent",
        fillStyle: "solid",
        stroke: "#000",
        strokeWidth: 2,
        roughness: 1.4,
      });
    }

    pageTexture.needsUpdate = true;
  };

  async function changeSlide(next: boolean) {
    if (contentOpacity.current < 1) return;

    await contentOpacity.set(0);
    currentIndex = next
      ? (currentIndex + 1) % slides.length
      : (currentIndex - 1 + slides.length) % slides.length;

    await updateMainCanvas();
    await contentOpacity.set(1);
  }

  onMount(() => {
    if (canvas && navCanvas && pageCanvas) {
      texture = new CanvasTexture(canvas);
      navTexture = new CanvasTexture(navCanvas);
      pageTexture = new CanvasTexture(pageCanvas);

      updateMainCanvas();
      drawArrows();
    }
  });
</script>

<canvas bind:this={canvas} width="800" height="1000" style="hidden"></canvas>
<canvas bind:this={pageCanvas} width="300" height="80" style="hidden"></canvas>
<canvas bind:this={navCanvas} width="100" height="100" style="hidden"></canvas>

{#if texture && navTexture}
  <T.Group {...rest} visible={globalOpacity.current > 0}>
    <T.Mesh rotation.y={Math.PI}>
      <T.PlaneGeometry args={[width, height]} />
      <T.MeshBasicMaterial
        side={DoubleSide}
        transparent
        opacity={slideOpacity}
        map={texture}
      />
    </T.Mesh>

    <T.Mesh
      position={[width / 3, -height / 2 - 0.07, 0]}
      onclick={(e: any) => focused && (e.stopPropagation(), changeSlide(false))}
    >
      <T.PlaneGeometry args={[0.15, 0.15]} />
      <T.MeshBasicMaterial
        map={navTexture}
        side={DoubleSide}
        transparent
        opacity={globalOpacity.current}
      />
    </T.Mesh>

    <T.Mesh position={[0, -height / 2 - 0.07, 0]} rotation.z={Math.PI}>
      <T.PlaneGeometry args={[0.35, 0.08]} />
      <T.MeshBasicMaterial
        map={pageTexture}
        side={DoubleSide}
        transparent
        opacity={globalOpacity.current}
      />
    </T.Mesh>

    <T.Mesh
      position={[-width / 3, -height / 2 - 0.07, 0]}
      rotation.z={Math.PI}
      onclick={(e: any) => focused && (e.stopPropagation(), changeSlide(true))}
    >
      <T.PlaneGeometry args={[0.15, 0.15]} />
      <T.MeshBasicMaterial
        map={navTexture}
        side={DoubleSide}
        transparent
        opacity={globalOpacity.current}
      />
    </T.Mesh>
  </T.Group>
{/if}

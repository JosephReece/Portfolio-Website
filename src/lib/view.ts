import { writable } from 'svelte/store'

// home is the overview of the whole scene
export type View = 'home' | 'projects' | 'work' | 'education-1' | 'education-2' | 'technical-skills' | 'about-me' | 'contact' | 'hobbies';
export const currentView = writable<View>('home');

export const lightOn = writable<boolean>(true);

type Vector = [number, number, number];
export const cameraConfigs: Record<View, { position: Vector; rotation: Vector }> = {
    "home": { position: [-1.5, 1.4, 2.4], rotation: [0, -0.5, 0] },
    "education-1": { position: [-0.9, 1.1, 1], rotation: [0, 0, 0] },
    "education-2": { position: [-0.9, 1.55, 1], rotation: [0, 0, 0] },
    "projects": { position: [0, 1.3, 1], rotation: [0, 0, 0] },
    "work": { position: [0.6, 2.4, 0.2], rotation: [- Math.PI / 2, 0, 0] },
    "hobbies": { position: [0.3, 1.9, 1], rotation: [0, 0, 0] },
};
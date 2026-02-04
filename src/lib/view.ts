import { writable } from 'svelte/store'

// home is the overview of the whole scene
export type Vector = [number, number, number];
export type View = 'home' | 'projects' | 'careers' | 'education' | 'contact' | 'hobbies'; // 'technical-skills' | 'about-me'

export const OFFICE_PATH = "/3D voxel Office pack/glb";
export const CHESS_PATH = "/3D voxel Chess pack/glb";

export const loadingProgress = writable<number>(0);

export const currentView = writable<View>('home');
export const lightOn = writable<boolean>(true);

export const groupings: Record<View, { label: string, position: Vector; target: Vector }> = {
    home: {
        label: "Home",
        position: [8.5, 3, 8.5],
        target: [2.4, 0.5, 2.4], // center of the room
    },

    education: {
        label: "Education",
        position: [2, 1.2, 4.5],
        target: [-1, 1.2, 4.5], // bookshelf
    },

    projects: {
        label: "Projects",
        position: [1.5, 1.5, 0.2],
        target: [2, 1.1, -0.7], // desk
    },

    careers: {
        label: "Careers",
        position: [0, 1.5, 1.2],
        target: [0, 1.5, 0.2], // whiteboard
    },

    hobbies: {
        label: "Hobbies",
        position: [5.3, 2, 1],
        target: [4.2, 0.9, -0.9], // shelf
    },

    contact: {
        label: "Contact",
        position: [1.8, 1.6, 5],
        target: [3.5, 0.9, 4], // seating area
    },
};
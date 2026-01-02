import { writable } from 'svelte/store'

// home is the overview of the whole scene
export type View = 'home' | 'projects' | 'careers' | 'education' | 'contact' | 'hobbies'; // 'technical-skills' | 'about-me'
export type Vector = [number, number, number];

export const currentView = writable<View>('home');

export const lightOn = writable<boolean>(true);

export const viewLabels: { value: View; label: string }[] = [
    { value: "home", label: "Home" },
    { value: "projects", label: "Projects" },
    { value: "careers", label: "Careers" },
    { value: "education", label: "Education" },
    { value: "hobbies", label: "Hobbies" },
    { value: "contact", label: "Contact" },
];

export const cameraConfigs: Record<
    View,
    { position: Vector; target: Vector }
> = {
    home: {
        position: [8.5, 3, 8.5],
        target: [2.4, 0.5, 2.4], // center of the room
    },

    education: {
        position: [2, 1.2, 4.5],
        target: [-1, 1.2, 4.5], // bookshelf
    },

    projects: {
        position: [1.5, 1.5, 0.2],
        target: [2, 1.1, -0.7], // desk
    },

    careers: {
        position: [0, 1.4, 2.2],
        target: [0, 1.4, 0.2], // whiteboard
    },

    hobbies: {
        position: [5.3, 1, 1],
        target: [4.2, 0.9, -0.9], // shelf
    },

    contact: {
        position: [1.8, 1.6, 5],
        target: [3.5, 0.9, 4], // seating area
    },
};
export interface Project {
    title: string;
    shortDescription: string;
    longDescription: string;
    tags: string[];
    thumbnail: string;
}

export const projects: Record<string, Project> = {
    "flash-messaging": {
        title: "Flash Messaging",
        shortDescription: "A lightweight windows application for messaging locally on a network.",
        longDescription: `
            This app was designed as an introductory project to familiarise myself 
            with simple cryptography concepts including Diffie-Hellman key exchange and XOR encryption. 
            The focus was on building a simple app with clean, structured code.
        `,
        tags: ["Visual Basic .NET"],
        thumbnail: "https://picsum.photos/seed/projectAlpha/400/300",
    },
    "soar-learning": {
        title: "Soar Learning",
        shortDescription: `
            An education platform designed for student pilots to learn
            the five mandatory theoretical tests to get their microlight license.
        `,
        longDescription: `
            Built using Ionic React, this application was deployed to web, iOS and Android. 
            It provides an engaging and interactive learning environment for student pilots. 
            Key features include progress tracking, setting personal goals, quizzes, flashcards, and interactive lessons covering all necessary content. 
            Users can purchase course content as an in-app purchase via Stripe integration. 
            Firebase/Google Cloud was used to manage user authentication, database services, storage, analytics and more. 
            The app's design emphasises simplicity and user engagement, making learning streamlined and efficient.
        `,
        tags: ["React", "Node.js", "Ionic", "Stripe", "Firebase", "Google Cloud"],
        thumbnail: "https://picsum.photos/seed/projectBeta/400/300",
    },
};
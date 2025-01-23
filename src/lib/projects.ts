export interface Project {
    title: string;
    shortDescription: string;
    longDescription: string;
    tags: string[];
    thumbnail: string; // URL to the project's thumbnail image
}

export const projects: Record<string, Project> = {
    "flash-messaging": {
        title: "Flash Messaging",
        shortDescription: "A lightweight windows application for messaging locally on a network.",
        longDescription: `
            This app was designed as an introductory project to familiarise myself 
            with simple cryptography concepts including Diffie-Hellman key exchange and XOR encryption. 
            The focus was on building an app with clean, structured code 
            that was optimised for performance.
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
    projectGamma: {
        title: "Project Gamma",
        shortDescription: "A full-stack e-commerce application.",
        longDescription: `
            Project Gamma was a comprehensive full-stack development project. 
            I developed an e-commerce platform with features like user authentication, 
            product search, and a checkout system. The frontend was built with React, 
            and the backend included Node.js, Express, and a PostgreSQL database. 
            This project helped me integrate complex systems effectively.
        `,
        tags: ["React", "Node.js", "Express", "PostgreSQL", "Authentication"],
        thumbnail: "https://picsum.photos/seed/projectGamma/400/300",
    },
    projectDelta: {
        title: "Project Delta",
        shortDescription: "A machine learning project using Python.",
        longDescription: `
            Project Delta focused on data science and machine learning. 
            I implemented a predictive model to forecast stock market trends using 
            historical data. Libraries like Pandas, NumPy, and Scikit-learn were used 
            extensively, and visualisations were created with Matplotlib.
        `,
        tags: ["Python", "Machine Learning", "Pandas", "NumPy", "Scikit-learn"],
        thumbnail: "https://picsum.photos/seed/projectDelta/400/300",
    },
    projectEpsilon: {
        title: "Project Epsilon",
        shortDescription: "A mobile application for task management.",
        longDescription: `
            Project Epsilon was my first foray into mobile app development. 
            I created a cross-platform task management app using Flutter. 
            It featured a user-friendly interface, notifications, and cloud sync functionality. 
            This project allowed me to explore the world of mobile UI/UX design.
        `,
        tags: ["Flutter", "Dart", "Mobile Development", "UI/UX Design"],
        thumbnail: "https://picsum.photos/seed/projectEpsilon/400/300",
    },
};
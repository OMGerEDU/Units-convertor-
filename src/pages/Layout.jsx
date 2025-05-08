
import React from 'react';

export default function Layout({ children }) {
  return (
    <>
      {/* Add global styles for accessibility features */}
      <style jsx global>{`
        :root {
          --background: 0 0% 98%;
          --foreground: 222.2 84% 4.9%;
          --primary: 245 79% 52%;
          --primary-foreground: 210 40% 98%;
          --secondary: 240 60% 99.0%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 240 4.8% 95.9%;
          --muted-foreground: 240 3.8% 46.1%;
          --accent: 240 4.8% 95.9%;
          --accent-foreground: 240 5.9% 10%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --border: 240 5.9% 90%;
          --input: 240 5.9% 90%;
          --ring: 245 79% 52%;
          --radius: 0.5rem;
        }

        .dark {
          --background: 240 10% 3.9%;
          --foreground: 0 0% 98%;
          --primary: 245 79% 52%;
          --primary-foreground: 210 40% 98%;
          --secondary: 222.2 47.4% 11.2%;
          --secondary-foreground: 210 40% 98%;
          --muted: 240 3.7% 15.9%;
          --muted-foreground: 240 5% 64.9%;
          --accent: 240 3.7% 15.9%;
          --accent-foreground: 0 0% 98%;
          --card: 240 10% 3.9%;
          --card-foreground: 0 0% 98%;
          --border: 240 3.7% 15.9%;
          --input: 240 3.7% 15.9%;
          --ring: 245 79% 52%;
        }

        .high-contrast {
          --background: 0 0% 100%;
          --foreground: 0 0% 0%;
          --primary: 245 100% 50%;
          --primary-foreground: 0 0% 100%;
          --secondary: 0 0% 95%;
          --secondary-foreground: 0 0% 0%;
          --card: 0 0% 100%;
          --card-foreground: 0 0% 0%;
          --border: 0 0% 0%;
          --input: 0 0% 0%;
        }

        .dark.high-contrast {
          --background: 0 0% 0%;
          --foreground: 0 0% 100%;
          --primary: 245 100% 60%;
          --primary-foreground: 0 0% 100%;
          --secondary: 0 0% 10%;
          --secondary-foreground: 0 0% 100%;
          --card: 0 0% 0%;
          --card-foreground: 0 0% 100%;
          --border: 0 0% 100%;
          --input: 0 0% 100%;
        }
          
        /* Focus outlines */
        .focus-visible :focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
          
        /* Large cursor */
        .large-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z'/%3E%3Cpath d='m13 13 6 6'/%3E%3C/svg%3E") 0 0, auto !important;
        }
          
        .dark.large-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z'/%3E%3Cpath d='m13 13 6 6'/%3E%3C/svg%3E") 0 0, auto !important;
        }
          
        /* Link highlighting */
        .highlight-links a {
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 2px;
        }
          
        /* Reduced motion */
        .reduce-motion * {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
          
        /* RTL support */
        [dir="rtl"] .rtl-flip {
          transform: scaleX(-1);
        }
      `}</style>
      
      {children}
    </>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from '../components/ReduxProvider';

export const metadata: Metadata = {
  title: "My Learning Platform",
  description: "Upload documents and generate flashcards and quizzes for effective learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

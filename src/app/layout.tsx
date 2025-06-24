
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { ChatProvider } from '@/components/chat/ChatProvider'; // Updated path
import { ChatWidget } from '@/components/chat/ChatWidget';     // Updated path
import { FloatingButton } from '@/components/chat/FloatingButton'; // Updated path
import './globals.css';
import CanvasFlow from '@/components/canvas';

export const metadata: Metadata = {
  title: 'Sketric Assistant',
  description: 'AI-powered chat assistant with real-time streaming by Sketric.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <CanvasFlow />
        <ChatProvider 
          endpoint="/api/chat-sse"
          agent="sketric_agent"
        >
          <div className="flex-grow">{children}</div>
          {/* ChatWidget will handle its own visibility based on context and fullScreen prop */}
          {/* It will be a Dialog triggered by FloatingButton or render fullScreen */}
          <ChatWidget /> 
          {/* FloatingButton should only render if ChatWidget is not in fullScreen mode */}
          {/* This logic can be inside FloatingButton or controlled by ChatWidget's fullScreen prop */}
          <FloatingButton />
        </ChatProvider>
        <Toaster />
      </body>
    </html>
  );
}


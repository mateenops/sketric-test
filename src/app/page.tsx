
// 'use client'; // No longer needed here as ChatProvider is in layout

// Chat functionality is now primarily handled by components in RootLayout.
// This page can render specific page content or serve as a placeholder.

export default function HomePage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Sketric</h1>
        <p className="text-lg text-muted-foreground">
          Your AI assistant is ready to help. Click the chat icon to get started!
        </p>
        {/* Example of how a page might use the fullScreen chat widget if needed on a specific route */}
        {/* This would typically be on a dedicated /embed route as per the spec */}
        {/* <div className="mt-8 w-full max-w-3xl h-[600px] border rounded-lg shadow-lg">
          <ChatProvider endpoint="/api/chat-sse" agent="sketric_agent">
            <ChatWidget fullScreen />
          </ChatProvider>
        </div> */}
      </div>
    </main>
  );
}

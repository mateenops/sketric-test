# **App Name**: Sketric AI Assistant

## Core Features:

- Chat Provider: Provides a React context (`ChatProvider`) to manage the EventSource connection and chat state, including messages and streaming status.
- Chat Window: Displays messages and action cards, using Tailwind CSS for styling. Scrolls to bottom to always show the latest assistant messages.
- Message: Renders individual chat bubbles, alternating styles for user and assistant messages.
- Action Card: Displays the action card based on data from the `CUSTOM / ACTION_EXECUTION` event.
- Typing Indicator: Toggles a typing indicator while streaming assistant tokens from EventSource (`RUN_STARTED` to `RUN_FINISHED`).

## Style Guidelines:

- Primary color: #7C3AED (Sketric purple)
- Secondary color: Light purple tints and white
- Body and headline font: 'Open Sans', chosen for its readability and modern, friendly appearance.
- Use icons that mirror the logo's clean, geometric style, with a focus on simplicity and clarity.
- Maintain a spacious and organized layout, utilizing the golden ratio to create a visually balanced and harmonious interface.
- Incorporate smooth, subtle animations for transitions and loading states, enhancing the user experience without being distracting.
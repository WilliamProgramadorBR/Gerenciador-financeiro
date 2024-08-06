// index.tsx (ou main.tsx)
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './hooks/theme';
import { AuthProvider } from './hooks/auth'; // Verifique o caminho
import App from './App'; // Certifique-se de que `App` é importado corretamente

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

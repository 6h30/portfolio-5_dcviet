// components/Terminal.tsx
'use client'; // Nếu dùng Next.js App Router

import { useState } from 'react';
import { ThemeStyles } from 'app/lib/theme'; 
import Field from './field';

interface TerminalProps {
  theme: ThemeStyles;
  setTheme: (theme: 'dark' | 'light') => void;
}

export default function Terminal({ theme, setTheme }: TerminalProps) {
    //   return (
  const [maximized, setMaximized] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('Portfolio Terminal');

  const handleClose = () => {
    window.location.href = '';
  };

  const handleMinMax = () => {
    setMaximized((prev) => !prev);
    const field = document.querySelector('#field') as HTMLInputElement | null;
    field?.focus(); // Optional chaining để tránh lỗi nếu #field không tồn tại
  };

  return (
    <div
      id="terminal"
      style={
        maximized
          ? { height: '100vh', width: '100vw', maxWidth: '100vw' }
          : theme.terminal
      }
    >
      <div id="window" style={theme.window}>
        <button className="btn red" onClick={handleClose} />
        <button id="useless-btn" className="btn yellow" />
        <button className="btn green" onClick={handleMinMax} />
        <span id="title" style={{ color: theme.window.color }}>
          {title}
        </span>
      </div>
      <Field theme={theme} setTheme={setTheme} setTitle={setTitle} />
    </div>
  );
}

'use client';
import { useState } from 'react';
import Terminal from 'app/components/terminal';
import { themes } from 'app/lib/theme';

export const metadata = {
    title: 'Terminal',
    description: 'View Terminal.',
}

export default function Page() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark'); // Type cho theme
    const themeVars = themes[theme];

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <section>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">View Terminal</h1>
            <div id="app" style={themeVars.app}>
                <Terminal theme={themeVars} setTheme={setTheme} toggleTheme={toggleTheme} />
            </div>
        </section>
    )
}


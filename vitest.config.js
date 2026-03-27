import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/**/*.test.js'],
        pool: 'forks',                    // 对 Node 18 更友好
        deps: {
            inline: ['axios', 'chalk', 'ora'],
        },
    },
});
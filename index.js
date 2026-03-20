#!/usr/bin/env node

import { program } from 'commander';
import { createRequire } from 'module';
import { search } from './lib/fetcher.js';
import { display } from './lib/display.js';
import { clearCache } from './lib/cache.js';
import ora from 'ora';
import chalk from 'chalk';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

program
    .name('jav')
    .description('AV番号命令行查询工具')
    .version(pkg.version, '-v, --version')
    .argument('[番号]', '要查询的番号，例如: SSIS-001')
    .option('-r, --raw', '显示原始详细数据')
    .option('--clear-cache', '清空本地缓存')
    .action(async (id, options) => {

        if (options.clearCache) {
            clearCache();
            process.exit(0);
        }

        if (!id) {
            program.help();
            process.exit(0);
        }

        const spinner = ora(`正在查询 ${id.toUpperCase()} ...`).start();

        try {
            const result = await search(id.toUpperCase());
            spinner.stop();

            if (!result) {
                console.log(chalk.red(`\n未找到番号: ${id.toUpperCase()}`));
                process.exit(1);
            }

            display(result, options.raw);
        } catch (err) {
            spinner.stop();
            console.error('\n查询失败:', err.message);
            process.exit(1);
        }
    });

program.parse();
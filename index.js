#!/usr/bin/env node

import { createInterface } from 'readline';
import { program } from 'commander';
import { createRequire } from 'module';
import { search } from './lib/fetcher.js';
import { display } from './lib/display.js';
import { clearCache, setConfig } from './lib/cache.js';
import ora from 'ora';
import chalk from 'chalk';
import { getLang } from './lib/i18n.js';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

program
    .name('jav')
    .description('AV番号命令行查询工具')
    .version(pkg.version, '-v, --version')
    .argument('[番号]', '要查询的番号，例如: SSIS-001')
    .option('-r, --raw', '显示原始详细数据')
    .option('--clear-cache', '清空本地缓存')
    .option('--setup', '配置JAVDB Cookie（可选，提高查询覆盖率）')
    .option('-l, --lang <lang>', '显示语言 zh/en/jp/kr/de', 'zh')
    .action(async (id, options) => {

        const lang = options.lang || 'zh';
        const t = getLang(lang);   // 统一获取语言包

        if (options.setup) {
            console.log('');
            console.log(chalk.yellow('=== ' + (t.setupTitle || '配置 JAVDB Cookie（可选）') + ' ==='));
            console.log('');
            console.log(t.setupDesc || '不配置也可以正常使用，配置后覆盖率更高。');
            console.log('');
            console.log(t.setupSteps || '获取步骤：');
            console.log('  1. ' + (t.setupStep1 || 'Chrome 打开 https://javdb.com 并登录账号'));
            console.log('  2. ' + (t.setupStep2 || '安装插件 "Get cookies.txt LOCALLY"'));
            console.log('  3. ' + (t.setupStep3 || '导出 Cookie 文件，找到 _jdb_session 那行'));
            console.log('  4. ' + (t.setupStep4 || '复制最后一列的值粘贴到下面'));
            console.log('');

            const rl = createInterface({ input: process.stdin, output: process.stdout });
            await new Promise((resolve) => {
                rl.question(chalk.cyan((t.setupPrompt || '请粘贴 _jdb_session 的值（直接回车跳过）: ')), (session) => {
                    rl.close();
                    if (!session.trim()) {
                        console.log(chalk.gray('\n' + (t.setupSkipped || '已跳过，使用 JAVBUS + JavLibrary 作为数据源。')));
                    } else {
                        setConfig({ session: session.trim() });
                        console.log(chalk.green('\n✅ ' + (t.setupSuccess || '配置保存成功！')));
                        console.log(chalk.gray((t.setupSavePath || '保存位置: ~/.config/javinfo/config.json')));
                    }
                    console.log('');
                    resolve();
                });
            });
            process.exit(0);
        }

        if (options.clearCache) {
            clearCache(lang);
            process.exit(0);
        }

        if (!id) {
            program.help();
            process.exit(0);
        }

        const spinner = ora(`${t.searching} ${id.toUpperCase()} ...`).start();

        try {
            const result = await search(id.toUpperCase(), lang);
            spinner.stop();

            if (!result) {
                console.log(chalk.red(`\n${t.notFound}: ${id.toUpperCase()}`));
                // Windows 用户提示
                if (process.platform === 'win32') {
                    process.stderr.write(chalk.gray(`  ${t.windowsHint}\n`));
                }
                process.exit(1);
            }

            display(result, options.raw, lang);
        } catch (err) {
            spinner.stop();
            console.error(`\n${t.queryFailed}:`, err.message);
            process.exit(1);
        }
    });

program.parse();
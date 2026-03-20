import chalk from 'chalk';

const DIVIDER = chalk.gray('─'.repeat(60));

function row(label, value, color = chalk.white) {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    const paddedLabel = chalk.cyan(label.padEnd(8, '　')); // 用全角空格对齐中文
    console.log(`  ${paddedLabel}  ${color(value)}`);
}

export function display(info, raw = false) {
    if (raw) {
        console.log(JSON.stringify(info, null, 2));
        return;
    }

    console.log('');
    console.log(DIVIDER);
    console.log(
        '  ' +
        chalk.bold.yellow('🎬  ') +
        chalk.bold.white(info.id) +
        (info.score ? chalk.yellow(`  ⭐ ${info.score}`) : '')
    );

    if (info.title) {
        console.log('  ' + chalk.gray(info.title));
    }

    console.log(DIVIDER);

    row('女优', info.actresses.join(' / '), chalk.magenta);
    row('男优', info.actors.join(' / '), chalk.blue);
    row('发售日期', info.releaseDate, chalk.green);
    row('时长', info.duration);
    row('制作商', info.studio, chalk.yellow);
    row('发行商', info.label);
    row('导演', info.director);
    row('系列', info.series);

    if (info.tags.length > 0) {
        const tagStr = info.tags.map(t => chalk.bgGray(` ${t} `)).join(' ');
        console.log('  ' + chalk.cyan('类别　　') + '  ' + tagStr);
    }

    if (info.coverUrl) {
        console.log('');
        console.log('  ' + chalk.cyan('封面　　') + '  ' + chalk.underline.gray(info.coverUrl));
    }

    console.log(DIVIDER);
    console.log('');
}
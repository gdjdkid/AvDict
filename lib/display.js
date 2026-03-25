import chalk from 'chalk';
import { getLang } from './i18n.js';

const DIVIDER = chalk.gray('─'.repeat(60));

function row(label, value, color = chalk.white) {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    const paddedLabel = chalk.cyan(label.padEnd(8, '　'));
    console.log(`  ${paddedLabel}  ${color(value)}`);
}

export function display(info, raw = false, lang = 'zh') {
    if (raw) {
        console.log(JSON.stringify(info, null, 2));
        return;
    }

    const t = getLang(lang);

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

    row(t.actress, info.actresses.join(' / '), chalk.magenta);
    row(t.actor, info.actors.join(' / '), chalk.blue);
    row(t.releaseDate, info.releaseDate, chalk.green);
    row(t.duration, info.duration);
    row(t.studio, info.studio, chalk.yellow);
    row(t.label, info.label);
    row(t.director, info.director);
    row(t.series, info.series);
    row(t.rating, info.score ? `${info.score}${info.scoreCount ? `(${info.scoreCount})` : ''}` : '', chalk.yellow);
    row(t.wishlist, info.wantCount ? `${info.wantCount}` : '', chalk.cyan);

    if (info.tags.length > 0) {
        const tagStr = info.tags.map(tag => chalk.bgGray(` ${tag} `)).join(' ');
        console.log('  ' + chalk.cyan(t.tags.padEnd(8, '　')) + '  ' + tagStr);
    }

    if (info.coverUrl) {
        console.log('');
        console.log('  ' + chalk.cyan(t.cover.padEnd(8, '　')) + '  ' + chalk.underline.gray(info.coverUrl));
    }

    if (info.source) {
        console.log('  ' + chalk.gray(`${t.source}: ${info.source}`));
    }

    console.log(DIVIDER);
    console.log('');
}
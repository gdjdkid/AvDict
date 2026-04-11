import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { getLang } from './i18n.js';

// 缓存文件存放在用户主目录下，和 yddict 的做法一致
const CACHE_DIR = join(homedir(), '.config', 'javinfo');
const CACHE_FILE = join(CACHE_DIR, 'cache.json');

// 缓存有效期：7 天（单位毫秒）
const TTL = 7 * 24 * 60 * 60 * 1000;

function getCacheKey(id, source = 'auto') {
    const normalizedSource = (source || 'auto').toLowerCase();
    return normalizedSource === 'auto' ? id : `${normalizedSource}:${id}`;
}

function loadCache() {
    if (!existsSync(CACHE_FILE)) return {};
    try {
        return JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    } catch {
        return {};
    }
}

function saveCache(data) {
    if (!existsSync(CACHE_DIR)) {
        mkdirSync(CACHE_DIR, { recursive: true });
    }
    writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getCache(id, source = 'auto') {
    const cache = loadCache();
    const entry = cache[getCacheKey(id, source)];
    if (!entry) return null;

    const isExpired = Date.now() - entry.cachedAt > TTL;
    if (isExpired) return null;

    return entry.data;
}

export function setCache(id, data, source = 'auto') {
    const cache = loadCache();
    cache[getCacheKey(id, source)] = {
        cachedAt: Date.now(),
        data,
    };
    saveCache(cache);
}

// 清空缓存（已支持多语言）
export function clearCache(lang = 'zh') {
    const t = getLang(lang);

    try {
        if (existsSync(CACHE_FILE)) {
            writeFileSync(CACHE_FILE, '{}', 'utf-8');
            console.log(t.cacheCleared);
        } else {
            console.log(t.cacheCleared);
        }
    } catch (err) {
        console.error(`${t.cacheClearFailed}: ${err.message}`);
        console.error(`${t.cachePath}: ${CACHE_FILE}`);
    }
}

export function getConfig() {
    const configFile = join(CACHE_DIR, 'config.json');
    if (!existsSync(configFile)) return {};
    try {
        return JSON.parse(readFileSync(configFile, 'utf-8'));
    } catch {
        return {};
    }
}

export function setConfig(data) {
    if (!existsSync(CACHE_DIR)) {
        mkdirSync(CACHE_DIR, { recursive: true });
    }
    const configFile = join(CACHE_DIR, 'config.json');
    writeFileSync(configFile, JSON.stringify(data, null, 2), 'utf-8');
}

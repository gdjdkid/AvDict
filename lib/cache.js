import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// 缓存文件存放在用户主目录下，和 yddict 的做法一致
const CACHE_DIR = join(homedir(), '.config', 'javinfo');
const CACHE_FILE = join(CACHE_DIR, 'cache.json');

// 缓存有效期：7 天（单位毫秒）
const TTL = 7 * 24 * 60 * 60 * 1000;

function loadCache() {
    if (!existsSync(CACHE_FILE)) return {};
    try {
        return JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    } catch {
        // 文件损坏就当缓存不存在
        return {};
    }
}

function saveCache(data) {
    if (!existsSync(CACHE_DIR)) {
        mkdirSync(CACHE_DIR, { recursive: true });
    }
    writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getCache(id) {
    const cache = loadCache();
    const entry = cache[id];
    if (!entry) return null;

    // 检查是否过期
    const isExpired = Date.now() - entry.cachedAt > TTL;
    if (isExpired) return null;

    return entry.data;
}

export function setCache(id, data) {
    const cache = loadCache();
    cache[id] = {
        cachedAt: Date.now(),
        data,
    };
    saveCache(cache);
}

export function clearCache() {
    if (existsSync(CACHE_FILE)) {
        writeFileSync(CACHE_FILE, '{}', 'utf-8');
        console.log('缓存已清空');
    }
}
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// 每次测试前后清理真实缓存文件，避免污染
const CACHE_FILE = join(homedir(), '.config', 'javinfo', 'cache.json');

// 动态 import 保证每次拿到最新模块
async function importCache() {
    return await import('../lib/cache.js');
}

describe('cache.js', () => {
    beforeEach(() => {
        // 清空缓存文件，保证每个测试独立
        if (existsSync(CACHE_FILE)) {
            rmSync(CACHE_FILE);
        }
    });

    afterEach(() => {
        if (existsSync(CACHE_FILE)) {
            rmSync(CACHE_FILE);
        }
    });

    it('getCache：缓存不存在时返回 null', async () => {
        const { getCache } = await importCache();
        const result = getCache('SSIS-001');
        expect(result).toBeNull();
    });

    it('setCache + getCache：写入后能正确读取', async () => {
        const { getCache, setCache } = await importCache();
        const mockData = { id: 'SSIS-001', title: '测试标题', actresses: ['女优A'] };

        setCache('SSIS-001', mockData);
        const result = getCache('SSIS-001');

        expect(result).toEqual(mockData);
    });

    it('getCache：缓存过期后返回 null', async () => {
        const { getCache, setCache } = await importCache();
        const mockData = { id: 'ABW-001', title: '过期测试' };

        setCache('ABW-001', mockData);

        // 手动篡改缓存时间为 8 天前，模拟过期
        const { readFileSync, writeFileSync } = await import('fs');
        const raw = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
        raw['ABW-001'].cachedAt = Date.now() - 8 * 24 * 60 * 60 * 1000;
        writeFileSync(CACHE_FILE, JSON.stringify(raw), 'utf-8');

        const result = getCache('ABW-001');
        expect(result).toBeNull();
    });

    it('setCache：不同番号互不干扰', async () => {
        const { getCache, setCache } = await importCache();
        const dataA = { id: 'SSIS-001', title: 'A' };
        const dataB = { id: 'IPX-001', title: 'B' };

        setCache('SSIS-001', dataA);
        setCache('IPX-001', dataB);

        expect(getCache('SSIS-001')).toEqual(dataA);
        expect(getCache('IPX-001')).toEqual(dataB);
    });

    it('setCache：自动模式和手动指定数据源的缓存彼此隔离', async () => {
        const { getCache, setCache } = await importCache();
        const autoData = { id: 'SSIS-001', source: 'NJAV', title: '自动兜底结果' };
        const manualData = { id: 'SSIS-001', source: 'JAVBUS', title: '手动指定结果' };

        setCache('SSIS-001', autoData);
        setCache('SSIS-001', manualData, 'javbus');

        expect(getCache('SSIS-001')).toEqual(autoData);
        expect(getCache('SSIS-001', 'javbus')).toEqual(manualData);
        expect(getCache('SSIS-001', 'njav')).toBeNull();
    });

    it('clearCache：清空后所有缓存消失', async () => {
        const { getCache, setCache, clearCache } = await importCache();
        setCache('SSIS-001', { id: 'SSIS-001' });
        setCache('IPX-001', { id: 'IPX-001' });

        clearCache();

        expect(getCache('SSIS-001')).toBeNull();
        expect(getCache('IPX-001')).toBeNull();
    });
});

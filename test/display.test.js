import { describe, it, expect, vi, beforeEach } from 'vitest';
import { display } from '../lib/display.js';

// 完整的 mock 数据
const MOCK_INFO = {
    id: 'SSIS-001',
    title: '测试标题',
    actresses: ['天使もえ'],
    actors: ['男优A'],
    releaseDate: '2021-01-01',
    duration: '120分钟',
    studio: 'SOD Create',
    label: 'SOD',
    director: '导演A',
    series: '系列A',
    tags: ['独占', '美少女'],
    coverUrl: 'https://example.com/cover.jpg',
    score: '4.5分',
};

describe('display.js', () => {
    beforeEach(() => {
        // 拦截 console.log，不真正打印，但可以断言调用内容
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('display：正常调用不抛出异常', () => {
        expect(() => display(MOCK_INFO)).not.toThrow();
    });

    it('display：输出内容包含番号', () => {
        display(MOCK_INFO);
        const allOutput = console.log.mock.calls.flat().join(' ');
        expect(allOutput).toContain('SSIS-001');
    });

    it('display：输出内容包含女优名', () => {
        display(MOCK_INFO);
        const allOutput = console.log.mock.calls.flat().join(' ');
        expect(allOutput).toContain('天使もえ');
    });

    it('display：raw 模式输出 JSON 字符串', () => {
        display(MOCK_INFO, true);
        const allOutput = console.log.mock.calls.flat().join(' ');
        // raw 模式应该输出可解析的 JSON
        expect(() => JSON.parse(allOutput)).not.toThrow();
    });

    it('display：空字段不影响正常输出', () => {
        const sparseInfo = { ...MOCK_INFO, actors: [], tags: [], coverUrl: '' };
        expect(() => display(sparseInfo)).not.toThrow();
    });
});
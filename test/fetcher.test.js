import { describe, it, expect, vi, beforeEach } from 'vitest';

// mock axios，避免真实网络请求
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

import axios from 'axios';
import { search } from '../lib/fetcher.js';

// 模拟搜索结果页的 HTML
const MOCK_SEARCH_HTML = `
  <div class="movie-list">
    <div class="item">
      <a href="/v/abc123">
        <div class="video-title">SSIS-001</div>
      </a>
    </div>
  </div>
`;

// 模拟详情页的 HTML
const MOCK_DETAIL_HTML = `
  <h2 class="title"><strong class="current-title">测试标题</strong></h2>
  <div class="video-cover"><img src="https://example.com/cover.jpg" /></div>
  <div class="score"><span class="value">4.5分</span></div>
  <div class="movie-panel-info">
    <div class="panel-block">
      <strong>日期:</strong>
      <span class="value">2021-01-01</span>
    </div>
    <div class="panel-block">
      <strong>演員:</strong>
      <span class="value"><a>天使もえ</a></span>
    </div>
    <div class="panel-block">
      <strong>片商:</strong>
      <span class="value">SOD Create</span>
    </div>
    <div class="panel-block">
      <strong>時長:</strong>
      <span class="value">120分钟</span>
    </div>
  </div>
`;

describe('fetcher.js', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('search：正常番号能返回结构完整的对象', async () => {
        // 第一次调用返回搜索页，第二次返回详情页
        axios.get
            .mockResolvedValueOnce({ data: MOCK_SEARCH_HTML })
            .mockResolvedValueOnce({ data: MOCK_DETAIL_HTML });

        const result = await search('SSIS-001');

        expect(result).not.toBeNull();
        expect(result.id).toBe('SSIS-001');
        expect(result.title).toBe('测试标题');
        expect(result.actresses).toContain('天使もえ');
        expect(result.releaseDate).toBe('2021-01-01');
        expect(result.studio).toBe('SOD Create');
        expect(result.duration).toBe('120分钟');
        expect(result.coverUrl).toBe('https://example.com/cover.jpg');
    });

    it('search：搜索结果为空时返回 null', async () => {
        // 返回一个没有结果的搜索页
        axios.get.mockResolvedValueOnce({ data: '<div class="movie-list"></div>' });

        const result = await search('INVALID-999');
        expect(result).toBeNull();
    });

    it('search：网络请求失败时抛出错误', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(search('SSIS-001')).rejects.toThrow('Network Error');
    });

    it('search：返回对象包含所有预期字段', async () => {
        axios.get
            .mockResolvedValueOnce({ data: MOCK_SEARCH_HTML })
            .mockResolvedValueOnce({ data: MOCK_DETAIL_HTML });

        const result = await search('SSIS-001');
        const expectedFields = [
            'id', 'title', 'actresses', 'actors',
            'releaseDate', 'duration', 'studio', 'label',
            'director', 'series', 'tags', 'coverUrl', 'score',
        ];

        expectedFields.forEach(field => {
            expect(result).toHaveProperty(field);
        });
    });
});
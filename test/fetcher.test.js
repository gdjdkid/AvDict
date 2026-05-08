// 为 Node 18 提供 Web API polyfill
import { beforeAll } from 'vitest';

beforeAll(() => {
    if (typeof global.File === 'undefined') {
        global.File = class File {
            constructor(bits, name, options = {}) {
                this.bits = bits;
                this.name = name;
                this.type = options.type || '';
                this.size = bits?.length || 0;
            }
        };
    }

    if (typeof global.FormData === 'undefined') {
        global.FormData = class FormData {
            constructor() {
                this.data = new Map();
            }
            append(key, value) {
                this.data.set(key, value);
            }
        };
    }
});

// =====================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock child_process
vi.mock('child_process', () => ({
    execSync: vi.fn(),
    spawnSync: vi.fn(),
}));

// Mock cache
vi.mock('../lib/cache.js', () => ({
    getCache: vi.fn().mockReturnValue(null),
    setCache: vi.fn(),
    getConfig: vi.fn().mockReturnValue({ session: 'mock_session' }),
}));

import { execSync } from 'child_process';
import { getCache, setCache } from '../lib/cache.js';
import { search } from '../lib/fetcher.js';

// 模拟 HTML 数据
const MOCK_JAVBUS_HTML = `
<html>
  <head><title>SSIS-001</title></head>
  <body>
    <div class="container">
      <div class="row">
        <h3>SSIS-001 测试标题</h3>
        <div class="screencap">
          <img src="https://example.com/cover.jpg" />
        </div>
        <div class="info">
          <p><span class="header">發行日期:</span> 2021-01-01</p>
          <p><span class="header">長度:</span> 150分鐘</p>
          <p><span class="header">導演:</span> <a>导演A</a></p>
          <p><span class="header">製作商:</span> <a>SOD Create</a></p>
          <p><span class="header">發行商:</span> <a>SOD</a></p>
          <p><span class="header">系列:</span> <a>系列A</a></p>
        </div>
        <span class="genre"><a>独占</a></span>
        <span class="genre"><a>美少女</a></span>
        <div class="star-name"><a>天使もえ</a></div>
      </div>
    </div>
  </body>
</html>
`;

const MOCK_404_HTML = `
<html>
  <head><title>404</title></head>
  <body></body>
</html>
`;

const MOCK_NJAV_HTML = `
<html>
  <head><title>SSIS-001 - NJAV</title></head>
  <body>
    <script type="application/ld+json">
      {
        "name": "SSIS-001 NJAV 标题",
        "uploadDate": "2021-02-03T00:00:00Z",
        "duration": "PT2H05M06S",
        "actor": [{ "name": "女优B" }],
        "genre": ["人妻", "剧情"],
        "partOfSeries": { "name": "系列B" }
      }
    </script>
    <div class="detail-item">
      <div><span>片商</span><span>Studio B</span></div>
      <div><span>導演</span><span>导演B</span></div>
    </div>
  </body>
</html>
`;

describe('fetcher.js', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getCache.mockReturnValue(null);
    });

    it('search：正常番号能返回结构完整的对象', async () => {
        execSync.mockReturnValue(Buffer.from(MOCK_JAVBUS_HTML));

        const result = await search('SSIS-001');

        expect(result).not.toBeNull();
        expect(result.id).toBe('SSIS-001');
        expect(result.source).toBe('JAVBUS');
        expect(result.actresses).toContain('天使もえ');
        expect(result.releaseDate).toBe('2021-01-01');
        expect(result.studio).toBe('SOD Create');
        expect(getCache).toHaveBeenCalledWith('SSIS-001', 'auto');
        expect(setCache).toHaveBeenCalledWith('SSIS-001', expect.objectContaining({ source: 'JAVBUS' }), 'auto');
    });

    it('search：默认模式会按顺序自动兜底到下一个数据源', async () => {
        execSync.mockImplementation((command) => {
            if (command.includes('https://www.javbus.com/SSIS-001')) {
                return Buffer.from(MOCK_404_HTML);
            }

            if (command.includes('https://www.njav.com/zh/xvideos/ssis-001')) {
                return Buffer.from(MOCK_NJAV_HTML);
            }

            throw new Error(`Unexpected command: ${command}`);
        });

        const result = await search('SSIS-001');

        expect(result).not.toBeNull();
        expect(result.source).toBe('NJAV');
        expect(result.title).toBe('SSIS-001 NJAV 标题');
        expect(result.studio).toBe('Studio B');
        expect(execSync).toHaveBeenCalledTimes(2);
        expect(setCache).toHaveBeenCalledWith('SSIS-001', expect.objectContaining({ source: 'NJAV' }), 'auto');
    });

    it('search：手动指定数据源时只查询该数据源', async () => {
        execSync.mockImplementation((command) => {
            if (command.includes('https://www.javbus.com/SSIS-001')) {
                return Buffer.from(MOCK_JAVBUS_HTML);
            }

            throw new Error(`Unexpected command: ${command}`);
        });

        const result = await search('SSIS-001', 'zh', 'javbus');

        expect(result).not.toBeNull();
        expect(result.source).toBe('JAVBUS');
        expect(execSync).toHaveBeenCalledTimes(1);
        expect(getCache).toHaveBeenCalledWith('SSIS-001', 'javbus');
        expect(setCache).toHaveBeenCalledWith('SSIS-001', expect.objectContaining({ source: 'JAVBUS' }), 'javbus');
    });

    it('search：手动指定数据源未命中时不会回退到其他数据源', async () => {
        execSync.mockImplementation((command) => {
            if (command.includes('https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=SSIS-001')) {
                return Buffer.from('<html><body>empty</body></html>');
            }

            throw new Error(`Unexpected command: ${command}`);
        });

        const result = await search('SSIS-001', 'zh', 'javlibrary');

        expect(result).toBeNull();
        expect(execSync).toHaveBeenCalledTimes(1);
    });

    it('search：返回对象包含所有预期字段', async () => {
        execSync.mockReturnValue(Buffer.from(MOCK_JAVBUS_HTML));

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

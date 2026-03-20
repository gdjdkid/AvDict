import { execSync } from 'child_process';
import * as cheerio from 'cheerio';
import { getCache, setCache } from './cache.js';

const SESSION = decodeURIComponent('wJkH2678EN3cZzzL2Pqbyr158quff0CaGzuh5hRxUXXADcKOQm1zKdOnlwow3wDfL5AX2NeKne52BgUZT6JpBGp5prKgUmKyBReopEABv30rItmWnxowjJ04Mki%2BO0jQ3OO%2F4F2BYE7TTZ8GlgpA3kuesTAsX8bAcL0HqWF4LDRdMeo9JYqzDn%2FoPAUFxnmwXBieXtMXqCP8JnudI2vQ44jtIhFRvSrzf832gRMi7STwMG7K8O9%2BH3AoJfMKbuBomnLMFuBNBbPbB3SShbi3SBja8bX8nudBILUX0ZiJtD%2FEOl%2BN3r6dVPw5--do%2Bi7mvLi5xyZ0HZ--gZT%2Fl7%2BX9Vr3GjRNK7FXOw%3D%3D');

const COOKIE = `list_mode=h; theme=auto; locale=zh; over18=1; _jdb_session=${SESSION}`;
const BASE_URL = 'https://javdb.com';

// 每次请求都重新构造 cookie，避免 session 过期问题
function fetchHtml(url) {
    const result = execSync(
        `curl -sL "${url}" \
      -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36" \
      -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8" \
      -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8" \
      -H "Cookie: ${COOKIE}"`,
        { timeout: 15000, maxBuffer: 1024 * 1024 * 10 }
    );
    return result.toString();
}

export async function search(id) {
    // 先查缓存
    const cached = getCache(id);
    if (cached) return cached;

    // 使用精确番号搜索（f=code 只搜番号，结果更准确）
    const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(id)}&f=all`;
    const searchHtml = fetchHtml(searchUrl);
    const $ = cheerio.load(searchHtml);

    // 在搜索结果里找番号完全匹配的那一项
    let detailPath = null;
    $('.movie-list .item a.box').each((_, el) => {
        const titleEl = $(el).find('.video-title strong');
        const foundId = titleEl.text().trim().toUpperCase();
        if (foundId === id.toUpperCase()) {
            detailPath = $(el).attr('href');
            return false; // 找到了就停止循环
        }
    });

    // 如果精确匹配没找到，退回到取第一个结果
    if (!detailPath) {
        detailPath = $('.movie-list .item a.box').first().attr('href');
    }

    if (!detailPath) return null;

    // 抓详情页
    const detailUrl = `${BASE_URL}${detailPath}`;
    const detailHtml = fetchHtml(detailUrl);
    const result = parseDetail(detailHtml, id);

    setCache(id, result);
    return result;
}

function parseDetail(html, queryId) {
    const $ = cheerio.load(html);

    const result = {
        id: queryId,
        title: '',
        actresses: [],
        actors: [],
        releaseDate: '',
        duration: '',
        studio: '',
        label: '',
        director: '',
        series: '',
        tags: [],
        coverUrl: '',
        score: '',
    };

    // 标题
    result.title = $('h2.title strong.current-title').text().trim() ||
        $('strong.current-title').text().trim() ||
        $('h2.title').first().text().trim();

    // 封面
    result.coverUrl = $('.video-cover img').attr('src') || '';

    // 评分
    result.score = $('.score .value').first().text().trim();

    // 遍历详情字段
    $('.movie-panel-info .panel-block').each((_, el) => {
        const labelText = $(el).find('strong').first().text().trim().replace(/：|:/g, '');
        const valueEl = $(el).find('.value');
        const valueText = valueEl.text().trim();

        if (/日期|發行日期|发行日期/.test(labelText)) {
            // 发售日期格式为 YYYY-MM-DD，用正则提取避免误匹配
            const dateMatch = valueText.match(/\d{4}-\d{2}-\d{2}/);
            result.releaseDate = dateMatch ? dateMatch[0] : valueText;

        } else if (/時長|时长/.test(labelText)) {
            result.duration = valueText;

        } else if (/導演|导演/.test(labelText)) {
            result.director = valueText;

        } else if (/片商/.test(labelText)) {
            result.studio = valueText;

        } else if (/發行商|发行商/.test(labelText)) {
            result.label = valueText;

        } else if (/系列/.test(labelText)) {
            result.series = valueText;

        } else if (/類別|类别/.test(labelText)) {
            valueEl.find('a').each((_, a) => {
                const tag = $(a).text().trim();
                if (tag) result.tags.push(tag);
            });

        } else if (/演員|演员/.test(labelText)) {
            valueEl.find('a').each((_, a) => {
                const name = $(a).text().trim();
                // 排除男优（通常男优名字旁边有性别标记）
                const isMale = $(a).find('.male').length > 0 ||
                    $(a).parent().find('.male').length > 0;
                if (name && !isMale) result.actresses.push(name);
            });

        } else if (/男優|男优/.test(labelText)) {
            valueEl.find('a').each((_, a) => {
                const name = $(a).text().trim();
                if (name) result.actors.push(name);
            });
        }
    });

    return result;
}
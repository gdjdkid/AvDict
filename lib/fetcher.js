import axios from 'axios';
import * as cheerio from 'cheerio';
import { getCache, setCache } from './cache.js';

const BASE_URL = 'https://javdb.com';

const HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    Cookie: 'locale=zh; over18=1',  // over18=1 跳过成人内容确认页
};

async function fetchHtml(url) {
    const res = await axios.get(url, {
        headers: HEADERS,
        timeout: 15000,
        maxRedirects: 5,
        decompress: true,
    });
    return res.data;
}

export async function search(id) {
    // 第一步：先查缓存
    const cached = getCache(id);
    if (cached) return cached;

    // 缓存没有，走网络请求，搜索番号，拿到详情页链接
    const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(id)}&f=all`;
    const searchHtml = await fetchHtml(searchUrl);
    const $ = cheerio.load(searchHtml);

    // 找第一个匹配的结果卡片
    const firstResult = $('.movie-list .item a').first();
    if (!firstResult.length) return null;

    const detailPath = firstResult.attr('href');
    if (!detailPath) return null;

    // 第二步：抓取详情页
    const detailUrl = `${BASE_URL}${detailPath}`;
    const detailHtml = await fetchHtml(detailUrl);
    return parseDetail(detailHtml, id);
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
        detailUrl: '',
    };

    // 标题
    result.title = $('h2.title strong.current-title').text().trim() ||
        $('h2.title').text().trim();

    // 封面图
    result.coverUrl = $('.video-cover img').attr('src') || '';

    // 评分
    result.score = $('.score .value').first().text().trim();

    // 遍历 panel info 的每一行
    $('.movie-panel-info .panel-block').each((_, el) => {
        const label = $(el).find('strong').text().trim().replace(':', '');
        const valueEl = $(el).find('.value');

        switch (true) {
            case /日期|發行|发行/.test(label):
                result.releaseDate = valueEl.text().trim();
                break;

            case /時長|时长|分鐘|分钟/.test(label):
                result.duration = valueEl.text().trim();
                break;

            case /導演|导演/.test(label):
                result.director = valueEl.text().trim();
                break;

            case /片商|制作|製作/.test(label):
                result.studio = valueEl.text().trim();
                break;

            case /發行商|发行商/.test(label):
                result.label = valueEl.text().trim();
                break;

            case /系列/.test(label):
                result.series = valueEl.text().trim();
                break;

            case /類別|类别|genre/i.test(label):
                valueEl.find('a').each((_, a) => {
                    result.tags.push($(a).text().trim());
                });
                break;

            case /演員|演员|女優|女优/.test(label): {
                valueEl.find('a').each((_, a) => {
                    const name = $(a).text().trim();
                    if (name) result.actresses.push(name);
                });
                break;
            }

            case /男優|男优/.test(label): {
                valueEl.find('a').each((_, a) => {
                    const name = $(a).text().trim();
                    if (name) result.actors.push(name);
                });
                break;
            }
        }
    });

    // 写入缓存
    setCache(id, result);

    return result;
}
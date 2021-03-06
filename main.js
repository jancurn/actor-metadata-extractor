const Apify = require('apify');
const { log, htmlToText } = Apify.utils;

/**
 * Function called for each page to extract data from it.
 */
const handlePageFunction = async ({ request, html, $ }) => {
    const { url } = request;
    log.info('Processing page', { url });

    // Extract all meta elements from <head>
    const meta = {};
    $('head meta').each(function () {
        let name = $(this).attr('name')
            || $(this).attr('property')
            || $(this).attr('http-equiv');
        let content = $(this).attr('content');

        const charset = $(this).attr('charset');
        if (!name && charset) {
            name = 'charset';
            content = charset;
        }

        if (name) {
            meta[name] = content ? content.trim() : null;
        }
    });

    const title = ($('head title').eq(0).text() || '').trim();

    const language = $('html').eq(0).attr('lang').trim();

    const content = {
        navs: [],
        headers: [],
        footers: [],
        captions: [],
        mainText: null,
    };

    ['nav', 'header', 'footer'].forEach((tag) => {
        $(tag).each(function () {
            // TODO: This is inefficient, htmlToText() should accept Cheerio element too
            content[`${tag}s`].push(htmlToText($(this).html()));
        });
    });

    $('h1, h2, h3, h4, h5, h6, h7').each(function () {
        content.captions.push({
            tag: $(this).prop('tagName').toLowerCase(),
            value: $(this).text().trim(),
        });
    });

    ['nav', 'header', 'footer'].forEach((tag) => {
        $(tag).remove();
    });

    content.mainText = htmlToText($.root().html());

    await Apify.pushData({
        url,
        title,
        language,
        meta,
        content,
    });
};

Apify.main(async () => {
    const input = await Apify.getInput();
    if (!input || !input.urls) throw new Error('Invalid input!');

    const requestList = await Apify.openRequestList('METADATA_SCRAPER', input.urls);

    const crawler = new Apify.CheerioCrawler({
        requestList,
        minConcurrency: 1,
        maxConcurrency: 100,
        handlePageTimeoutSecs: 60,
        handlePageFunction,
        maxRequestRetries: input.maxRequestRetries || 0,
        handleFailedRequestFunction: async ({ error, request }) => {
            log.exception(error, 'Failed to load the page, giving up', { url: request.url });
        },
    });

    await crawler.run();

    log.info('Done.');
});

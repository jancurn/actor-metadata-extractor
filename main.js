const Apify = require('apify');
const { log } = Apify.utils;

/**
 * Function called for each page to extract data from it.
 */
const handlePageFunction = async ({ request, html, $ }) => {
    const { url } = request;
    log.info('Processing page', { url });

    // Extract all meta elements from <head>
    const meta = {};
    $('head meta').each(() => {
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

    await Apify.pushData({
        url,
        title,
        meta,
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
        handleFailedRequestFunction: async ({ error, request }) => {
            log.exception(error, 'Failed to load the page, giving up', { url: request.url });
        },
    });

    await crawler.run();

    log.info('Done.');
});

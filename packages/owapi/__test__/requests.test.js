/* eslint-disable */

const owapi = require('../index.js');
const nock = require('nock');
const fs = require('fs');

describe('function getAccountByName', () => {
    test('Throw PLAYER_NOT_EXIST when length equal zero', async () => {
        nock('https://playoverwatch.com')
        .get('/en-us/search/account-by-name/Trev%2311289')
        .reply(200, [])

        await expect(owapi.getAccountByName('Trev-11289')).rejects.toBe('PLAYER_NOT_EXIST');
    });

    test('Actually return proper data when player exists', async () => {
        const mustReturn = [{ 'platform': 'pc', 'careerLink': '/career/pc/Trev-11289', 'platformDisplayName': 'Trev#11289', 'level': 524, 'portrait': 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png' }]

        nock('https://playoverwatch.com')
        .get('/en-us/search/account-by-name/Trev%2311289')
        .reply(200, mustReturn);

        await expect(owapi.getAccountByName('Trev-11289')).resolves.toEqual(mustReturn);
    });
});

describe('function getRawHtmlFromBtag', () => {
    test('Throw type error when platform isn\'t valid', async () => {
        await expect(owapi.getRawHtmlFromBtag('Trev-11289', 'totally not a valid platform'))
        .rejects
        .toEqual(new TypeError('totally not a valid platform is not a valid platform'));
    });

    test('Throw PLAYER_NOT_EXIST when receive 404', async () => {
        nock('https://playoverwatch.com')
        .get('/en-us/career/pc/us/Trev-11289')
        .reply(404, 'xd');

        nock('https://playoverwatch.com')
        .get('/en-us/search/account-by-name/Trev%2311289')
        .reply(200, [{ 'platform': 'pc', 'careerLink': '/career/pc/Trev-11289', 'platformDisplayName': 'Trev#11289', 'level': 524, 'portrait': 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png' }]);

        await expect(owapi.getRawHtmlFromBtag('Trev-11289', 'us')).rejects.toBe('PLAYER_NOT_EXIST')
    });

    test('Actually return proper data when a valid platform and player exists', async () => {
        nock('https://playoverwatch.com')
        .get('/en-us/career/pc/us/Trev-11289')
        .replyWithFile(200, __dirname + '/data/trev.html');

        nock('https://playoverwatch.com')
        .get('/en-us/search/account-by-name/Trev%2311289')
        .reply(200, [{ 'platform': 'pc', 'careerLink': '/career/pc/Trev-11289', 'platformDisplayName': 'Trev#11289', 'level': 524, 'portrait': 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png' }]);

        expect(owapi.getRawHtmlFromBtag('Trev-11289', 'us'))
        .resolves
        .toEqual(fs.readFileSync(__dirname + '/data/trev.html').toString());
    });

    test('Still return first region even if platform is not specified', async () => {
        nock('https://playoverwatch.com')
        .get('/en-us/career/pc/us/Trev-11289')
        .replyWithFile(200, __dirname + '/data/trev.html');

        nock('https://playoverwatch.com')
        .get('/en-us/search/account-by-name/Trev%2311289')
        .reply(200, [{ 'platform': 'pc', 'careerLink': '/career/pc/Trev-11289', 'platformDisplayName': 'Trev#11289', 'level': 524, 'portrait': 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png' }]);

        expect(owapi.getRawHtmlFromBtag('Trev-11289'))
        .resolves
        .toEqual(fs.readFileSync(__dirname + '/data/trev.html').toString());
    });
});

describe('function getAllStats', () => {
    test('Return something and match snapshot', async () => {
        nock('https://playoverwatch.com')
        .get('/en-us/career/pc/Trev-11289')
        .replyWithFile(200, __dirname + '/data/trev.html');

        nock('https://playoverwatch.com')
        .get('/en-us/search/account-by-name/Trev%2311289')
        .reply(200, [{ 'platform': 'pc', 'careerLink': '/career/pc/Trev-11289', 'platformDisplayName': 'Trev#11289', 'level': 524, 'portrait': 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png' }]);

        await expect(owapi.getAllStats('Trev-11289', 'us')).resolves.toMatchSnapshot();
    });
});


describe('function getModeStats', () => {
    test('Return "mode isn\'t quickplay or competitive" when mode isn\'t valid', async () => {
        await expect(owapi.getModeStats('Trev-11289', 'not a valid mode', 'us')).rejects.toEqual(new TypeError('mode isn\'t quickplay or competitive'));
    });

    test('Return something and match snapshot', async () => {
        nock('https://playoverwatch.com')
        .get('/en-us/career/pc/us/Trev-11289')
        .replyWithFile(200, __dirname + '/data/trev.html');

        nock('https://playoverwatch.com')
        .get('/en-us/search/account-by-name/Trev%2311289')
        .reply(200, [{ 'platform': 'pc', 'careerLink': '/career/pc/Trev-11289', 'platformDisplayName': 'Trev#11289', 'level': 524, 'portrait': 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png' }]);

        await expect(owapi.getModeStats('Trev-11289','quickplay', 'us')).resolves.toMatchSnapshot();
    });
});

describe('function getGeneralStats', () => {
    test('Return something and match snapshot', async () => {
        nock('https://playoverwatch.com')
        .get('/en-us/career/pc/us/Trev-11289')
        .replyWithFile(200, __dirname + '/data/trev.html');

        nock('https://playoverwatch.com')
        .get('/en-us/search/account-by-name/Trev%2311289')
        .reply(200, [{ 'platform': 'pc', 'careerLink': '/career/pc/Trev-11289', 'platformDisplayName': 'Trev#11289', 'level': 524, 'portrait': 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png' }]);

        await expect(owapi.getGeneralStats('Trev-11289','us')).resolves.toMatchSnapshot();
    });

    test('Return something and match snapshot even if platform is not specified', async () => {
        nock('https://playoverwatch.com')
        .get('/en-us/career/pc/Trev-11289')
        .replyWithFile(200, __dirname + '/data/trev.html');

        nock('https://playoverwatch.com')
        .get('/en-us/search/account-by-name/Trev%2311289')
        .reply(200, [{ 'platform': 'pc', 'careerLink': '/career/pc/Trev-11289', 'platformDisplayName': 'Trev#11289', 'level': 524, 'portrait': 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png' }]);

        await expect(owapi.getGeneralStats('Trev-11289')).resolves.toMatchSnapshot();
    });
});
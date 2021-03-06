/* eslint-disable */

const app = require('../../app');
const request = require('supertest')(app.listen());
const ioredis = require('ioredis');
const nock = require('nock');
const redis = new ioredis(process.env.REDIS_URL);
const md5 = require('md5');


beforeAll(() => {
    if (!process.env.REDIS_URL) {
        throw 'Environment variable REDIS_URL not detected'
    }


    nock('https://playoverwatch.com')
    .persist()
    .get('/en-us/career/pc/Trev-11289')
    .replyWithFile(200, __dirname + '/../data/trev.html');

    nock('https://playoverwatch.com')
    .persist()
    .get('/en-us/career/pc/us/Trev-11289')
    .replyWithFile(200, __dirname + '/../data/trev.html');

    nock('https://playoverwatch.com')
    .persist()
    .get('/en-us/search/account-by-name/Trev%2311289')
    .reply(200,
    [{ 'platform': 'pc',
    'careerLink': '/career/pc/Trev-11289',
    'platformDisplayName': 'Trev#11289',
    'level': 524,
    'portrait': 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png' }]);
});

afterAll(async () => {
    await redis.del(`owapi-${md5('/v1/mode/quickplay/Trev-11289/us')}`);
});

test('Cache request', async () => {
    await request.get('/v1/mode/quickplay/Trev-11289/us').expect(200);

    const cache = await redis.get(`owapi-${md5('/v1/mode/quickplay/Trev-11289/us')}`);
    const ttl = await redis.ttl(`owapi-${md5('/v1/mode/quickplay/Trev-11289/us')}`);

    expect(cache).not.toBeNull();
    expect(ttl).not.toBeNull();
});
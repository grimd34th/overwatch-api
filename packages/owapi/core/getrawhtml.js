const rp = require('request-promise');
const getAccountByName = require('./getaccountbyname');

const regPathFix = {
    us: '/career/pc/us/',
    eu: '/career/pc/eu/',
    kr: '/career/pc/kr',
    cn: '/career/pc/cn/',
    xbl: '/career/xbl/',
    psn: '/career/psn/'
};

async function getRawHtmlFromBtag(btag, platform) {
    try {
        if (platform !== undefined && regPathFix[platform] == undefined) {
            throw new TypeError(`${platform} is not a valid platform`);
        }
        let uri = `https://playoverwatch.com/en-us${regPathFix[platform]}${encodeURIComponent(btag.replace('#', '-'))}`;

        if (platform === undefined) {
            const accountData = await getAccountByName(btag);
            
            if (accountData.length === 0) {
                throw 'PLAYER_NOT_EXIST';
            }

            uri = `https://playoverwatch.com/en-us${accountData[0].careerLink}`;
        }
        const getProfileData = await rp({
            uri,
            timeout: 10000
        }).catch((err) => {
            if (err.statusCode === 404) {
                throw 'PLAYER_NOT_EXIST';
            } else {
                throw err;
            }
        });

        return getProfileData;
    } catch(e) {
        throw e;
    }
}

module.exports = getRawHtmlFromBtag;

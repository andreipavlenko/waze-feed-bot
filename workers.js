const schedule = require('node-schedule');
const tg = require('./telegram');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const channelId = process.env.MYCHAT_ID;

function initWorkers() {
    console.log('init workers');
    schedule.scheduleJob('0 * * * * *', function() {
        sendWazersReport();
    });
    schedule.scheduleJob('30 * * * * *', function() {
        sendDailyWazersReport();
    });
}

function sendWazersReport() {
    let wazers = db.get('users').value();
    let now = Date.now();

    wazers = wazers.filter(wazer => {
        let lastSeenAgo = (now - wazer.lastSeen) / 1000 / 60;
        return lastSeenAgo < 30;
    });

    let count = wazers.length;

    if (count > 0) {
        let noun = getWazersNoun(count);
        tg.sendMessage(channelId, `🚙 ${wazers.length} ${noun} за останню годину 😊`);
    }
}

function sendDailyWazersReport() {
    let wazers = db.get('users').value();
    let now = Date.now();

    wazers = wazers.filter(wazer => {
        let lastSeenAgo = (now - wazer.lastSeen) / 1000 / 60 / 60;
        return lastSeenAgo < 24;
    });

    let count = wazers.length;

    if (count > 0) {
        let noun = getWazersNoun(count);
        tg.sendMessage(channelId, `🚗 ${wazers.length} ${noun} за останню добу 🤗`);
    }
}

function getWazersNoun(count) {
    switch (count) {
        case 1:
            return 'вейзер';
        case 2:
        case 3:
        case 4:
            return 'вейзери';
        default:
            return 'вейзерів';
    }
}

exports.initWorkers = initWorkers;
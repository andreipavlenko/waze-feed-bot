const tg = require('./telegram');

const channelId = process.env.CHANNEL_ID;

const alertTypes = {
    potHole: 'HAZARD_ON_ROAD_POT_HOLE',
    construction: 'HAZARD_ON_ROAD_CONSTRUCTION',
    hazard: 'HAZARD_ON_ROAD',
    objectOnRoad: 'HAZARD_ON_ROAD_OBJECT',
    killedAnimal: 'HAZARD_ON_ROAD_ROAD_KILL',
    shoulderAnimals: 'HAZARD_ON_SHOULDER_ANIMALS'
};

function handleAlert(alert) {
    switch (alert.type) {
        case 'CHIT_CHAT':
            return handleChitChat(alert);
    }

    switch (alert.subtype) {
        case alertTypes.potHole:
            return handlePotHoleAlert(alert);
        case alertTypes.construction:
            return handleConstructionAlert(alert);
        case alertTypes.hazard:
            return handleHazardAlert(alert);
        case alertTypes.objectOnRoad:
            return handleObjectOnRoadAlert(alert);
        case alertTypes.killedAnimal:
            return handleKilledAnimalAlert(alert);
        case alertTypes.shoulderAnimals:
            return handleShoulderAnimalsAlert(alert);
        default:
            tg.sendUnknownAlertInfo(alert);
    }
}

function handleShoulderAnimalsAlert(alert) {
    sendAlertMessage(alert, 'поблизу тварини 🐄🐑🐕');
}

function handleKilledAnimalAlert(alert) {
    sendAlertMessage(alert, 'збита тваринка 😥');
}

function handleObjectOnRoadAlert(alert) {
    let { reportBy, street, city, location } = alert;
    let who = reportBy ? reportBy : 'Хтось';
    let where = street ? `на ${street}` : `у м. ${city}`;
    where = where ? where : 'десь';

    let message = `📢 ${who} повідомляє, що ${where} перешкода 🌲`;
    let inlineKeyboard = buildLinkReplyKeyboard(location);

    tg.sendMessage(channelId, message, inlineKeyboard);
}

function handleChitChat(alert) {
    let { reportBy, location } = alert;
    let who = reportBy ? reportBy : 'Хтось';

    let message = `📢 ${who} залишив коментар на мапі 💭`;
    let inlineKeyboard = buildLinkReplyKeyboard(location);

    tg.sendMessage(channelId, message, inlineKeyboard);
}

function handleHazardAlert(alert) {
    let { reportBy, street, city, location } = alert;
    let who = reportBy ? reportBy : 'Хтось';
    let where = street ? `на ${street}` : `у м. ${city}`;
    where = where ? where : 'десь';

    let message = `📢 ${who} повідомляє, що ${where} небезпека 💣`;
    let inlineKeyboard = buildLinkReplyKeyboard(location);

    tg.sendMessage(channelId, message, inlineKeyboard);
}

function handleConstructionAlert(alert) {
    let { reportBy, street, city, location } = alert;
    let who = reportBy ? reportBy : 'Хтось';
    let where = street ? `на ${street}` : `у м. ${city}`;
    where = where ? where : 'десь';

    let message = `📢 ${who} повідомляє, що ${where} ремонт дороги 🚧`;
    let inlineKeyboard = buildLinkReplyKeyboard(location);

    tg.sendMessage(channelId, message, inlineKeyboard);
}

function handlePotHoleAlert(alert) {
    let { reportBy, street, city, location } = alert;
    let who = reportBy ? reportBy : 'Хтось';
    let where = street ? `на ${street}` : `у м. ${city}`;
    where = where ? where : 'десь';

    let message = `📢 ${who} повідомляє, що ${where} яма 🙂`;
    let inlineKeyboard = buildLinkReplyKeyboard(location);

    tg.sendMessage(channelId, message, inlineKeyboard);
}

function sendAlertMessage(alert, messageEnding) {
    let { reportBy, street, city, location } = alert;
    let who = reportBy ? reportBy : 'Хтось';
    let where;
    if (street) {
        where = `на ${street}`;
    } else if (city) {
        where = `у м. ${city}`;
    } else {
        where = 'десь';
    }

    let message = `📢 ${who} повідомляє, що ${where} ${messageEnding}`;
    let inlineKeyboard = buildLinkReplyKeyboard(location);

    tg.sendMessage(channelId, message, inlineKeyboard);
}

function getAlertUrl(location) {
    return `https://www.waze.com/en/livemap/directions?latlng=${location.y}%2C${location.x}&utm_campaign=waze_website&utm_source=waze_website`;
}

function buildLinkReplyKeyboard(location) {
    let inlineKeyboard = {
        inline_keyboard: [
            [{
                text: 'Переглянути 🗺️',
                url: getAlertUrl(location)
            }]
        ]
    };
    return inlineKeyboard;
}

exports.handleAlert = handleAlert;
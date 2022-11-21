'using strict'

const providers = require('../constants/phoneProviders.json');
const Rest = require('./util/rest.js');
const postmark = require("postmark");

const sendSMS = function(_number){
    _number = _number.toString();
    if(_number.indexOf('0') == 0)
        _number = _number.slice(1);
    var _providerMail = providers[_number.substring(0,3)];

// Send an email:
    var client = new postmark.ServerClient("01cd8f59-6b8b-475e-8cb5-c046aa9e5cc9");

    client.sendEmail({
    "From": "kyle@nailsdelightdavao.com",
    "To": _number+_providerMail,
    "Subject": "Hello from Postmark",
    "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
    "TextBody": "Hello from Postmark!",
    "MessageStream": "outbound"
    });
}
sendSMS('09369062898')
module.exports = {
    sendSMS
}

/**
 * Hearthstone common helpers
 *
 * @author tim.tang
 */
var crypto = require('crypto'),
    config = require('../conf/hearthstone-conf').config,
    _ = require('underscore');


var HearthstoneHelper = function HearthstoneHelper() {};

_.extend(HearthstoneHelper.prototype, {

    popSession: function(user, res) {
        var auth_token = this.encrypt(user._id + '\t' + user.name + '\t' + user.pass + '\t' + user.email, config.session_secret);
        //cookie valid in 30 days.
        res.cookie(config.auth_cookie_name, auth_token, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
    },

    clearCookie: function(res) {
        res.clearCookie(config.auth_cookie_name, {
            path: '/'
        });
    },

    encrypt: function(str, secret) {
        var cipher = crypto.createCipher('aes192', secret);
        var enc = cipher.update(str, 'utf8', 'hex');
        enc += cipher.final('hex');
        return enc;
    },

    decrypt: function(str, secret) {
        var decipher = crypto.createDecipher('aes192', secret);
        var dec = decipher.update(str, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    },

    md5: function(str) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
    },

    randomString: function(size) {
        size = size || 6;
        var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var max_num = code_string.length + 1;
        var new_pass = '';
        while (size > 0) {
            new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
            size--;
        }
        return new_pass;
    }
});

var hearthstoneHelper = new HearthstoneHelper();
module.exports = hearthstoneHelper;

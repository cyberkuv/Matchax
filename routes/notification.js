const Notification = require('../models/notification');
const mongoose = require('mongoose');

module.exports.newNotification = (otherusrId, currUsrId, type, msg, link)=> {
    var newNotif = new Notification({
        userId: mongoose.Types.ObjectId(currUsrId),
        userId2: otherusrId,
        type: type,
        message: msg,
        link: link
    });
    newNotif.save((err)=> {
        if(err) throw err;
        console.log('New Notification');
    });
}
 /*
 * Copyright (C) 2015 Marcin Bychawski
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */

var nodemailer = require('nodemailer');
var config	   = require('./config.json').mailer;

var smtpTransport = nodemailer.createTransport("SMTP", config.transportOptions );

exports.sendMail = function(options, callback) {
	var mailOptions = {
	    from    : config.defaultFrom,
	    to      : options.to,
	    subject : options.subject,
	    text    : options.text,
	    html	: options.html,
	    attachments: [{
	    	fileName: options.fileName,
	        filePath: options.fileName
	    }]
	};

	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error) {
	        console.log(error);
	    }
	    else {
	        console.log("Message sent to: " + options.to + " | " + response.message);
	    }

	    if(callback instanceof Function){
	    	callback(error, response);
	    }
	});
}
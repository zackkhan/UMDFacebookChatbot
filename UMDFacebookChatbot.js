var login = require("facebook-chat-api");
var toHex = require('colornames')
var request = require('request');

// Create simple echo bot
login({ email: "enter email here", password: "enter password here" }, function callback(err, api) {
    if (err) return console.error(err);
    api.setOptions({ selfListen: true })
    api.listen(function callback(err, message) {
        if (message.type == 'message') {
            var body = message.body;
            //"hello world hi" -> ['hello', 'world', 'hi']
            var words = body.split(" ");
            var colorHex;
            for (var i = 0; i < words.length; i++) {
                if (toHex(words[i]) != undefined) {
                    //We found a valid color!
                    colorHex = toHex(words[i]);
                }
            }
            // if we have a color, it is saved in colorHex
            if (colorHex != undefined) {
                api.changeThreadColor(colorHex, message.threadID, function callback(err) {
                    if (err) return console.error(err);
                });
            }

            // regex is used to find the coursename. the w{4} finds 4 word characters (aka letters), the d{3} finds 3 digits 
            var regex = /\w{4}\d{3}/
            var course;
            for (var i = 0; i<words.length; i++)
            {
                if (words[i].match(regex))
                {
                    course = words[i];
                }
            }
            if (course != undefined)
            {
                request('http://api.umd.io/v0/courses/' + course, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var jsonResponse = JSON.parse(body);
                 //can change description to "credits" to return the number of credits of the course 
                        console.log(jsonResponse.description);
                        api.sendMessage(jsonResponse.description, message.threadID);
                    }
                    

                })
            }
            //start of bus stuff 
         
            var regex2 = /\d{3}/ // had to use \ also so that it reads 3 digits and not 3 characters of 'd'
            var bus;
            for (var i = 0; i < words.length; i++) {
                if (words[i].match(regex2)) {
                    bus = words[i];
                }
            }

            if (bus != undefined) {
                request('http://api.umd.io/v0/bus/routes/' + bus, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var jsonResponse2 = JSON.parse(body);

                        console.log(jsonResponse2);
                        api.sendMessage(jsonResponse2.title, message.threadID);
                    }



                })
            }
        }

    });
});



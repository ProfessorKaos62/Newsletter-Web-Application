const express = require('express');
const fs = require('fs');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed', 
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    let jsonData = JSON.stringify(data);

    const url = 'https://us14.api.mailchimp.com/3.0/lists/a19e4fb261';

    const options = {
        method: 'POST',
        auth: 'jeremy1:2e9d3326bfe311e995200b74627e5486-us14'
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        }
        else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

    console.log(firstName, lastName, email);
});

app.post('/failure', (req, res) => {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function() {
    console.log('Server is running on port 3000');
});

// API KEY 
// 2e9d3326bfe311e995200b74627e5486-us14

// List ID
// a19e4fb261
'use strict';

    const express = require('express'),
    cors = require('cors'),
    Request = require('request'),
    path = require('path'),
    MEETUP_API_BASE_URL = 'https://api.meetup.com',
    MEETUP_API_KEY = process.env.MEETUP_API_KEY,     // From environment variable
    MEETUP_GROUPS = require('./groups.json');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'client/build')));

const router = express.Router();


// Check if a group is valid.
function isValid(groupId) {
    for (let group of MEETUP_GROUPS.groups) {
        if (group.id === groupId) {
            return group.name;
        }
    }
    return '';
}

router.get('/groups', (req, res) => {
    return res.json(MEETUP_GROUPS.groups)
})

router.get('/groups/:id', (req, res) => {
    // Is this a valid group?
    const groupId = req.params.id;

    if (isValid(groupId)) {
        // This is a group we know, about so let's call Meetup and get its events...
        Request.get({
            url: `${MEETUP_API_BASE_URL}/${groupId}?key=${MEETUP_API_KEY}&sign=true&photo-host=public&page=20&sign=true`,
            json: true
        },
            (error, response, body) => {
                // This handles what comes back from Meetup...
                res.json(body);
            });
    } else {
        // We don't know about that group...
        res.status(404).send('Not found');
    }

})

router.get('/events/:groupId', (req, res) => {
    // Is this a valid group?
    const groupId = req.params.groupId;

    const name = isValid(groupId);
    if (name) {
        // This is a group we know, about so let's call Meetup and get its events...
        Request.get({
            url: `${MEETUP_API_BASE_URL}/${groupId}/events?key=${MEETUP_API_KEY}&sign=true&photo-host=public&page=20&sign=true`,
            json: true
        },
            (error, response, body) => {
                // This handles what comes back from Meetup...
                try {
                    for (let x of body) {
                        x.groupName = name;
                    }
                }
                catch(err) {
                    console.log(err)
                }
                res.json(body);
            });
    } else {
        // We don't know about that group...
        res.status(404).send('Not found');
    }

})

app.use("/api", router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

module.exports = app;

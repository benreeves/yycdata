'use strict';

    const express = require('express'),
    cors = require('cors'),
    Request = require('request'),
    path = require('path'),
    MEETUP_API_BASE_URL = 'https://api.meetup.com',
    MEETUP_API_KEY = process.env.MEETUP_API_KEY,     // From environment variable
    MEETUP_GROUPS = require('./groups.json');

const API_PORT = 8080;

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'client/build')));

const router = express.Router();


// Check if a group is valid.
function isValid(groupId) {
    for (let group of MEETUP_GROUPS.groups) {
        if (group.id === groupId) {
            return true;
        }
    }

    return false;
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

    if (isValid(groupId)) {
        // This is a group we know, about so let's call Meetup and get its events...
        Request.get({
            url: `${MEETUP_API_BASE_URL}/${groupId}/events?key=${MEETUP_API_KEY}&sign=true&photo-host=public&page=20&sign=true`,
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

//const provision = async () => {
//
//    await server.register(Inert);
//
//    // Route to get all groups.
//    server.route({
//        method: 'GET',
//        path: '/api/groups',
//        handler: (request, reply) => {
//            reply(MEETUP_GROUPS.groups);
//        }
//    });
//
//    // Route to get events for a specific group by ID.
//    server.route({
//        method: 'GET',
//        path: '/api/groups/{groupId}',
//        handler: (request, reply) => {
//            // Is this a valid group?
//            const groupId = request.params.groupId;
//
//            if (isValid(groupId)) {
//                // This is a group we know, about so let's call Meetup and get its events...
//                Request.get({
//                    url: `${MEETUP_API_BASE_URL}/${groupId}?key=${MEETUP_API_KEY}&sign=true&photo-host=public&page=20&sign=true`,
//                    json: true
//                },
//                    (error, response, body) => {
//                        // This handles what comes back from Meetup...
//                        reply(body);
//                    });
//            } else {
//                // We don't know about that group...
//                reply({});
//            }
//
//        }
//    });
//
//    // Route to get events for a specific group by ID.
//    server.route({
//        method: 'GET',
//        path: '/api/events/{groupId}',
//        handler: (request, reply) => {
//            // Is this a valid group?
//            const groupId = request.params.groupId;
//
//            if (isValid(groupId)) {
//                // This is a group we know, about so let's call Meetup and get its events...
//                Request.get({
//                    url: `${MEETUP_API_BASE_URL}/${groupId}/events?key=${MEETUP_API_KEY}&sign=true&photo-host=public&page=20&sign=true`,
//                    json: true
//                },
//                    (error, response, body) => {
//                        // This handles what comes back from Meetup...
//                        reply(body);
//                    });
//            } else {
//                // We don't know about that group...
//                reply({});
//            }
//
//        }
//    });
//
//    server.route({
//        method: 'GET',
//        path: '/',
//        handler: function (request, h) {
//
//            return h.file('index.html');
//        }
//    });
//
//
//    await server.start();
//
//    console.log('Server running at:', server.info.uri);
//};
app.use("/api", router);

module.exports = app;

'use strict';

const { google } = require('googleapis');
const google_creds_key = require('./google-creds.json');
const uuidv1 = require('uuid/v1');
const mongo = require('mongodb');
const moment = require('moment');
const express = require('express'),
cors = require('cors'),
Request = require('request'),
path = require('path'),
MEETUP_API_BASE_URL = 'https://api.meetup.com',
MEETUP_API_KEY = process.env.MEETUP_API_KEY,     // From environment variable
MODERATOR_PASSWORD = process.env.MODERATOR_PASSWORD,
YYC_CONNECTION_STRING = process.env.YYC_CONNECTION_STRING,
GROUPS = require('./groups.json');
const SCOPES = 'https://www.googleapis.com/auth/calendar';

if(!MODERATOR_PASSWORD) {
    throw Error('No moderator password')
}
// configure mongo
const MongoClient = mongo.MongoClient;
const dbname = "yycdata";
const client = new MongoClient(YYC_CONNECTION_STRING);
let db = null;
client.connect(function(err) {
    if(err) {
        throw err;
    }
  db = client.db(dbname);
});


const app = express();
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());

const sharedCalendarId =  'ab5hq91hf260porloh3efsmsi8@group.calendar.google.com'
const router = express.Router();

// Google calendar creds
const auth = new google.auth.JWT(
    google_creds_key.client_email,
    null,
    google_creds_key.private_key,
    SCOPES,
    'yycdata-calendar@yycdata.iam.gserviceaccount.com'
);

const googleCalendarApi = google.calendar({ version: "v3", auth: auth });

function getGoogleCalendarEvents(calendarId) {
    auth.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            return;
        }
    });
    return googleCalendarApi.events.list({
        calendarId: calendarId,
        timeMin: moment().subtract(30, 'days').toISOString()
    })
    .then(res => {
        return res.data.items.map(item => {
            return {
                location : item.location,
                description : item.description,
                title : item.summary,
                start : item.start,
                end : item.end,
                link: extractEventLinkFromDesccription(item.description)
            }
        })
    });
}



// Check if a group is valid and return group
function isValid(groupId) {
    for (let group of GROUPS.groups) {
        if (group.id === groupId) {
            return group;
        }
    }
    return '';
}

router.get('/groups', (req, res) => {
    return res.json(GROUPS.groups)
})

function extractEventLinkFromDesccription(description) {
    const regex = /(https?:\/\/([a-zA-Z\d-]+\.){0,}meetup\.com(\/.*)?)/
    let result = description.match(regex);
    if(result) {
        return result[0];
    }
    const backupRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    result = description.match(backupRegex);
    if(result) {
        return result[0];
    }
    else {
        return null;
    }


}

// old meetup api
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
                // Tggis handles what comes back from Meetup...
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
    const group = isValid(groupId);

    if (group) {
        // This is a group we know, about so let's call Meetup and get its events...
        const calendarId = group.calendarId;
        if(calendarId) {
            getGoogleCalendarEvents(calendarId)
                .then(events => {
                    for (let x of events) {
                        x.groupName = group.name;
                    }
                    res.json(events)
                })
        }
        else {
            res.json([]);
        }
            //.catch(res.status(404).send("not found"))
    } else {
        // We don't know about that group...
        res.status(404).send('Not found');
    }

})
router.get('/events', (req, res) => {
    getGoogleCalendarEvents(sharedCalendarId)
        .then(events => {
            res.json(events)
        })
        .catch(err =>  {
            console.log(err);
            res.status(500).json(err)
        })

})

router.get('/opportunities', (req, res) => {

    const collection = db.collection('opportunities');
    collection.find({}).toArray(function (err, docs) {
        res.json(docs)
    });
})

router.post('/opportunities', (req, res) => {
    const opp = req.body;
    if (opp.moderatorPassword !== MODERATOR_PASSWORD) {
        console.log(opp);
        console.log(MODERATOR_PASSWORD);
        res.status(400).send("Not authorized")
        return;
    }
    const toInsert = {
        title: opp.title,
        description: opp.description,
        link: opp.link,
        id: uuidv1()
    }
    const collection = db.collection('opportunities');
    collection.insertOne(toInsert, (err, mongoRes) => {
        if(err != null) {
            console.log(err)
            res.status(500).json(err)
        }
        res.json({success: true});
    })
})

router.delete('/opportunities/:id', (req, res) => {
    const opp = req.body;
    console.log(opp);
    console.log(MODERATOR_PASSWORD)
    if (opp.moderatorPassword !== MODERATOR_PASSWORD) {
        res.status(400).send("Not authorized")
        return;
    }
    const id = new mongo.ObjectID(req.params.id);
    console.log(id)
    const collection = db.collection('opportunities');
    collection.deleteOne({_id: id}, (err, mongoRes) => {
        if(err != null) {
            console.log(err)
            res.status(500).json(err)
        }
        console.log(mongoRes);
        res.json({success: true});
    })
})

router.get('/events', (req, res) => {
    getGoogleCalendarEvents()
        .then(response => {
            response.data.items.map(item => {
                const evt = {
                    location: item.location,
                    description: item.description,
                    summary: item.summary,
                    start: item.start,
                    end: item.end
                }

            })
        })
        .error(err => {
            console.log(err);
            res.status(500).send(err)
        });

})


app.use("/api", router);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});


module.exports = app;



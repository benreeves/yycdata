'use strict';

const Hapi = require('hapi'),
	  server = new Hapi.Server(),
	  Request = require('request'),
	  MEETUP_API_BASE_URL = 'https://api.meetup.com',
	  MEETUP_API_KEY = process.env.MEETUP_API_KEY,     // From environment variable
	  MEETUP_GROUPS = require('./groups.json');

// Check if a group is valid.
function isValid(groupId) {
	for (let group of MEETUP_GROUPS.groups) {
		if (group.id === groupId) {
			return true;
		}
	}

	return false;
}

// Configure the server.
server.connection({
	host: '0.0.0.0',
	port: process.env.PORT || 8080,
	routes: {
		cors: true
	}
});

// Route to get all groups.
server.route({
	method: 'GET',
	path: '/groups',	
	handler: (request, reply) => {
		reply(MEETUP_GROUPS.groups);
	}
});

// Route to get events for a specific group by ID.
server.route({
	method: 'GET',
	path: '/groups/{groupId}',
	handler: (request, reply) => {
		// Is this a valid group?
		const groupId = request.params.groupId;

		if (isValid(groupId)) {
			// This is a group we know, about so let's call Meetup and get its events...
			Request.get({
				url: `${MEETUP_API_BASE_URL}/${groupId}?key=${MEETUP_API_KEY}&sign=true&photo-host=public&page=20&sign=true`,
				json: true
			},
			(error, response, body) => {
				// This handles what comes back from Meetup...
				reply(body);
			});
		} else {
			// We don't know about that group...
			reply({});
		}
		
	}
});

// Route to get events for a specific group by ID.
server.route({
	method: 'GET',
	path: '/events/{groupId}',
	handler: (request, reply) => {
		// Is this a valid group?
		const groupId = request.params.groupId;

		if (isValid(groupId)) {
			// This is a group we know, about so let's call Meetup and get its events...
			Request.get({
				url: `${MEETUP_API_BASE_URL}/${groupId}/events?key=${MEETUP_API_KEY}&sign=true&photo-host=public&page=20&sign=true`,
				json: true
			},
			(error, response, body) => {
				// This handles what comes back from Meetup...
				reply(body);
			});
		} else {
			// We don't know about that group...
			reply({});
		}
		
	}
});

// Start the server.
server.start((err) => {
	if (err) { 
		throw err;
	}

	console.log(`meetup-node-api server running at: ${server.info.uri}`);
});
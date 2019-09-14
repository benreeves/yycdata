import axios from 'axios';
import moment from 'moment';
import environment from '../environment';


function extractEvent(event) {
    const start = moment(event.start.dateTime);
    const end = moment(event.end.dateTime);
    return {
        start: new Date(start),
        end: new Date(end),
        title: event.title,
        location: event.location,
        link: event.link,
        groupName: event.groupName || 'Other/Past Event',
    }
}

function extractEventsFromResponse(response) {
    const data = response.data;
    const events = [];
    if (!data.length) return [];
    for (let i = 0; i < data.length; i++) {
        const event = data[i];
        events.push(extractEvent(event));
    }
    return events

}
const apiRoot = environment.apiRoot;

class EventsService {

    knownGroups = () => {
        return axios.get(apiRoot + '/groups')
            .then(response => {
                const data = response.data;
                return data;
            });
    }

    getEventsFor = (groupId) => {
        return axios.get(apiRoot + '/events/' + groupId)
            .then(extractEventsFromResponse)
            .catch(err => [])
    }


    listEvents = () => {
        // bit of a pain, because we have both well knownn groups and
        // miscellaneous events. First we need to fetch all the official 
        // well known events from each group's registered calendar. Next, 
        // we grab the list of all events and append any extras events 
        const wellKnownEventsPromise = this.knownGroups().then(groups => {
            const groupIds = groups.map(x => x.id);
            let requests = groupIds.map(this.getEventsFor)
            return Promise.all(requests)
                .then(eventsArrays => {
                    const reduced = eventsArrays.reduce((a, b) => a.concat(b))
                    return reduced;
                } )
        })

        const allEventsPromise = axios.get(apiRoot + '/events')
            .then(extractEventsFromResponse)
            .catch(err => []);

        return Promise.all([wellKnownEventsPromise, allEventsPromise])
            .then(eventCollection => {
                const wellKnown = eventCollection[0];
                const additional = eventCollection[1];
                const allEvents = [...wellKnown];

                const wellKnownMap = wellKnown.reduce(function(map, obj) {
                    map[obj.title] = obj
                    return map;
                }, {});

                for (let i = 0; i < additional.length; i++) {
                    const evt = additional[i];
                    if (!wellKnownMap[evt.title]) {
                        allEvents.push(evt);
                    }
                }
                return allEvents;
            })
            .catch(err => {
                console.log(err);
                return [];
        })
    }
}

const eventsService = new EventsService();

export default eventsService;
import React, { Component } from 'react';
import axios from 'axios';
import environment from './environment';
import Calendar from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment'

const apiRoot = environment.apiRoot;

const localizer = Calendar.momentLocalizer(moment)

class MyEvent extends Component {
  constructor(event) {
    super(event)
    this.state = { event: event.event }
  }

  handleClick = () => {
    console.log('clicked')
    window.open(this.state.event.resource.link);
  }

  render = () => {
    return (
      <div onClick={(e) => this.handleClick(e)}>
        <span><strong>{this.state.event.title} </strong></span>
      </div>

    )
  }
}


class YYCCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };

    this.setState = this.setState.bind(this);
    this.groups = this.groups.bind(this);


  }

  extendEvents = (old, toAdd) => {
    return old.concat(toAdd);
  }

  groups = () => {
    return axios.get(apiRoot + '/groups')
      .then(response => {
        const data = response.data;
        return data.map(x => x.id);
      });
  }

  getEventsFor = (group) => {
    return axios.get(apiRoot + '/events/' + group)
      .then(response => {
        const data = response.data;
        const events = [];
        if (!data.length) return [];
        for (let i = 0; i < data.length; i++) {
          const event = data[i];
          const start = moment(event.local_date + " " + event.local_time);
          const end = moment(start).add(event.duration, 'ms');
          events.push({
            start: new Date(start),
            end: new Date(end),
            title: event.name,
            resource: {
              venue: event.venue,
              group: group,
              link: event.link

            }
            ,

          })

          return events
        }

      })
  }

  componentDidMount = () => {
    this.setState({
      events: []
    })
    this.groups().then(groupIds => {
      let requests = groupIds.map(this.getEventsFor)
      Promise.all(requests)
        .then(eventsArrays => {
          let allEvents = eventsArrays.reduce((a, b) => a.concat(b))
          this.setState({ events: allEvents });
        })
    })

  }

  render() {
    return (
      <div className='m-2'>

        <h2>Upcoming Events</h2>
        <div className="mt-2">

        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          components={{ event: MyEvent }}
          style={{ height: "75vh" }}
        />
        </div>
      </div>
    );
  }
}

export default YYCCalendar;
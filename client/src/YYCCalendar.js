import React, { Component } from 'react';
import axios from 'axios';
import environment from './environment';
import Calendar from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import './YYCCalendar.css';
import hardcodeEvents from './hardcode-events';
import moment from 'moment'
import {isMobile} from 'react-device-detect';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const apiRoot = environment.apiRoot;

const localizer = Calendar.momentLocalizer(moment)

class Event extends Component {
  constructor(event) {
    super(event)
    this.state = { event: event.event, modal: false }
  }

  handleClick = () => {
    this.toggle();
  }
  openLink = () => {
    window.open(this.props.event.resource.link);
  }

  toggle = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }
}

class CalendarEvent extends Event {
  render = () => {
    return (
      <div onClick={(e) => this.handleClick(e)}>
        <span><strong>{this.state.event.title} </strong></span>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.state.event.title}</ModalHeader>
          <ModalBody>
            <ul>
              <li>Presented by: <span><b>{this.props.event.resource.groupName}</b></span></li>
              <li>Location: {this.props.event.resource.venue.name}</li>
              <li>Start: {moment(this.props.event.start).format("dddd, MMMM Do YYYY, h:mm a")}</li>
              <li>End: {moment(this.props.event.end).format("dddd, MMMM Do YYYY, h:mm a")}</li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.openLink}>Event Link</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

class AgendaEvent extends Event {
  render = () => {
    return (
      <div onClick={(e) => this.handleClick(e)}>
        <b>{this.state.event.title}</b>
        <div>Presented by: <span><b>{this.state.event.resource.groupName}</b></span></div>
        <div>Location: <span><b>{this.state.event.resource.venue.name}</b></span></div>
        <div><Button outline color="primary" size="sm" onClick={this.openLink}>Link</Button></div>
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
              link: event.link,
              groupName: event.groupName
            },
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
          allEvents = allEvents.concat(hardcodeEvents);
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
            defaultView={isMobile ? "agenda" : "month"}
            views={['month', 'week', 'agenda']}
            events={this.state.events}
            components={{ 
              month: { event: CalendarEvent },
              week: { event: CalendarEvent },
              agenda: { event: AgendaEvent },
             }}
            style={{ height: "75vh" }}
          />
        </div>
      </div>
    );
  }
}

export default YYCCalendar;
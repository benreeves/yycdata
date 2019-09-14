import React, { Component } from 'react';
import axios from 'axios';
import environment from './environment';
import Calendar from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import './YYCCalendar.css';
import hardcodeEvents from './hardcode-events';
import moment from 'moment'
import { isMobile } from 'react-device-detect';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import events from './services/events-service'

const apiRoot = environment.apiRoot;

const localizer = Calendar.momentLocalizer(moment)

// class EventSpec {
//   constructor(title, venue, group, start, end, link) {
//     this.title = title;
//     this.venue = venue;
//     this.group = group;
//     this.start = start;
//     this.end = end;
//     this.link = link;
//   }
// }

class Event extends Component {
  constructor(event) {
    super(event)
    this.state = { event: event.event, modal: false }
  }

  handleClick = () => {
    this.toggle();
  }
  openLink = () => {
    const l = this.props.event.link;
    if(!l.match(/^http/)) {
      window.open('http://' + this.props.event.link);

    } else {
      window.open(this.props.event.link);
    }
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
              <li>Presented by: <span><b>{this.props.event.groupName}</b></span></li>
              <li>Location: {this.props.event.location}</li>
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
        <div>Presented by: <span><b>{this.state.event.groupName}</b></span></div>
        <div>Location: <span><b>{this.state.event.location}</b></span></div>
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
  }

  componentDidMount = () => {
    this.setState({
      events: []
    })
    events.listEvents()
      .then(eventsArray => {
          this.setState({ events: eventsArray });

      })
  }

  openGCal = () => {
    window.open('https://calendar.google.com/calendar/embed?src=ab5hq91hf260porloh3efsmsi8%40group.calendar.google.com&ctz=America%2FEdmonton')
  }

  render() {
    return (
      <div className='m-2'>
        <Container fluid={true}>
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
            <div className='mt-2'>
              <Row noGutters={true}>
                <a style={{marginLeft: '12px'}} href='https://calendar.google.com/calendar/ical/ab5hq91hf260porloh3efsmsi8%40group.calendar.google.com/public/basic.ics'><span><FontAwesomeIcon icon={faCalendar} size="md" /></span> iCal Link </a>
              </Row>
              <Row noGutters={true}>
                <Button onClick={this.openGCal} outline color='primary'><FontAwesomeIcon icon={faCalendar} size="md" /> Open in Google Calendar </Button>
              </Row>
              {/* <i style={{fontSize:'24px'}} className="fa">&#xf073;</i> */}
              {/* <button style="font-size:24px">Button <i class="fa fa-calendar"></i></button> */}
            </div>
        </Container>
      </div>
    );
  }
}

export default YYCCalendar;
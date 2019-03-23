import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Calendar from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const meetups = [
  'PyData-Calgary',
  'calgaryr',
  'Data-For-Good-Calgary',
  'meetup-group-wmHrkGoA', //calgary artificial intelligence
  'Women-in-Big-Data-Calgary',
  'untappedenergy',
  'Calgary-Deep-Learning-Meetup',
  'CivicTechYYC-Tech-for-Good',
]

const apiRoot = 'http://localhost:8080'

const localizer = Calendar.momentLocalizer(moment) 

class YYCCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [
        {
          start: new Date(),
          end: new Date(moment().add(1, "days")),
          title: "Some title"
        }
      ]
    };

    this.setState = this.setState.bind(this);


  }

  extendEvents = (old, toAdd) => {
    return old.concat(toAdd);
  }

  componentDidMount = () => {
    this.setState({
      events: [
        {
          start: new Date(),
          end: new Date(moment().add(1, "days")),
          title: "Some title 2"
        }
      ]
    })
    axios.get(apiRoot + '/events/PyData-Calgary')
      .then(response =>  {
        console.log(response);
        const data = response.data;
        const events = [];
        if(!data.length) return;
        for(let i = 0; i < data.length; i++) {
          const event = data[i];
          const start = moment(event.local_date + " " + event.local_time);
          const end = start.add(event.duration, 'ms');

          events.push({
            start: start,
            end: end,
            title: event.name,
            resource: event.venue.name

          })
        }
        const newEvents = this.extendEvents(this.state.events, events);
        this.setState({events: newEvents})
      })
  }

  render() {
    return (
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          style={{ height: "100vh" }}
        />
    );
  }
}


function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/calendar">YYCCalendar</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/calendar" component={YYCCalendar} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>
  );
};

export default AppRouter;

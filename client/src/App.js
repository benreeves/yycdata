import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import environment from './environment';
import Calendar from 'react-big-calendar'
import Members from './Members'
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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

    // axios.get(apiRoot + '/events/PyData-Calgary')
    //   .then(response =>  {
    //     console.log(response);
    //     const data = response.data;
    //     const events = [];
    //     if(!data.length) return;
    //     for(let i = 0; i < data.length; i++) {
    //       const event = data[i];
    //       const start = moment(event.local_date + " " + event.local_time);
    //       const end = start.add(event.duration, 'ms');

    //       events.push({
    //         start: start,
    //         end: end,
    //         title: event.name,
    //         resource: event.venue.name

    //       })
    //     }
    //     const newEvents = this.extendEvents(this.state.events, events);
    //     this.setState({events: newEvents})
    //   })
  }

  render() {
    return (
      <div>

        <h2>Upcoming Events</h2>
        <div className="mt-2">

        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          components={{ event: MyEvent }}
          style={{ height: "100vh" }}
        />
        </div>
      </div>
    );
  }
}


function Index() {
  return (
    <div className="yyc-bg-full">
      <div className="landing-content">
        <table style={{height: "inherit"}}>
          <tbody>
            <tr>
              <td class="align-bottom">
                <div className="row-fluid">
                  <div className="col offset-2">
                    <span className="sp-sub-title">Empowering Calgary</span>
                    <h3 className="sp-title">Calgary Data Science Collective</h3>
                    <p>
                      We are focused on bringing education, professional development, and inspiration for all things data
                    </p>
                    <Link className="site-btn light" to="/calendar">Upcoming Events</Link>
                  </div>
                </div>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function About() {
  return <h2>About</h2>;
}

function Groups() {
  return <h2>Groups</h2>;
}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark yyc-red">
          <a className="navbar-brand" href="#">YYC Data Collective</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/calendar">Events</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/members">Members</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/groups">Get Involvd</Link>
              </li>
            </ul>
          </div>

        </nav>

        <div className="app-content">
          <Route path="/" exact component={Index} />
          <Route path="/calendar" component={YYCCalendar} />
          <Route path="/about" component={About} />
          <Route path="/groups" component={Groups} />
          <Route path="/members" component={Members} />
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;

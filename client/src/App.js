import React from 'react';
import YYCCalendar from './YYCCalendar';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';
import './App.css';
import Members from './Members'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function Index() {
  return (
    <div className="yyc-bg-full">
      <div className="landing-content">
        <table style={{ height: "inherit", width: "100%" }}>
          <tbody>
            <tr>
              <td className="align-bottom">
                <div className="row-fluid">
                  <div className="landing-content-bg mb-5">
                    <div className="row">
                      <div className="col offset-2">
                        <span className="sp-sub-title">Empowering Calgary</span>
                        <h3 className="sp-title">Calgary Data Science Collective</h3>
                        <p>
                          We are focused on bringing education, professional development, and inspiration to Calgary with all things data
                      </p>
                        <Link className="site-btn light" to="/calendar">Upcoming Events</Link>
                      </div>
                    </div>
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

// function AppRouter() {
//   return (
//     <Router>
//       <div>
//         <nav className="navbar navbar-expand-lg navbar-dark bg-dark yyc-red">
//           <a className="navbar-brand" href="#">YYC Data Collective</a>
//           <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul className="navbar-nav mr-auto">
//               <li className="nav-item">
//                 <Link className="nav-link" to="/">Home</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/calendar">Events</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/about">About</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/members">Members</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/groups">Get Involved</Link>
//               </li>
//             </ul>
//           </div>

//         </nav>

//         <div className="app-content">
//           <Route path="/" exact component={Index} />
//           <Route path="/calendar" component={YYCCalendar} />
//           <Route path="/about" component={About} />
//           <Route path="/groups" component={Groups} />
//           <Route path="/members" component={Members} />
//         </div>
//       </div>
//     </Router>
//   );
// };

class AppRouter extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <Router>
        <div>
          <Navbar color="dark" dark expand="md" className="yyc-red">
            <NavbarBrand href="/">YYC Data Collective</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink href="/calendar">Calendar</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/about">About</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/members">Members</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/join">Join</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
          {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark yyc-red">
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
                <Link className="nav-link" to="/groups">Get Involved</Link>
              </li>
            </ul>
          </div>

        </nav> */}

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
  }
}

export default AppRouter;

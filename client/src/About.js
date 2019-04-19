import { Jumbotron } from 'reactstrap';
import React from 'react';
import './About.css';

function About() {
    return (
        <div>
            <Jumbotron className="yyc-dark no-border no-margin">
                <div className="container">
                    <div className="row">
                        <div className="col-md content-wrapper">
                            <h1 className="jumbotron-title">
                                <p>The Collective Mission</p>
                            </h1>
                            <h4 className="jumbotron-subtitle">
                                <p>Creating and supporting communities with a passion for data</p>
                            </h4>
                        </div>

                    </div>
                </div>
            </Jumbotron>
            <div>
                <div className="row background-ultra-light-gray p-3">
                    <div className="col-lg-5 text-center">
                        <img src="https://via.placeholder.com/300" alt=""></img>
                    </div>
                    <div className="col-lg-7 vertical-center">
                        <div className="p-4">
                            <h2>Our Value Statement</h2>
                            <p>
                                For Calgary, we aim to expose the inspiring work performed by the various communities in the
                                city and connect people and organizations with the communities that will aid in their personal
                                and professional development.
                            </p>
                            <br></br>
                            <p>
                                For our members, we support them with communication, event planning, funding, and venue securement.
                                We ensure that our members have access to all the tools they need to bring life to their ideas, ranging
                                from connecting datathon planners with corporate sponsors to booking coworking spaces for working groups.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row background-darker-light-gray p-3 flex-row-reverse">
                    <div className="col-lg-5 text-center">
                        <img src="https://via.placeholder.com/300" alt=""></img>
                    </div>
                    <div className="col-lg-7 vertical-center">
                        <div className="p-4">
                            <h2>Our Founding</h2>
                            <p>
                                We started as a loose collection of community organizations related to data science and
                                data management. As our communities grew, we realized that we could accomplish more through collaboration
                                and teamwork. The Collective was born out of a desire to empower the local data communities through
                                centralized communication, funding, and joint events
                    </p>
                        </div>
                    </div>
                </div>
                <div className="row background-ultra-light-gray p-3">
                    <div className="col-lg-5 text-center">
                        <img src="https://via.placeholder.com/300" alt=""></img>
                    </div>
                    <div className="col-lg-7 vertical-center">
                        <div className="p-4">
                            <h2>Our Members</h2>
                            <p>
                                We partner with local, Calgary based organizations looking to create positive growth in the
                                data space. We connect community endeavours with innovative companies and academic institutions
                                for mutual success. From the largest organizations drawing hundreds of passionate indiviudals with
                                every event, to the smallest working groups - we embrace them all and help them to achieve their goals
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;
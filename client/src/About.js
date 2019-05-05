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
                        <img className="about-img" src="stock1.jpg" alt=""></img>
                    </div>
                    <div className="col-lg-7 vertical-center">
                        <div className="p-4">
                            <h2>Our Founding</h2>
                            <p>
                                Over a short amount of time, the amount of interest in data science in Calgary has grown exponentially.
                                Many groups were formed from this interest but we all shared the same goals, vision and strategy.
                                The Collective was born out of a desire to empower the local data communities through centralized communication,
                                funding, and joint events. The YYC Data Collective was formed to consolidate this mission and make sure we are
                                driving towards it. By banding together, we become more visible and influential.
                            </p>

                        </div>
                    </div>
                </div>
                <div className="row background-darker-light-gray p-3 flex-row-reverse">
                    <div className="col-lg-5 text-center">
                        <img className="about-img" src="/stock2.jpg" alt=""></img>
                    </div>
                    <div className="col-lg-7 vertical-center">
                        <div className="p-4">
                            <h2>Our Mission</h2>
                            <p>
                            Calgary is a dynamic and innovative place with a lot of local talent and activity in the data space.
                            The goal of every organization in the collective is to drive towards creating a strong foundation 
                            in data science, machine learning, AI and other related fields. This is accomplished by providing
                             education opportunities, exposing work that is happening in this city right now, and connecting
                             talented people.
                            </p>
                            <p>
                            Currently, the main role of the collective is communication. We provide a central platform to learn about this community and
                            find out what's happening. Long term, the collective hopes to run larger scale events and become a place where people come
                            to help build additional opportunities in this space.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row background-ultra-light-gray p-3">
                    <div className="col-lg-5 text-center">
                        <img className="about-img" src="/stock3.jpg" alt=""></img>
                    </div>
                    <div className="col-lg-7 vertical-center">
                        <div className="p-4">
                            <h2>Our Members</h2>
                            <p>
                                We partner with local, Calgary based organizations looking to create positive growth in the data
                                space. All of the members of the collective support the mission and long term goals of the 
                                collective. We connect community endeavours with innovative companies and academic institutions
                                for mutual success. Going forward, we will help advise, consolidate and facilitate additional efforts in this
                                space, especially if they are challenging to fit in the existing member framework.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;
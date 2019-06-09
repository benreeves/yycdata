import React, { Component } from 'react';
import {Button} from 'reactstrap';
import axios from 'axios';
import environment from './environment';
import groups from './groups';

const apiRoot = environment.apiRoot;

class Members extends Component {
    constructor(props) {
        super(props)
        const g = [...groups];
        g.sort(x => x.id);
        this.state = {
            groups: g
        };
    }

    componentDidMount = () => {
        Promise.all(this.state.groups.map(x => axios.get(apiRoot + `/groups/${x.id}`)))
            .then(x => {
                return x.map(x => x.data);
            })
            .then(fetchedGroups => {
                fetchedGroups.sort(x => x.urlname)
                const merged = [];
                for (let i = 0; i < fetchedGroups.length; i++) {
                    const x = this.state.groups[i];
                    const y = fetchedGroups[i];
                    console.log(y);
                    if (x.id.toLowerCase() !== y.urlname.toLowerCase()) {
                        console.log(`WARNNG: Mismatched groups ${x.id} ${y.urlname}`);
                        continue;
                    }
                    merged.push({ ...y, shortDescription: x.shortDescription });
                }
                this.setState({ groups: merged });
            });
    }
  openLink = (link) => {
    window.open(link);
  }

    render = () => {
        return (
            <div className="container-fluid mt-3">
                <h2 className="ml-3 mb-2">Who We Are</h2>
                <div class="d-flex flex-row flex-wrap">

                    {this.state.groups.map((group, i) => {
                        let photo = (group.group_photo && group.group_photo.photo_link)
                            || (group.key_photo && group.key_photo.photo_link)
                            || "http://placehold.it/300x200";

                        return <div className="col-lg-4 col-xl-3 mb-5">
                            <div className="card h-100">
                                <div className="meetup-img-card-wrapper">
                                    <img className="card-img-top meetup-img" src={photo} alt="" />
                                </div>
                                <div className="card-body">
                                    <h4 className="card-title">{group.name}</h4>
                                    <p className="card-text">{group.shortDescription}</p>
                                </div>
                                <div className="card-footer">
                                    <Button color="primary" onClick={() => this.openLink(group.link)}>Find Out More!</Button>
                                </div>
                            </div>
                        </div>

                    })}
                    <div className="col-lg-4 col-xl-3 mb-5">
                        <div className="card h-100">
                            <div className="meetup-img-card-wrapper">
                                <img className="card-img-top meetup-img" src="/ADALogo.jpg" alt="" />
                            </div>
                            <div className="card-body">
                                <h4 className="card-title">Alberta Data Architecture</h4>
                                <p className="card-text">
                                Alberta Data Architecture (ADA) meets regularly to discuss all things data - architecture,
                                 analysis, modeling, technologies, etc. Our format is interactive, with a few brief contributions 
                                 by experts/practitioners, followed by an interactive discussion between contributors and attendees.
                                </p>
                            </div>
                            <div className="card-footer">
                                <Button color="primary" onClick={() => this.openLink("http://albertadataarchitecture.org/")}>Find Out More!</Button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-xl-3 mb-5">
                        <div className="card h-100">
                            <div className="meetup-img-card-wrapper">
                                <img className="card-img-top meetup-img" src="/DAMALogo.png" alt="" />
                            </div>
                            <div className="card-body">
                                <h4 className="card-title">DAMA</h4>
                                <p className="card-text">
                                DAMA's mission is to provide a non-profit, vendor-independent association where data professionals 
                                can go for help and assistance. They aim to To provide the best practice resources such as the DMBoK 
                                and DM Dictionary of Terms in a mechanism that reaches as many DM professionals as possible and
                                to create a trusted environment for DM professionals to collaborate and communicate.
                                They meet the 3rd Thursday of the month at 8AM.
                                </p>
                            </div>
                            <div className="card-footer">
                                <Button color="primary" onClick={() => this.openLink("http://www.dama-calgary.org/")}>Find Out More!</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

export default Members;
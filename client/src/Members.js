import React, { Component } from 'react';
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
                    if (x.id.toLowerCase() !== y.urlname.toLowerCase()) {
                        console.log(`WARNNG: Mismatched groups ${x.id} ${y.urlname}`);
                        continue;
                    }
                    merged.push({ ...y, shortDescription: x.shortDescription });
                }
                console.log(merged);
                this.setState({ groups: merged });
            });
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
                                    <a href={group.link} className="btn btn-primary">Find Out More!</a>
                                </div>
                            </div>
                        </div>

                    })}
                </div>
            </div>


        )
    }
}

export default Members;
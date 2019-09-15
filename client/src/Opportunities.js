import React from 'react';
import axios from 'axios';
import './Opportunities.css';
import environment from './environment';
import {
    Card, CardBody, CardTitle, CardText, CardLink, Container, Row, Col,
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, 
    Popover, PopoverHeader, PopoverBody
} from 'reactstrap';
import { MdAddCircle } from 'react-icons/md'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { DH_NOT_SUITABLE_GENERATOR } from 'constants';

const apiRoot = environment.apiRoot;

class Opportunity extends React.Component {
    constructor(props) {
        super(props)
        this.state = { deleting: false, moderatorPassword: '' };
    }
    openLink = () => {
        window.open(this.props.link);
    }

    removeOpportunity = () => {
        const callback = this.props.deleteCallback;
        const id = this.props._id;
        callback(id, this.state.moderatorPassword);
    }

    toggleDelete = () => {
        this.setState({
            ...this.state,
            deleting: !this.state.deleting
        });
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        
        console.log(this.state.moderatorPassword);
    }

    render() {
        return (
            <div>
                <Card outline color="danger">
                    <CardBody>
                        <CardTitle><strong>{this.props.title}</strong></CardTitle>
                        <CardText>{this.props.description}</CardText>
                        {this.props.link && <CardLink href="#" onClick={(e) => this.openLink()}>Link</CardLink>}
                        <CardLink href="#" onClick={(e) => this.toggleDelete()}>Admin Delete</CardLink>
                        {this.state.deleting &&
                            <Form>
                                <FormGroup>
                                    <Label for="examplePassword">Moderator Password</Label>
                                    <Input onChange={this.handleInputChange} type="password" name="moderatorPassword" id="moderatorPassword" placeholder="Moderator Pasword" />
                                </FormGroup>
                                <Button onClick={this.removeOpportunity}>Confirm</Button>
                            </Form>
                        }
                    </CardBody>
                </Card>
            </div>
        )
    }
}

class OpportunityBoard extends React.Component {
    constructor(props) {
        super(props)
        this.state = { opportunities: [], modal: false, popoverOpen: false }
    }

    addOpportunity = (opportunity) => {
        const currentOpportunities = this.state.opportunities;
        currentOpportunities.push(opportunity);
        this.setState({
            ...this.state,
            opportunities: currentOpportunities
        })
    }

    removeOpportunity = (id, moderatorPassword) => {
        axios.delete(apiRoot + '/opportunities/' + id, { data: {moderatorPassword: moderatorPassword }})
            .then(_ => {
                const opps = this.state.opportunities;
                const index = opps.map(x => {
                    return x._id;
                }).indexOf(id);
                opps.splice(index, 1);
                this.setState({ opportunities: opps });
                alert('ok')
            })
            .catch(err => {
                if(err.response.status === 400) {
                    alert('Wrong password');
                }
                else {
                    console.log(err);
                    alert('Oh no a bug. Try again then hit Ben up.');
                    this.toggle();
                }
            });
            
    }

    createOpportunity = (opp) => {
        axios.post(apiRoot + '/opportunities', opp)
            .then(_ => {
                this.addOpportunity(opp);
                this.toggle();
            })
            .catch(err => {
                if(err.response.status === 400) {
                    alert('Wrong password');
                }
                else {
                    console.log(err);
                    alert('Oh no a bug. Try again then hit Ben up.');
                    this.toggle();
                }
            });
            
    }


    componentDidMount = () => {
        axios.get(apiRoot + `/opportunities`)
            .then(response => {
                const d = response.data;
                for (let i = 0; i < d.length; i++) {
                    const opp = d[i];
                    console.log(opp)
                    this.addOpportunity(opp)
                }
            })
    }

    toggle = () => {
        this.setState({
            ...this.state,
            modal: !this.state.modal
        });
    }

    togglePopover = () => {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render = () => {
        return (
            <Container>
                {/* {this.state.opportunities} */}
                <h2>Opportunities Board</h2>
                <p>
                    Find local opportunities for data science positions, calls for speakers, and volunteer experience. To request an opportunity added to the page,
                    post the opportunity on the opportunities channel in our
                    <a href='https://join.slack.com/t/yycdatacommunity/shared_invite/enQtNzQwMzAxODQzODk1LTM2OGQ2YzY5ZTcwZjVjN2JlOWMwZWRkZjMxZjEyMDE1YTY5MWU3NTcxNzA5YjVkZDk2YjY5YWVhOGQxMWI1MTc'> slack </a>
                    or email <a href="mailto:breeves@viewpointgroup.ca?subject=Data Science Opportunity">breeves@viewpointgroup.ca</a>
                    <span> <FontAwesomeIcon id="Popover1" icon={faInfoCircle} ></FontAwesomeIcon></span>
                </p>
                {this.state.opportunities.map((value, index) => {
                    return (
                        <div key={value.id}>
                            <div className='pt-2'></div>
                            <Row>
                                <Col>
                                    <Opportunity title={value.title} description={value.description} link={value.link} _id={value._id} deleteCallback={this.removeOpportunity}></Opportunity>
                                </Col>
                            </Row>
                        </div>
                    )
                })}
                <div className="mt-2" style={{ color: '#88111b' }}>
                    <Button onClick={(e) => this.toggle()}><MdAddCircle size={32} /> Add Opportunity</Button>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add new Opportunity</ModalHeader>
                    <ModalBody>
                        <AddOpportunityForm handleSubmit={this.createOpportunity}></AddOpportunityForm>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.togglePopover}>
                    <PopoverHeader>Dev note</PopoverHeader>
                    <PopoverBody>This page (and site) under active development. Please have patience as we work out the kinks. If you have a recommendation, reach out to Ben Reeves over our slack channel</PopoverBody>
                </Popover>
            </Container>
        )
    }
}


class AddOpportunityForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            link: "",
            moderatorPassword: ""
        };

    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    submit = () => {
        const submit = {
            title: this.state.title,
            description: this.state.description,
            link: this.state.link,
            moderatorPassword: this.state.moderatorPassword
        }
        this.props.handleSubmit(submit);
    }

    render = () => {
        return (
            <Form>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input onChange={this.handleInputChange} type="text" name="title" id="title" placeholder="Opportunity Title" />
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input onChange={this.handleInputChange} type="textarea" name="description" id="description" />
                </FormGroup>
                <FormGroup>
                    <Label for="title">Link</Label>
                    <Input onChange={this.handleInputChange} type="text" name="link" id="link" placeholder="Link" />
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword">Moderator Password</Label>
                    <Input onChange={this.handleInputChange} type="password" name="moderatorPassword" id="moderatorPassword" placeholder="Moderator Pasword" />
                </FormGroup>
                <Button onClick={this.submit}>Submit</Button>
            </Form>
        );
    }
}


class OpportunitiesPage extends React.Component {
    render = () => {
        return (
            <div className='m-2'>
                <div className="mt-2">
                    <OpportunityBoard />
                </div>
            </div>
        )
    }
}


export default OpportunitiesPage;
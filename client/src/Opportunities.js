import React from 'react';
import axios from 'axios';
import './Opportunities.css';
import environment from './environment';
import {
    Card, CardBody, CardTitle, CardText, CardLink, Container, Row, Col,
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, FormText
} from 'reactstrap';
import { MdAddCircle } from 'react-icons/md'

const apiRoot = environment.apiRoot;

class Opportunity extends React.Component {
    constructor(props) {
        super(props)
    }
    openLink = () => {
        window.open(this.props.link);
    }


    render() {
        return (
            <div>
                <Card body outline color="danger">
                        <CardTitle><strong>{this.props.title}</strong></CardTitle>
                    <CardBody>
                        <CardText>{this.props.description}</CardText>
                    </CardBody>
                    {this.props.link && <CardLink onClick={(e) => this.openLink()}>Link</CardLink> }
                </Card>
            </div>
            // <Card>
            //     <Card.Body>
            //         <Card.Title>{this.props.title}</Card.Title>
            //         <Card.Text>{this.props.description}</Card.Text>
            //     </Card.Body>
            //     <Card.Link onClick={(e) => this.handleClick(e)}>Link</Card.Link>
            // </Card>
            // <Card>
            //     <Card.Body>
            //         <Card.Title>Title</Card.Title>
            //         <Card.Text>Hello</Card.Text>
            //     </Card.Body>
            //     <Card.Link onClick={(e) => this.handleClick(e)}>Link</Card.Link>
            // </Card>
        )
    }
}

class OpportunityBoard extends React.Component {
    constructor(props) {
        super(props)
        this.state = { opportunities: [], modal: false }
    }

    addOpportunity = (opportunity) => {
        const currentOpportunities = this.state.opportunities;
        currentOpportunities.push(opportunity);
        this.setState({
            ...this.state,
            opportunities: currentOpportunities
        })
    }

    removeOpportunity = (opp) => {
        axios.delete(apiRoot + '/opportunities', opp)
            .then(console.log)
    }

    createOpportunity = (opp) => {
        axios.post(apiRoot + '/opportunities', opp)
            .then(console.log)
    }


    componentDidMount = () => {
        for (let opp of sampleOpps) {
            this.addOpportunity(opp);
        }
        axios.get(apiRoot + `/opportunities`)
            .then(console.log)
    }

    toggle = () => {
        this.setState({
            ...this.state,
            modal: !this.state.modal
        });
    }

    render = () => {
        return (
            <Container>
                {/* {this.state.opportunities} */}
                <h2>Opportunities Board</h2>
                {this.state.opportunities.map((value, index) => {
                    return (
                        <div key={value.id}>
                            <div className='pt-2'></div>
                            <Row>
                                <Col>
                                    <Opportunity title={value.title} description={value.description} link={value.link}></Opportunity>
                                </Col>
                            </Row>
                        </div>
                    )
                })}
                <div style={{ color: '#88111b' }}>
                    <MdAddCircle size={32} onClick={(e) => this.toggle()} />
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
           moderatorPasssword: this.state.moderatorPassword
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

const sampleOpps = [
    { id: "1", title: "job", description: "lots of jobs", link: "www.example.com" },
    { id: "2", title: "job", description: "lots of jobs", link: "www.example.com" },
    { id: "3", title: "job", description: "lots of jobs", link: "www.example.com" },
    { id: "4", title: "job", description: "lots of jobs", link: "www.example.com" },
]

export default OpportunitiesPage;
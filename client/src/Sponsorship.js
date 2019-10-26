import React, { Component } from 'react';
import { Col, Container, Row, Media} from 'reactstrap';
import {Button} from 'reactstrap';
import sponsorships from "./sponsorships"

const imgStyle = {
    maxWidth: "100%"
}

const textStyle = {
    "text-align": "center"
}

const autoStyle = {
    "margin-top": "auto",
    "margin-bottom": "auto"
}
const x = {
    "min-height": "90vh"
}


class Sponsorship extends Component {
    constructor(props) {
	super(props)
    }

    render = () => {
	return (
	    <Row style={x}>
		<Container style={autoStyle}>
		    <h1 style={textStyle}> Thank you to our Sponsors! </h1>
		    <Row>
			{sponsorships.sponsorships.map(sponsor => {
			    return (
				<Col md="4">
				    <a href={sponsor.sponsorURL}>
					<Media className="p-4" object src={sponsor.logoURL} style={imgStyle} alt={sponsor.name}/>
				    </a>
				</Col>
			    )
			})
			}
		    </Row>
		</Container>
	    </Row>
	)
    }
}

export default Sponsorship;

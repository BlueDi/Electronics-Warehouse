import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import logo from '@assets/images/logo.png';
import './styles/Home.scss';
import { PageTitle } from '@common/components';

class Home extends Component {
  render() {
    return (
      <PageTitle title="Home">
        <Card centered color="brown">
          <Image src={logo} />
          <Card.Content>
            <Card.Header>Welcome to the Warehouse</Card.Header>
            <Card.Description>
              To get started, log in to your UP account.
            </Card.Description>
          </Card.Content>
        </Card>
      </PageTitle>
    );
  }
}

export default Home;

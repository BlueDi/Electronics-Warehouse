import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '@assets/images/logo.png'; // example of import assets image
import './styles/Home.scss';
import { service } from '@utils';
import { PageTitle } from '@common/components';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: '',
      showSidebar: true
    };
  }

  componentDidMount() {
    service
      .get('/hello')
      .then(result => {
        this.setState({
          response: result.data,
          isFetching: false
        });
      })
      .catch(e => {
        console.log(e, 'Failed to fetch service data.');
      });
  }

  render() {
    return (
      <PageTitle title="Home">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">{this.state.response}</p>
        <p>
          To get started, edit
          <code>src/App.js</code>
          and save to reload.
        </p>
        <p>
          <Link to="/table/1">Table Example</Link>
        </p>
        <p>
          <Link to="/table/2">Table Example2</Link>
        </p>
      </PageTitle>
    );
  }
}

export default Home;

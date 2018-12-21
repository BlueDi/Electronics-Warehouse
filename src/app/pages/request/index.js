import React, { Component } from 'react';
import {
  Header,
  Grid,
  Input,
  Button,
  Divider,
  Message
} from 'semantic-ui-react';
import { PageTitle, Loader } from '@common/components';
import { service } from '@utils';
import { withCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import RequestInfoGrid from './RequestInfoGrid';

/**
 * Page of a single request
 * @extends Component
 */
class Request extends Component {
  /**
   * Constructor of the page
   * @param {Object} props The properties of the component
   */
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id || props.match.params.id,
      user_permissions: -1,
      cost_center: undefined,
      error: false,
      fetching: 0,
      user_id: this.props.cookies.get('id') || -1,
      items: undefined,
      request: undefined
    };
  }

  /**
   * When component has mounted
   */
  componentDidMount() {
    this.getRole();
    this.getRequestInfo();
    this.getRequestItems();
  }

  /**
   * Callback function when cost center is altered
   * @param  {Object} e Event representing the change
   */
  costCenterChange(e) {
    this.setState({ cost_center: e.target.value, error: false });
  }

  /**
   * Gets the user permissions from the server
   */
  getRole() {
    if (this.state.user_id === -1) return;

    const urlGetRole = `/user_permissions/${this.state.user_id}`;
    service
      .get(urlGetRole)
      .then(response => {
        this.setState({
          user_permissions: response.data.user_permissions,
          fetching: this.state.fetching + 1
        });
      })
      .catch(e => {
        throw e;
      });
  }

  /**
   * Gets the request info from the server
   */
  getRequestInfo() {
    const apiUrl = `/request/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        this.setState({
          request: response.data[0],
          fetching: this.state.fetching + 1
        });
      })
      .catch(e => {
        throw e;
      });
  }

  /**
   * Fetches the items associated with the request from the server
   */
  getRequestItems() {
    const apiUrl = `/request_items/${this.state.id}`;
    service
      .get(apiUrl)
      .then(response => {
        let items = response.data;
        items.forEach(function(item) {
          item.image = item.image.data
            .map(x => String.fromCharCode(x))
            .join('');
          item.details = {
            details: item.details,
            manufacturer: item.manufacturer
          };
        });
        this.setState({
          items: response.data || [],
          fetching: this.state.fetching + 1
        });
      })
      .catch(e => {
        throw e;
      });
  }

  /**
   * Generic callback function to handle a decision to either accept or reject the request
   * @param  {Boolean} is_accept Whether the decision was to accept or not
   */
  handleDecision(is_accept) {
    let cost_center = this.state.cost_center;
    let apiUrl = `/none`,
      acceptID = undefined,
      dateID = undefined,
      is_manager = this.state.user_permissions === 3,
      is_professor = this.state.user_permissions === 2;
    if (is_professor) {
      apiUrl = `/request_evaluate_professor`;
      acceptID = 'professor_accept';
      dateID = 'date_professor_evaluated';
    } else if (is_manager) {
      apiUrl = `/request_evaluate_manager`;
      acceptID = 'manager_accept';
      dateID = 'date_manager_evaluated';
    }

    console.log(cost_center);
    if (
      !is_accept ||
      is_manager ||
      (cost_center !== undefined &&
        cost_center != null &&
        cost_center.length > 0)
    ) {
      const reqBody = { id: this.state.id, accept: is_accept, cost_center };
      service
        .post(apiUrl, reqBody)
        .then(response => {
          let update = this.state.request;
          update[acceptID] = is_accept;
          update[dateID] = response.data.date;
          this.setState({ request: update, cost_center: '' });
        })
        .catch(e => {
          throw e;
        });
    } else {
      if (is_accept) {
        this.setState({ error: true });
      }
    }
  }

  /**
   * Callback on accept
   */
  handleAccept() {
    this.handleDecision(true);
  }

  /**
   * Callback on reject
   */
  handleReject() {
    this.handleDecision(false);
  }

  /**
   * Renders the page while it is still fetching data from the server
   * @return {Object} React object representing the page
   */
  renderFetching() {
    return (
      <PageTitle key="Request" title="Request">
        <Loader text="Loading Request Info" />
      </PageTitle>
    );
  }

  /**
   * Renders the header of the page
   * @param  {Boolean} is_requester Whether the user is the requester or not
   * @param  {Boolean} is_professor Whether the user is the designed professor or not
   * @return {Object}               Header to be rendered
   */
  renderHeader(is_requester, is_professor) {
    if (is_requester) {
      return (
        <Header textAlign="center" as="h1">
          {'Request #' + this.state.id}
        </Header>
      );
    }
    return this.renderButtons(is_professor);
  }

  /**
   * Renders the buttons associated with the decision
   * @param  {Boolean} is_professor [description]
   * @return {[type]}               [description]
   */
  renderButtons(is_professor) {
    let prof_accept = this.state.request.professor_accept;
    let form = (
      <Input
        fluid
        placeholder="Professor's Cost Center"
        required
        value={this.state.cost_center}
        error={this.state.error}
        onChange={this.costCenterChange.bind(this)}
      />
    );

    let msg = (
      <Message
        center
        style={{ textAlign: 'center' }}
        header="Professor's Cost Center"
        content={this.state.request.professor_cost_center || 'Not yet inserted'}
      />
    );
    return (
      <Grid>
        <Grid.Row columns={5}>
          <Grid.Column />
          <Grid.Column>
            <Header textAlign="left" as="h1">
              {'Request #' + this.state.id}
            </Header>
          </Grid.Column>
          <Grid.Column>{is_professor ? form : msg}</Grid.Column>
          <Grid.Column>
            {is_professor || prof_accept ? (
              <div>
                <Button
                  floated="left"
                  positive
                  onClick={this.handleAccept.bind(this)}
                  content="Accept"
                />
                <Button
                  floated="right"
                  negative
                  onClick={this.handleReject.bind(this)}
                  content="Reject"
                />
              </div>
            ) : (
              undefined
            )}
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
      </Grid>
    );
  }

  /**
   * Renders the page when the fetching has ended
   * @param  {Boolean} is_requester Whether the user is the requester or not
   * @param  {Boolean} is_professor Whether the user is the designated professor or not
   * @param  {Boolean} is_manager   Whether the user is a manager or not
   * @return {Object}               Page to be rendered
   */
  renderReady(is_requester, is_professor, is_manager) {
    return (
      <PageTitle key="Request" title="Request">
        {this.renderHeader(is_requester, is_professor)}
        <Divider hidden />
        <RequestInfoGrid
          request={this.state.request}
          items={this.state.items}
          is_manager={is_manager}
        />
      </PageTitle>
    );
  }

  /**
   * Renders the page
   * @return {Object} Page to be rendered
   */
  render() {
    const { request, user_id, user_permissions } = this.state;
    const fetching = this.state.fetching;

    if (fetching < 3) {
      return this.renderFetching();
    } else {
      const is_requester =
          user_id == request.requester_id && user_permissions == 1,
        is_professor = user_id == request.professor_id && user_permissions == 2,
        is_manager = user_permissions == 3;

      if (is_requester || is_professor || is_manager) {
        return this.renderReady(is_requester, is_professor, is_manager);
      } else {
        return <Redirect to="/" />;
      }
    }
  }
}

export default withCookies(Request);

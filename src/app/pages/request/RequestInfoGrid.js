import React, { Component } from 'react';
import { service } from '@utils';
import { withAlert } from 'react-alert';
import { Grid, Message, Header, Divider } from 'semantic-ui-react';
import { HTMLEditor } from '@common/components';
import RequestsTable from '@pages/requests_cart/Table';

/**
 * Generic message renderer
 * @param  {String} header  Header of the message
 * @param  {String} content Content to be displayed
 * @param  {String} color   Color of the message
 * @return {Object}         Message to be rendered
 */
let renderMsg = function(header, content, color) {
  return (
    <Message
      style={{ textAlign: 'center' }}
      color={color}
      header={header}
      content={content}
    />
  );
};

class RequestInfoGrid extends Component {
  /**
   * Constructs the grid
   * @param {Object} props              The properties of the object
   * @param {Object} props.request      Details of the request
   * @param {Object} props.items        Items of the request
   * @param {Boolean} props.is_manager  Whether the user is a manager or not
   */
  constructor(props) {
    super(props);
    this.state = this.props.request;
    this.state.is_manager = this.props.is_manager;
    this.state['items'] = this.props.items;
    this.state.original = this.state.workflow;
    this.state.columns = [
      { name: 'description', title: 'Description' },
      { name: 'count', title: 'Requested' },
      { name: 'returned', title: 'Returned' },
      { name: 'total_stock', title: 'Total Stock' },
      { name: 'free_stock', title: 'Free Stock' },
      { name: 'last_price', title: 'Last Price' },
      { name: 'location', title: 'Location' },
      { name: 'reference', title: 'Reference' }
    ];
    this.state.tableColumnExtensions = [
      { columnName: 'count', align: 'center', width: 115 },
      { columnName: 'total_stock', align: 'center', width: 120 },
      { columnName: 'location', align: 'center' },
      { columnName: 'returned', align: 'center', width: 115 },
      { columnName: 'free_stock', align: 'center', width: 120 },
      { columnName: 'last_price', align: 'center', width: 120 },
      { columnName: 'reference', align: 'center', width: 140 },
      { columnName: 'user_comments', wordWrapEnabled: true },
      { columnName: 'last_edit', align: 'center' }
    ];
    this.state.editingColumnExtensions = [
      { columnName: 'returned', editingEnabled: true }
    ];
    this.state.columnsOrder = [
      'description',
      'image',
      'count',
      'returned',
      'free_stock',
      'total_stock',
      'last_price',
      'location',
      'user_comments',
      'details',
      'reference'
    ];
  }

  /**
   * Updates the request with the returned items
   * @param  {Number} req_id       Request ID
   * @param  {Number} item_id      Item ID
   * @param  {String} item_name    Name of the item returned
   * @param  {Number} new_returned New returned value
   */
  updateRequest(req_id, item_id, item_name, new_returned) {
    let body = { req_id, item_id, new_returned };
    service
      .post('/return_items', body)
      .then(response => {
        let items = this.state.items.map(item => {
          if (item.id === item_id) {
            item.returned = response.data.returned;
            this.props.alert.show(item_name + ' updated returned!');
          }
          return item;
        });
        this.setState({ items });
      })
      .catch(() => {
        this.props.alert.show(item_name + ' failed to update!', {
          type: 'error'
        });
      });
  }

  /**
   * Callback function on table edit
   * @param  {Object} changed Object with information about changed row and column values
   */
  onCommitChanges({ changed }) {
    let { items } = this.state;
    if (changed) {
      items.forEach(item => {
        if (changed[item.id]) {
          let new_returned = changed[item.id].returned;
          if (new_returned > item.returned && new_returned <= item.count) {
            this.updateRequest(
              this.state.id,
              item.id,
              item.description,
              new_returned
            );
          }
        }
      });
    }
  }

  /**
   * Callback on HTML workflow change
   * @param  {Object} e Object with event details
   */
  onHTMLChange(e) {
    this.setState({ workflow: e.target.value });
  }

  /**
   * Resets the workflow text back to its original state
   */
  resetWorkflow() {
    this.setState({ workflow: this.state.original });
  }

  /**
   * Saves the current workflow text to the database
   */
  saveWorkflow() {
    let body = {
      workflow: this.state.workflow,
      id: this.state.id
    };
    service
      .post('/request_workflow_update', body)
      .then(() => {
        this.props.alert.show('Workflow updated!');
        this.setState({ original: this.state.workflow });
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Renders the row of the names
   * @param  {String} requester Name of requester
   * @param  {String} professor Name of professor
   * @param  {String} manager   Name of manager
   * @return {Object}           Row to be rendered
   */
  renderNamesRow(requester, professor, manager) {
    return (
      <Grid.Row>
        <Grid.Column />
        <Grid.Column floated="left">
          {renderMsg('Requester', requester, undefined)}
        </Grid.Column>
        <Grid.Column>
          {renderMsg('Professor', professor, undefined)}
        </Grid.Column>
        <Grid.Column>
          {renderMsg('Manager', manager || 'All managers', undefined)}
        </Grid.Column>
        <Grid.Column />
      </Grid.Row>
    );
  }

  /**
   * Renders the row of dates
   * @param  {String} sent    Date the request was sent
   * @param  {String} prof_ev Date the professor evaluated the request
   * @param  {String} man_ev  Date the manager evaluated the request
   * @return {Object}         Row of dates to be rendered
   */
  renderDatesRow(sent, prof_ev, man_ev) {
    const sent_color = sent ? 'green' : 'red',
      prof_color = prof_ev ? 'green' : 'yellow',
      man_color = man_ev ? 'green' : 'yellow';

    return (
      <Grid.Row>
        <Grid.Column />
        <Grid.Column>
          {renderMsg('Date Sent', sent || 'N/D', sent_color)}
        </Grid.Column>
        <Grid.Column>
          {renderMsg(
            'Date Prof. Evaluated',
            prof_ev || 'Not yet evaluated',
            prof_color
          )}
        </Grid.Column>
        <Grid.Column>
          {renderMsg(
            'Date Manager Evaluated',
            man_ev || 'Not yet evaluated',
            man_color
          )}
        </Grid.Column>
        <Grid.Column />
      </Grid.Row>
    );
  }

  /**
   * Renders the student cancel message
   * @param  {Boolean} student  Whether student has cancelled
   * @return {Object}           Message to be rendered
   */
  renderStudentCancel(student) {
    let color, msg;
    if (student == undefined || student == null) {
      color = 'yellow';
      msg = 'Not Cancelled';
    } else {
      color = !student ? 'green' : 'red';
      msg = !student ? 'Not Cancelled' : 'Cancelled!';
    }
    return renderMsg('Student Cancelled', msg, color);
  }

  /**
   * Renders the professor cancel message
   * @param  {Boolean} professor  Whether professor has declined
   * @return {Object}             Message to be rendered
   */
  renderProfessorCancel(professor) {
    let color, msg;
    if (professor == undefined || professor == null) {
      color = 'yellow';
      msg = 'Not evaluated';
    } else {
      color = professor ? 'green' : 'red';
      msg = professor ? 'Accepted!' : 'Rejected!';
    }
    return renderMsg('Professor Accept', msg, color);
  }

  /**
   * Renders the manager cancel message
   * @param  {Boolean} manager  Whether manager has declined
   * @return {Object}             Message to be rendered
   */
  renderManagerCancel(manager) {
    let color, msg;
    if (manager == undefined || manager == null) {
      color = 'yellow';
      msg = 'Not evaluated';
    } else {
      color = manager ? 'green' : 'red';
      msg = manager ? 'Accepted!' : 'Rejected!';
    }
    return renderMsg('Manager Accept', msg, color);
  }

  /**
   * Renders the cancel messages row
   * @param  {Boolean} student   Whether student has cancelled
   * @param  {Boolean} professor Whether professor has accepted
   * @param  {Boolean} manager   Whether manager has accepted
   * @return {Object}           Row of messages to be rendered
   */
  renderCancelRow(student, professor, manager) {
    return (
      <Grid.Row>
        <Grid.Column />
        <Grid.Column>{this.renderStudentCancel(student)}</Grid.Column>
        <Grid.Column>{this.renderProfessorCancel(professor)}</Grid.Column>
        <Grid.Column>{this.renderManagerCancel(manager)}</Grid.Column>
        <Grid.Column />
      </Grid.Row>
    );
  }

  /**
   * Renders the purpose of the request
   * @return {Object} Purpose of request
   */
  renderPurpose() {
    return (
      <React.Fragment>
        <Header as="h2" content="Purpose" />
        <Divider fitted />
        <Message content={this.state.purpose} />
      </React.Fragment>
    );
  }

  /**
   * Renders the workflow of the request
   * @return {Object} Workflow of request
   */
  renderWorkflow() {
    return (
      <React.Fragment>
        <HTMLEditor
          displayOnly={!this.state.is_manager}
          header="Workflow"
          value={this.state.workflow}
          canvasType="code"
          onChange={this.onHTMLChange.bind(this)}
          onReset={this.resetWorkflow.bind(this)}
          onSave={this.saveWorkflow.bind(this)}
        />
      </React.Fragment>
    );
  }

  /**
   * Renders both text areas of the request
   * @return {Object} Text areas to be rendered
   */
  renderTextAreas() {
    return (
      <Grid columns="2">
        <Grid.Row>
          <Grid.Column>{this.renderWorkflow()}</Grid.Column>
          <Grid.Column>{this.renderPurpose()}</Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  /**
   * Renders an items table with the items of the request
   * @return {Object} Table to be rendered
   */
  renderItemsTable() {
    return (
      <React.Fragment>
        <Header textAlign="center" as="h2" content="Items Requested" />
        <RequestsTable
          withDelete={false}
          withEdit={this.state.is_manager && this.state.manager_accept}
          items={this.state.items}
          columns={this.state.columns}
          columnsOrder={this.state.columnsOrder}
          tableColumnExtensions={this.state.tableColumnExtensions}
          editingColumnExtensions={this.state.editingColumnExtensions}
          onCommitChanges={this.onCommitChanges.bind(this)}
        />
      </React.Fragment>
    );
  }

  /**
   * Renders the whole page
   * @return {Object} Page to be rendered
   */
  render() {
    const {
      requester,
      professor,
      manager,
      date_sent,
      date_professor_evaluated,
      date_manager_evaluated,
      cancelled,
      professor_accept,
      manager_accept
    } = this.state;

    return (
      <React.Fragment>
        <Grid columns="5">
          {this.renderNamesRow(requester, professor, manager)}
          {this.renderDatesRow(
            date_sent,
            date_professor_evaluated,
            date_manager_evaluated
          )}
          {this.renderCancelRow(cancelled, professor_accept, manager_accept)}
        </Grid>
        {this.renderTextAreas()}
        <Divider hidden />
        {this.renderItemsTable()}
      </React.Fragment>
    );
  }
}

export default withAlert(RequestInfoGrid);

import React, { Component } from 'react';
import { Grid, Button, Image, Form } from 'semantic-ui-react';
import NumericInput from 'react-numeric-input';
import { Authorization, PageTitle } from '@common/components';
import { service } from '@utils';

const ImageExampleLink = () => (
  <div style={{ paddingTop: '1em' }}>
    <Image src="https://picsum.photos/300" bordered />
    <div style={{ paddingLeft: '6.5em', paddingTop: '1em' }}>
      <Button>Upload Image</Button>
    </div>
  </div>
);

const FormExampleForm = () => (
  <Form>
    <Form.Field required>
      <label>Item Name</label>
      <input placeholder="Item's Name" />
    </Form.Field>

    <Form.Field required>
      <label>Manufacturer</label>
      <input placeholder="Manufacturer" />
    </Form.Field>

    <Form.Group required>
      <Form.Field required>
        <label>Quantity</label>
        <NumericInput min={1} value={1} />
      </Form.Field>
      <span style={{ paddingLeft: '1em', paddingTop: '0.5em' }}>
        <Form.Field
          label="meters"
          control="input"
          type="radio"
          name="radios"
          selected
        />
        <Form.Field
          label="kilograms"
          control="input"
          type="radio"
          name="radios"
        />
        <Form.Field label="units" control="input" type="radio" name="radios" />
      </span>

      <div style={{ marginLeft: '3em', width: '50%' }}>
        <Form.Field required>
          <label>Reference Number</label>
          <input placeholder="Reference Number" />
        </Form.Field>
      </div>
    </Form.Group>

    <Form.TextArea
      label="Details"
      placeholder="Specify the item's characteristics..."
    />
  </Form>
);

class AddItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      name: 'NAME',
      imageurl: 'IMAGE',
      count: 50,
      condition: 'COND',
      manufacturer: 'SUPP',
      details: 'cenas',
      reference: '12785612',
      category_id: 1
    };

    this.editItem = this.editItem.bind(this);
  }

  editItem() {
    service
      .post('/add_new_item', this.state)
      .then(response => {
        console.log(response);
      })
      .catch(e => {
        throw e;
      });
  }

  renderContent() {
    return (
      <Grid style={{ paddingTop: '2em' }}>
        <div style={{ paddingLeft: '2em' }}>{ImageExampleLink()}</div>
        <div style={{ width: '50%' }}>
          {FormExampleForm()}
          <div style={{ paddingTop: '2em', float: 'right' }}>
            <Button.Group>
              <Button positive onClick={this.editItem}>
                Save
              </Button>
              <Button.Or />
              <Button>Cancel</Button>
            </Button.Group>
          </div>
        </div>
      </Grid>
    );
  }

  render() {
    return (
      <Authorization param="can_edit">
        <PageTitle title="Add an Item">{this.renderContent()}</PageTitle>
      </Authorization>
    );
  }
}

export default AddItem;

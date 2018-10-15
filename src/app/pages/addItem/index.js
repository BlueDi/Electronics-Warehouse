import React, { Component } from 'react';
import { Grid, Button, Image, Form } from 'semantic-ui-react';
import NumericInput from 'react-numeric-input';
import { PageTitle } from '@common/components';

const ImageExampleLink = () => (
  <div style={{ paddingTop: '1em' }}>
    <Image src="https://picsum.photos/300" bordered />
    <div style={{ paddingLeft: '6.5em', paddingTop: '1em' }}>
      <Button>Upload Image</Button>
    </div>
  </div>
);

const ButtonExampleLabeledIcon = () => (
  <div style={{ paddingTop: '2em', float: 'right' }}>
    <Button.Group>
      <Button positive>Save</Button>
      <Button.Or />
      <Button>Cancel</Button>
    </Button.Group>
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
  render() {
    return (
      <PageTitle title="Add an Item">
        <Grid style={{ paddingTop: '2em' }}>
          <div style={{ paddingLeft: '2em' }}>{ImageExampleLink()}</div>
          <div style={{ width: '50%' }}>
            {FormExampleForm()}
            {ButtonExampleLabeledIcon()}
          </div>
        </Grid>
      </PageTitle>
    );
  }
}

export default AddItem;

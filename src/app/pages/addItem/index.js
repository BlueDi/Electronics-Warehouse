import React, { Component } from 'react';
import { Grid, Button, Image, Form } from 'semantic-ui-react';
import { PageTitle } from '@common/components';
import { service } from '@utils';

class AddItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      imageurl: '0',
      count: 1,
      condition: 'bad',
      details: '',
      manufacturer: '',
      reference: '',
      category_id: 1
    };

    this.addItem = this.addItem.bind(this);
  }

  Image = () => (
    <div style={{ paddingTop: '1em' }}>
      <Image src="https://picsum.photos/300" bordered />
      <div style={{ paddingLeft: '3em', paddingTop: '1em' }}>
        <input type="file" onChange={this.handleImageChange} />
      </div>
    </div>
  );

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  addItem() {
    console.log(this.state);

    service
      .post('/addNewItem', this.state)
      .then(response => {
        console.log(response);
      })
      .catch(e => {
        this.setState({
          isFetching: false
        });
        throw e;
      });
  }

  render() {
    const { name, manufacturer, reference, supplier, details } = this.state;
    const options = [
      { key: 'angular', text: 'Angular', value: 'angular' },
      { key: 'css', text: 'CSS', value: 'css' },
      { key: 'design', text: 'Graphic Design', value: 'design' },
      { key: 'ember', text: 'Ember', value: 'ember' },
      { key: 'html', text: 'HTML', value: 'html' },
      { key: 'ia', text: 'Information Architecture', value: 'ia' },
      { key: 'javascript', text: 'Javascript', value: 'javascript' },
      { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
      { key: 'meteor', text: 'Meteor', value: 'meteor' },
      { key: 'node', text: 'NodeJS', value: 'node' },
      { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
      { key: 'python', text: 'Python', value: 'python' },
      { key: 'rails', text: 'Rails', value: 'rails' },
      { key: 'react', text: 'React', value: 'react' },
      { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
      { key: 'ruby', text: 'Ruby', value: 'ruby' },
      { key: 'ui', text: 'UI Design', value: 'ui' },
      { key: 'ux', text: 'User Experience', value: 'ux' }
    ];

    return (
      <PageTitle title="Add an Item">
        <Grid style={{ paddingTop: '2em' }}>
          <div style={{ paddingLeft: '2em' }}>{this.Image()}</div>
          <div style={{ width: '70%' }}>
            <Form success onSubmit={this.addItem}>
              <Form.Input
                required
                placeholder="Item's Name"
                label="Item's Name"
                name="name"
                value={name}
                onChange={this.handleChange}
              />

              <Form.Group widths="equal">
                <Form.Input
                  required
                  placeholder="Manufacturer"
                  label="Manufacturer"
                  name="manufacturer"
                  value={manufacturer}
                  onChange={this.handleChange}
                />
                <Form.Input
                  required
                  placeholder="Manufacturer's Reference Number"
                  label="Manufacturer's Reference Number"
                  name="reference"
                  value={reference}
                  onChange={this.handleChange}
                />
                <Form.Input
                  placeholder="Supplier"
                  label="Supplier"
                  name="supplier"
                  value={supplier}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Input
                  required
                  label="Quantity"
                  type="number"
                  min={1}
                  name="count"
                  value={this.state.count}
                  onChange={this.handleChange}
                />

                <Form.Dropdown
                  width={4}
                  category="category"
                  placeholder="Search for a Category"
                  label="Category"
                  search
                  selection
                  options={options}
                />

                <Form.Dropdown
                  width={4}
                  properties="properties"
                  placeholder="Search for Properties"
                  label="Properties"
                  search
                  multiple
                  selection
                  options={options}
                />
              </Form.Group>

              <Form.Group>
                <Form.Input width={4} placeholder="Block" label="Block" />
                <Form.Input width={4} placeholder="Column" label="Column" />
                <Form.Input width={4} placeholder="Row" label="Row" />
              </Form.Group>

              <Form.TextArea
                label="Details"
                placeholder="Specify the item's characteristics..."
                name="details"
                value={details}
                onChange={this.handleChange}
              />

              <div style={{ paddingTop: '2em', float: 'right' }}>
                <Button.Group>
                  <Button type="submit" positive>
                    Save
                  </Button>
                  <Button.Or />
                  <Button>Cancel</Button>
                </Button.Group>
              </div>
            </Form>
          </div>
        </Grid>
      </PageTitle>
    );
  }
}

export default AddItem;

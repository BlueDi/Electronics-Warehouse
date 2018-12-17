import React, { Component } from 'react';
import {
  Grid,
  Button,
  Form,
  Icon,
  Modal,
  Image,
  Label
} from 'semantic-ui-react';
import { PageTitle } from '@common/components';
import { service } from '@utils';
import { Link } from 'react-router-dom';
import placeholder from '@assets/images/placeholder.jpg';

class AddItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: '',
      display_image: placeholder,
      image: placeholder,
      location: '',
      stock: 1,
      price: 0.0,
      details: '',
      manufacturer: '',
      reference: '',
      packaging: '',

      categories: [],
      selectedCategory: '',
      newCategories: [],
      categoryID: '',

      properties: [],
      selectedProperty: '',
      selectedProperties: [],
      newProperties: [],
      propertyID: 0,
      disableProperties: true,

      selectedPropertyValue: '',
      selectedPropertyUnit: '',
      units: [],

      open: false
    };

    this.addItem = this.addItem.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.getCategoryProperties = this.getCategoryProperties.bind(this);
    this.getAllUnits = this.getAllUnits.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.getNewItemId = this.getNewItemId.bind(this);
    this.renderLabels = this.renderLabels.bind(this);
    this.deleteProperty = this.deleteProperty.bind(this);
    this.renderValueEditing = this.renderValueEditing.bind(this);
    this.setProperty = this.setProperty.bind(this);
    this.handlePropertyValueChange = this.handlePropertyValueChange.bind(this);
    this.handlePropertyUnitAddition = this.handlePropertyUnitAddition.bind(
      this
    );
    this.handlePropertyUnitChange = this.handlePropertyUnitChange.bind(this);
  }

  componentDidMount() {
    this.getAllCategories();
    this.getAllUnits();
  }

  getAllCategories() {
    const apiUrl = `/all_categories`;
    service
      .get(apiUrl)
      .then(response => {
        console.log(response);
        let category_list = response.data.map(category => {
          return {
            key: category.id,
            value: category.name,
            text: category.name
          };
        });

        this.setState({
          categories: category_list
        });
      })
      .catch(e => {
        throw e;
      });
  }

  handleNewImageFile = event => {
    let uploadedFile = event.target.files[0];

    let reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function(file) {
      let fileContent = file.target.result.split(',')[1];

      this.setState({
        display_image: `data:image/png;base64,${fileContent}`,
        image: fileContent
      });
    }.bind(this);

    // Read in the image file as a data URL.
    reader.readAsDataURL(uploadedFile);
  };

  getCategoryProperties(cat) {
    service
      .post('/get_categories_properties', { key: cat })
      .then(response => {
        let newProperties = response.data.map(property => {
          return {
            key: property.id,
            value: property.name,
            text: property.name,
            val: '',
            isNumber: property.number,
            unit: property.unit
          };
        });

        this.setState({
          properties: newProperties
        });
      })
      .catch(e => {
        throw e;
      });
  }

  getAllUnits() {
    service
      .get('/get_all_units')
      .then(response => {
        let newUnits = response.data.map(property => {
          return {
            key: property.id,
            value: property.unit,
            text: property.unit
          };
        });
        for (var i = 0; i < newUnits.length; i++) {
          if (newUnits[i].value == null) newUnits.splice(i, 1);
        }
        this.setState({
          units: newUnits
        });
      })
      .catch(e => {
        throw e;
      });
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleCategoryChange(e, { value }) {
    var catID;

    for (var i = 0; i < this.state.categories.length; i++) {
      if (this.state.categories[i].text == value)
        catID = this.state.categories[i].key;
    }

    this.setState({
      selectedCategory: value,
      categoryID: catID,
      disableProperties: false
    });

    console.log(catID);

    this.getCategoryProperties(catID);
  }

  handlePropertyChange(e, { value }) {
    var newProperties = this.state.selectedProperties;

    for (var j = 0; j < this.state.selectedProperties.length; j++) {
      if (value == this.state.selectedProperties[j].name) {
        this.setState({
          selectedPropertyValue: this.state.selectedProperties[j].value,
          selectedPropertyUnit: this.state.selectedProperties[j].unit
        });
        return;
      }
    }

    for (var i = 0; i < this.state.properties.length; i++) {
      if (
        this.state.properties[i].text == value &&
        this.state.properties[i].unit != ''
      ) {
        newProperties.push({
          key: this.state.properties[i].key,
          name: value,
          value: '',
          isNumber: this.state.properties[i].isNumber,
          unit: this.state.properties[i].unit
        });

        var newPropertyID = this.state.propertyID;
        ++newPropertyID;

        this.setState({
          propertyID: newPropertyID,
          selectedProperties: newProperties,
          selectedProperty: value,
          selectedPropertyValue: '',
          selectedPropertyUnit: this.state.properties[i].unit
        });

        break;
      }
    }
  }

  getNewItemId() {
    service
      .post('/get_last_item_id')
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  }

  addItem() {
    console.log(this.state);

    var categoryProperties = this.state.selectedProperties;
    categoryProperties.push(this.state.categoryID);

    var itemProperties = this.state.selectedProperties;

    console.log(itemProperties);

    service
      .post('/add_new_item', this.state)
      .then(response => {
        itemProperties.push(response.data[0].id);

        if (this.state.selectedProperties != []) {
          service
            .post('/add_category_property', categoryProperties)
            .then(response => {
              console.log(response);
            })
            .catch(e => {
              throw e;
            });

          console.log(itemProperties);

          service
            .post('/add_item_property', itemProperties)
            .then(response => {
              console.log(response);
            })
            .catch(e => {
              throw e;
            });
        }
      })
      .catch(e => {
        throw e;
      });
  }

  handlePropertyUnitAddition(e, { value }) {
    var newUnits = this.state.units;
    var newUnitID = this.state.units[this.state.units.length - 1].key + 1;

    newUnits.push({ key: newUnitID, value: value, text: value });

    this.setState({
      units: newUnits
    });
  }

  handlePropertyUnitChange(e, { value }) {
    var newPropertyValues = this.state.selectedProperties;

    for (var i = 0; i < newPropertyValues.length; i++) {
      if (newPropertyValues[i].name == this.state.selectedProperty) {
        newPropertyValues[i].unit = value;
      }
    }

    this.setState({
      selectedProperties: newPropertyValues,
      selectedPropertyUnit: value
    });
  }

  handlePropertyValueChange(e, { value }) {
    var newPropertyValues = this.state.selectedProperties;

    for (var i = 0; i < newPropertyValues.length; i++) {
      if (newPropertyValues[i].name == this.state.selectedProperty) {
        newPropertyValues[i].value = value;
      }
    }

    this.setState({
      selectedProperties: newPropertyValues,
      selectedPropertyValue: value
    });
  }

  /*handleCategoryAddition = (e, { value }) => {

    var categoriesToAdd = this.state.newCategories;

    if (this.state.categories.length > 0) {
      var lastObject = this.state.categories[this.state.categories.length - 1];
      var lastKey = lastObject[Object.keys(lastObject)[0]];
    } else {
      lastKey = -1;
    }

    var newCategory = [{ key: lastKey + 1, value, text: value }];
    var newCategories = this.state.categories.concat(newCategory);
    categoriesToAdd.push(newCategory);

    this.setState({
      categories: newCategories,
      newCategories: categoriesToAdd
    });
  };*/

  /*handlePropertyAddition = (e, { value }) => {

    var propertiesToAdd = this.state.newProperties;

    if (this.state.properties.length > 0) {
      var lastObject = this.state.properties[this.state.properties.length - 1];
      var lastKey = lastObject[Object.keys(lastObject)[0]];
    } else {
      lastKey = -1;
    }

    var newProperty = [{ key: lastKey + 1, value, text: value, val: '', isNumber: '', unit: '' }];
    var newProperties = this.state.properties.concat(newProperty);
    propertiesToAdd.push(newProperty);

    this.setState({
      properties: newProperties,
      newProperties: propertiesToAdd
    });

    
  };*/

  renderImageInput() {
    return [
      <Image key="image" fluid rounded src={this.state.display_image} />,
      <Button
        key="image_button"
        as="label"
        htmlFor="upload"
        icon="upload"
        label={{
          content: 'Upload Image'
        }}
        labelPosition="left"
        name="image"
        style={{
          marginTop: '2em',
          marginLeft: '2em'
        }}
      />,
      <input
        key="image_input"
        hidden
        id="upload"
        type="file"
        name="image"
        onChange={this.handleNewImageFile}
      />
    ];
  }

  setProperty(e) {
    var id = e.target.getAttribute('id');
    var newProperty;

    for (var i = 0; i < this.state.selectedProperties.length; i++) {
      if (i == id) {
        newProperty = this.state.selectedProperties[i].name;
        this.setState({
          selectedProperty: newProperty,
          selectedPropertyValue: this.state.selectedProperties[i].value,
          selectedPropertyUnit: this.state.selectedProperties[i].unit
        });
        document.getElementById(i).style.backgroundColor = 'grey';
      } else {
        document.getElementById(i).style.backgroundColor = '';
      }
    }
  }

  deleteProperty(e) {
    var nonDeletedProperties = this.state.selectedProperties;

    nonDeletedProperties.splice(e.target.getAttribute('id'), 1);

    var newPropertyID = this.state.propertyID;
    --newPropertyID;

    this.setState({
      selectedProperties: nonDeletedProperties,
      propertyID: newPropertyID
    });
  }

  renderLabels() {
    let tempLabels = [];

    for (let i = 0; i < this.state.selectedProperties.length; i++) {
      tempLabels.push(
        <Label
          id={i}
          onClick={e => {
            this.setProperty(e);
          }}
          style={{ cursor: 'pointer', marginTop: '2em' }}
        >
          {this.state.selectedProperties[i].name}
          <Icon
            name="delete"
            id={i}
            onClick={e => {
              this.deleteProperty(e);
            }}
          />
        </Label>
      );
    }

    return tempLabels;
  }

  renderValueEditing() {
    if (this.state.selectedProperty != '') {
      return (
        <div>
          <Form>
            <Form.Input
              placeholder="Value"
              name="value"
              value={this.state.selectedPropertyValue}
              onChange={this.handlePropertyValueChange}
              style={{ width: '55%', paddingTop: '1em' }}
            />

            <Form.Dropdown
              required
              options={this.state.units}
              placeholder="Add or Select a unit"
              search
              selection
              allowAdditions
              name="units"
              value={this.state.selectedPropertyUnit}
              onAddItem={this.handlePropertyUnitAddition}
              onChange={this.handlePropertyUnitChange}
              style={{ width: '55%' }}
            />
          </Form>

          {this.renderLabels()}
        </div>
      );
    }
  }

  close = () => this.setState({ open: false });

  closeWithoutSaving = () =>
    this.setState({
      open: false,
      selectedProperties: [],
      selectedPropertyValue: '',
      selectedPropertyUnit: '',
      selectedProperty: ''
    });

  openModal = () => this.setState({ open: true });

  render() {
    const {
      description,
      stock,
      price,
      details,
      manufacturer,
      reference,
      selectedCategory,
      location,
      selectedProperty,
      packaging
    } = this.state;

    return (
      <PageTitle title="Add an Item">
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={3}>{this.renderImageInput()}</Grid.Column>
            <Grid.Column width={10}>
              <Form>
                <Form.Input
                  required
                  placeholder="Item's Name"
                  label="Item's Name"
                  name="description"
                  value={description}
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
                    required
                    placeholder="Packaging"
                    label="Packaging"
                    name="packaging"
                    value={packaging}
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.Input
                  required
                  placeholder="Location"
                  label="Location"
                  name="location"
                  value={location}
                  onChange={this.handleChange}
                />

                <Form.Group widths="equal">
                  <Form.Input
                    required
                    label="Stock"
                    type="number"
                    min={1}
                    name="stock"
                    value={stock}
                    onChange={this.handleChange}
                  />

                  <Form.Input
                    required
                    label="Last Price per Unit"
                    type="number"
                    min={0.01}
                    name="price"
                    value={price}
                    step=".01"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Dropdown
                    width="4"
                    required
                    options={this.state.categories}
                    placeholder="Category"
                    label="Category"
                    search
                    selection
                    //allowAdditions
                    name="selectedCategory"
                    value={selectedCategory}
                    //onAddItem={this.handleCategoryAddition}
                    onChange={this.handleCategoryChange}
                  />

                  <Modal
                    size={'mini'}
                    trigger={
                      <Form.Button
                        icon
                        labelPosition="left"
                        onClick={this.openModal}
                        style={{
                          marginTop: '1.7em',
                          marginLeft: '1em'
                        }}
                        disabled={this.state.disableProperties}
                      >
                        <Icon name="plus" />
                        Add a Property
                      </Form.Button>
                    }
                    open={this.state.open}
                    closeOnEscape={false}
                    closeOnDimmerClick={false}
                    onClose={this.close}
                  >
                    <Modal.Header>Select a Property</Modal.Header>
                    <Modal.Description
                      style={{
                        textAlign: 'center',
                        marginTop: '3em',
                        marginBottom: '3em'
                      }}
                    >
                      <p
                        style={{
                          marginBottom: '5px',
                          marginRight: '37%'
                        }}
                      >
                        Property
                      </p>
                      <Form.Dropdown
                        required
                        options={this.state.properties}
                        placeholder="Add or Select a property"
                        search
                        selection
                        //allowAdditions
                        name="selectedProperty"
                        value={selectedProperty}
                        //onAddItem={this.handlePropertyAddition}
                        onChange={this.handlePropertyChange}
                      />

                      {this.renderValueEditing()}
                    </Modal.Description>

                    <div
                      style={{
                        paddingBottom: '1em',
                        paddingRight: '1em',
                        float: 'right'
                      }}
                    >
                      <Button.Group>
                        <Button type="submit" positive onClick={this.close}>
                          Save
                        </Button>
                        <Button.Or />
                        <Button onClick={this.closeWithoutSaving}>
                          Cancel
                        </Button>
                      </Button.Group>
                    </div>
                  </Modal>
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
                    <Button type="submit" positive onClick={this.addItem}>
                      Save
                    </Button>
                    <Button.Or />
                    <Link to={'../table/1'}>
                      <Button>Cancel</Button>
                    </Link>
                  </Button.Group>
                </div>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </PageTitle>
    );
  }
}

export default AddItem;

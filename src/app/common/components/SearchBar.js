import React, { Component } from 'react';
import { service } from '@utils';
import { ComboSearch } from 'react-combo-search';

const urlForData = id => `/table/${id}`;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      selectData: ['Name', 'Manufacturer', 'Reference Number', 'Category']
    };
    this.searchCallback = this.searchCallback.bind(this);
  }

  searchCallback(data) {
    var sendToDB;

    if (data.length != 0)
      sendToDB = service.post(urlForData(this.state.id), data);
    else sendToDB = service.get(urlForData(this.state.id));

    sendToDB
      .then(response => {
        this.updateToNewComponents(response.data);
      })
      .catch(e => {
        throw e;
      });
  }

  updateToNewComponents(data) {
    this.props.updateComponents(data);
  }

  render() {
    return (
      <ComboSearch
        onSearch={this.searchCallback}
        selectData={this.state.selectData}
        datePickerCriteria="Date of birth"
      />
    );
  }
}

export default SearchBar;

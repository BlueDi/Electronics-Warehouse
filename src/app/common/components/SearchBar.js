import React, { Component } from 'react';
import _ from 'lodash';
import { Search } from 'semantic-ui-react';

const source = _.times(5, () => ({
  title: 'Facebook',
  description: 'Stealling your info since 1995'
}));

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: '' });

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch)
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Search
        input={{ fluid: true }}
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, {
          leading: true
        })}
        results={results}
        value={value}
        {...this.props}
      />
    );
  }
}

export default SearchBar;

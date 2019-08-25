import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CardSearch from './card-search.js';
import { handleInputChange } from '../lib/form-utils.js';
import { Query } from 'react-apollo';
import allCardsQuery from '../lib/queries/all-cards-query';

class CardSearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = handleInputChange.bind(this);
  }

  handleSubmit(e) {
    e && e.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <>
        <input
          type="text"
          value={this.state.text}
          name="text"
          placeholder="Name or Rules Text"
          maxLength="100"
          data-cy="cardSearchText"
          onChange={this.handleInputChange}
        />
        <br />
        <br />
        <input
          data-cy="cardSearchSubmit"
          type="submit"
          value="Search"
          onClick={this.handleSubmit}
        />
      </>
    );
  }
}

CardSearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default CardSearchForm;
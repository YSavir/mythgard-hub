import PropTypes from 'prop-types';
import { executeCardQuery } from '../lib/card-queries.js';
import CardList from './card-list';
import ErrorMessage from './error-message';

function filteredCards({ filters, onCardClick }) {
  const { factions, text } = filters;

  const { loading, error, data } = executeCardQuery(factions, text);

  if (error) return <ErrorMessage message={error} />;
  if (loading) return null;

  const cards = data && data.cards && data.cards.nodes;

  return <CardList onCardClick={onCardClick} cards={cards} />;
}

filteredCards.propTypes = {
  onCardClick: PropTypes.func,
  filters: PropTypes.shape({
    factions: PropTypes.array,
    text: PropTypes.string
  }).isRequired
};

export default filteredCards;

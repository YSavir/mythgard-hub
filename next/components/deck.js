import { useQuery } from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import ErrorMessage from './error-message';
import DeckExport from './deck-export';
import DeckEdit from './deck-edit';
import DeckDelete from './deck-delete';
import { initializeDeckBuilder } from '../lib/deck-utils';
import { deckCardsQuery } from '../lib/deck-queries';
import DeckCardsTable from './deck-card-table';
import EssenceIndicator from './essence-indicator.js';
import FactionsIndicator from './factions-indicator.js';

const getDeckToExport = (deckCards, deckName, path = null, power = null) => {
  const deckToExport = initializeDeckBuilder();
  deckToExport.deckName = deckName;
  deckToExport.deckPath = path ? { name: path.name } : {};
  deckToExport.deckPower = power ? { name: power.name } : {};
  deckToExport.mainDeck = {
    ...deckCards
  };

  return deckToExport;
};

export default function Deck({ deck }) {
  const { loading, error, data } = useQuery(deckCardsQuery, {
    variables: { id: deck.id }
  });

  if (error) return <ErrorMessage message="Error loading decks." />;
  if (loading) return <div>Loading...</div>;

  const cards = data.deck ? data.deck.cardDecks.nodes : [];
  const { power, path, author, deckPreviews } = deck;
  const deckToExport = getDeckToExport(cards, deck.name, path, power);
  const authorName = (author && author.username) || 'unknown';
  const metaData =
    deckPreviews &&
    deckPreviews.nodes &&
    deckPreviews.nodes[0] &&
    deckPreviews.nodes[0];
  const essenceCost = metaData && metaData.essenceCost;
  const factions = metaData && metaData.factions;
  const dateCreated =
    metaData &&
    metaData.deckCreated &&
    new Date(metaData.deckCreated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  return (
    <div className="deck-page-container">
      <style jsx>{`
        .deck-page-container {
          display: flex;
        }

        .deck-details {
          width: 70%;
          padding-right: 20px;
          padding-bottom: 50px;
        }

        .deck-actions {
          width: 30%;
        }

        .deck-name {
          font-weight: bold;
          font-size: 24px;
          margin-bottom: 5px;
          display: flex;
          justify-content: space-between;
        }

        .deck-author {
          margin-bottom: 20px;
        }

        .deck-stats {
          width: 100%;
          margin-left: 20px;
          padding-bottom: 20px;
        }

        .coming-soon {
          margin-top: 10px;
          font-style: italic;
        }

        .stats-title {
          text-transform: uppercase;
          font-style: italic;
          font-weight: bold;
          font-size: 1em;
          margin-top: 25px;
          margin-bottom: 3px;
        }

        .date-created {
          text-transform: uppercase;
        }

        @media only screen and (max-width: 600px) {
          .deck-page-container {
            flex-direction: column;
          }

          .deck-details,
          .deck-actions {
            width: 100%;
          }
        }
      `}</style>
      <div className="deck-details">
        <div className="deck-name" data-cy="deckName">
          {deck.name}
        </div>
        <div className="deck-author">by {authorName}</div>
        <DeckCardsTable deck={deckToExport} onlyTable />
      </div>
      <div className="deck-actions">
        <DeckExport deckInProgress={deckToExport} />
        <DeckEdit deck={deck} />
        <DeckDelete deck={deck} />
        <div className="deck-stats">
          <div className="stats-title">Essence</div>
          <hr className="gradient-hr" />
          <EssenceIndicator essence={essenceCost} />
          <div className="stats-title factions-title">Factions</div>
          <hr className="gradient-hr" />
          <FactionsIndicator factions={factions} />
          <div className="stats-title factions-title">Deck Created</div>
          <hr className="gradient-hr" />
          <div className="date-created" data-cy="deckCreatedDate">
            {dateCreated}
          </div>
        </div>
      </div>
    </div>
  );
}

Deck.propTypes = {
  deck: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    cardDecks: PropTypes.array,
    power: PropTypes.shape({ name: PropTypes.string.isRequired }),
    path: PropTypes.shape({ name: PropTypes.string.isRequired }),
    author: PropTypes.shape({ username: PropTypes.string.isRequired })
  }).isRequired
};

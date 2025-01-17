import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImportDeck from '../components/import-deck';
import DeckExport from '../components/deck-export';
import DeckCardTable from '../components/deck-card-table';
import EditDeckName from '../components/edit-deck-name';
import SaveDeck from '../components/save-deck';
import {
  initializeDeckBuilder,
  resetDeckBuilderSavedState,
  getCardCount
} from '../lib/deck-utils';

export default function DeckBuilderSidebar(props) {
  const { deckId, deckInProgress, setDeckInProgress } = props;
  const [mainDeckInput, setMainDeckInput] = useState('');

  const updateDeckName = e => {
    setDeckInProgress({
      ...deckInProgress,
      deckName: e.target.value
    });
  };

  const deleteCardFromTable = id => {
    const newMainDeck = { ...deckInProgress.mainDeck };
    delete newMainDeck[id];

    setDeckInProgress({
      ...deckInProgress,
      mainDeck: newMainDeck
    });
  };

  const updateImportedDeck = importedDeck => setDeckInProgress(importedDeck);
  const cardCount = getCardCount(deckInProgress);
  const clearDeck = onClear => {
    const confirmation = confirm(
      'Are you sure you want to clear the deck? This action cannot be undone.'
    );

    if (confirmation) {
      setDeckInProgress(initializeDeckBuilder());
      resetDeckBuilderSavedState();
      onClear();
    }
  };

  return (
    <div className="deck-builder-actions">
      <style jsx>{`
        .deck-builder-actions {
          width: 35%;
        }
        .deck-builder-actions button {
          margin-bottom: 10px;
        }
        .card-count {
          text-align: end;
          text-transform: uppercase;
        }
        .card-count span {
          font-size: 20px;
          font-weight: bold;
        }
        .build-deck-title {
          text-transform: uppercase;
          text-align: center;
        }

        @media only screen and (max-width: 600px) {
          .deck-builder-actions {
            width: 100%;
          }
        }
      `}</style>
      <h2 className="build-deck-title">Import Deck from Mythgard</h2>
      <ImportDeck
        mainDeckInput={mainDeckInput}
        handleInputChange={e => {
          setMainDeckInput(e.target.value);
        }}
        updateImportedDeck={updateImportedDeck}
      />
      <DeckExport deckInProgress={deckInProgress} />
      <SaveDeck
        deckId={deckId}
        deckInProgress={deckInProgress}
        setDeckInProgress={setDeckInProgress}
      />
      <button onClick={() => clearDeck(props.onClear)}>Clear Deck</button>
      <div className="deck-in-progress" data-cy="deckInProgress">
        <h2 className="build-deck-title">- OR - BUILD YOUR DECK</h2>
        <EditDeckName
          deckName={deckInProgress.deckName}
          onChange={updateDeckName}
        />
        <div className="card-count">
          Cards: <span>{cardCount}</span>
        </div>
        <DeckCardTable deck={deckInProgress} deleteCard={deleteCardFromTable} />
      </div>
    </div>
  );
}

DeckBuilderSidebar.propTypes = {
  deckId: PropTypes.number,
  deckInProgress: PropTypes.shape({
    deckName: PropTypes.string,
    deckPath: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    deckPower: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    deckCoverArt: PropTypes.string,
    mainDeck: PropTypes.shape({
      quantity: PropTypes.number,
      card: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      })
    }),
    errors: PropTypes.arrayOf(PropTypes.string)
  }),
  onClear: PropTypes.func,
  setDeckInProgress: PropTypes.func
};

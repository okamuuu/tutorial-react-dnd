import React, { Component } from 'react';
import { store, view } from 'react-easy-state';
import _ from 'lodash';

import Board from './components/Board';
import Box from './components/Box';
import Piece from './components/Piece';

const state = store({ position: 0 });

function move(position) {
  if (canMove(position)) {
    state.position = position;
  }
}

function canMove(position) {
  return position > state.position && position - state.position <= 2;
}

class Game extends Component {

  render() {
    const boxes = _.times(9, n => {
      const piece = state.position === n ? <Piece /> : null;
      return (<Box onClick={() => move(n)} key={n} position={n}>{piece}</Box>)
    });

    return (
      <Board>
        {boxes}
      </Board>
    );
  }
}

export default view(Game);

import React, { Component } from 'react';
import { store, view } from 'react-easy-state';
import _ from 'lodash';

import Board from './components/Board';
import Box from './components/Box';
import Piece from './components/Piece';

import { DragDropContext, DragSource } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const state = store({ position: 0 });

function move(position) {
  if (canMove(position)) {
    state.position = position;
  }
}

function canMove(position) {
  return position > state.position && position - state.position <= 2;
}

const Types = {
  PIECE: 'piece'
};

// Board
const DndBoard = DragDropContext(HTML5Backend)(Board);

// Board

// Piece
const dragSource = {
  beginDrag(props) {
    return {}
  },
  endDrag(props) {
    return {}
  }
};

const ConnectedSource = props => {
  const {connectDragSource} = props;
  // https://github.com/react-dnd/react-dnd/issues/1021
  return (<Piece {...props} innerRef={instance=>connectDragSource(instance)}></Piece>)
}

const DndPiece = DragSource(Types.PIECE, dragSource, connect => ({
  connectDragSource: connect.dragSource(),
}))(ConnectedSource);


class Game extends Component {

  render() {
    const boxes = _.times(9, n => {
      const piece = state.position === n ? <DndPiece /> : null;
      return (<Box onClick={() => move(n)} key={n} position={n}>{piece}</Box>)
    });

    return (
      <DndBoard>
        {boxes}
      </DndBoard>
    );
  }
}

export default view(Game);

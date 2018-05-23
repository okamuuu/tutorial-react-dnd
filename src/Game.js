import React, { Component } from 'react';
import { store, view } from 'react-easy-state';
import _ from 'lodash';

import Board from './components/Board';
import Box from './components/Box';
import Piece from './components/Piece';

import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
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

// Box
const dropTarget = {
  drop(props, monitor) {
    const { position } = props;
    state.position = position;
    return {};
  },
  canDrop(props, monitor) {
    return canMove(props.position);
  }
};

const ConnectedTarget = props => {
  const {canDrop, children, connectDropTarget} = props;
  const renderOverlay = (color) => {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color,
      }} />
    );
  }
  return (
    <Box {...props} innerRef={instance=>connectDropTarget(instance)}>
      {children}
      { !children && canDrop &&
        <div style={{position: 'relative', width: '100%', height: '100%'}}>
          {renderOverlay('yellow')}
        </div>
      }
    </Box>
  )
}

const DndBox = DropTarget(Types.PIECE, dropTarget, (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
}})(ConnectedTarget);

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
      return (<DndBox onClick={() => move(n)} key={n} position={n}>{piece}</DndBox>)
    });

    return (
      <DndBoard>
        {boxes}
      </DndBoard>
    );
  }
}

export default view(Game);

import React, { useImperativeHandle, useRef } from "react";
import {
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DragSourceMonitor
} from "react-dnd";
import {
  DragSource,
  DropTarget,
  DropTargetConnector,
  DragSourceConnector
} from "react-dnd";
import ItemTypes from "./ItemTypes";
import { XYCoord } from "dnd-core";

const outerStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
};

const style = {
  border: "1px dashed gray",
  padding: "3px 10px",
  marginBottom: 4,
  marginTop: 4,
  color: "white",
  cursor: "move",
  flex: 1,
  textAlign: "left",
  marginRight: 10
};

const expanderStyle = {
  width: 20,
  cursor: "pointer",
  color: "white"
};

const Card = React.forwardRef(
  (
    {
      id,
      index,
      updateCard,
      moveSideways,
      visible,
      indent,
      expanded,
      childrenIds,
      text,
      isDragging,
      connectDragSource,
      connectDropTarget
    },
    ref
  ) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);

    const opacity = isDragging ? 0 : 1;
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current
    }));

    if (!visible) return null;

    return (
      <div
        ref={elementRef}
        style={{ ...outerStyle, opacity, marginLeft: indent * 30 }}
      >
        <div
          style={expanderStyle}
          onClick={() => updateCard(id, { expanded: !expanded })}
        >
          {childrenIds.length === 0 ? " " : expanded ? "-" : "+"}
        </div>
        <div style={style}>{text}</div>
        <div
          style={{ width: 30, cursor: "pointer" }}
          onClick={() => moveSideways(index, "left")}
        >
          {"<"}
        </div>

        <div
          style={{ width: 30, cursor: "pointer" }}
          onClick={() => moveSideways(index, "right")}
        >
          {">"}
        </div>
      </div>
    );
  }
);

export default DropTarget(
  ItemTypes.CARD,
  {
    hover(targetProps, monitor, targetComponent) {
      if (!targetComponent) {
        return null;
      }
      // node = HTML Div element from imperative API
      const node = targetComponent.getNode();
      if (!node) {
        return null;
      }

      const dragIndex = monitor.getItem().index;
      const hoverIndex = targetProps.index;

      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      targetProps.moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    }
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)(
  DragSource(
    ItemTypes.CARD,
    {
      beginDrag: props => ({
        id: props.id,
        index: props.index,
        text: props.text,
        type: ItemTypes.CARD,
      })
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  )(Card)
);

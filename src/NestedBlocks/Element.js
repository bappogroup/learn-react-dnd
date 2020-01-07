import React from "react";
import { useState, useRef, useEffect } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import MyContext from "./context";
import Button from "./Button";

const Element_ = ({
  element,
  elPath = [],
  isSelected = false,
  insertBeforeAfter,
  hoverItem,
  dropItem,
  verticalPos
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: "ELEMENT", element },
    begin: monitor => {},
    collect: monitor => {
      return {
        isDragging: !!monitor.isDragging()
      };
    }
  });

  const [, drop] = useDrop({
    accept: "treenode",
    drop: (item, monitor) => dropItem(item, monitor, elPath, element),
    hover: (item, monitor) => {
      hoverItem(item, monitor, elPath, element, ref);
    }
  });

  drop(drag(ref));

  const renderChildren = (element, hoverId, lastUpdated, verticalPos) => {
    if (!element.childrenIds) return null;
    return element.childrenIds
      .map(key => ({ ...element.children[key], id: key }))
      .map(el => {
        const _path = [...elPath, el.id];
        return (
          <Element
            element={el}
            elPath={_path}
            key={el.id}
            isSelected={el.id === hoverId}
            insertBeforeAfter={insertBeforeAfter}
            hoverItem={hoverItem}
            verticalPos={verticalPos}
            dropItem={dropItem}
            lastUpdated={lastUpdated}
          />
        );
      });
  };

  const borderWidth = isSelected ? 1 : 1;
  const padding = 10 + borderWidth;

  window.renderCount[element.id] = window.renderCount[element.id] || 0;
  window.renderCount[element.id]++;
  window.renderCount.all++;

  const renderPlaceholder = pos => {
    if (!isSelected) return null;
    if (verticalPos !== pos) return null;

    // Option 2 --- Render actual Button
    // if (window.draggingNow === "Button") {
    //   return (
    //     <div
    //       style={{
    //         paddingTop: 5,
    //         paddingBottom: 5
    //       }}
    //     >
    //       <Button />
    //     </div>
    //   );
    // }

    // Option 3 --- Render proper placeholder - like Trello
    if (window.draggingNow === "Button") {
      return (
        <div
          style={{
            width: 200,
            height: 35,
            background: "#ddd",
            marginTop: 5,
            marginBottom: 5
          }}
        ></div>
      );
    }

    return (
      <div
        style={{
          background: "blue",
          height: 5,
          display: "box",
          color: "white",
          marginBottom: 1,
          marginTop: 1,
          position: "absolute",
          top: pos === "top" ? 0 : null,
          bottom: pos === "bottom" ? 0 : null,
          width: "100%",
          left: 0
        }}
      />
    );
  };

  if (element.name === "Button")
    return (
      <div ref={ref} style={{ padding: 5, position: "relative" }}>
        {renderPlaceholder("top")}
        <Button />
        {renderPlaceholder("bottom")}
      </div>
    );

  return (
    <div ref={ref} style={{ padding: 5, position: "relative" }}>
      {renderPlaceholder("top")}
      <div
        style={{
          borderStyle: "solid",
          borderWidth: element.name === "Text" ? 0 : 1,
          borderColor: "blue",
          padding
        }}
      >
        <div>
          {element.name}
          <span style={{ fontSize: 8, marginLeft: 20 }}>
            Path={elPath.join(">")}
          </span>
        </div>
        <div
          style={{
            background: "blue",
            height: isSelected && verticalPos === "center" ? 5 : 0,
            display: "box",
            color: "white"
          }}
        />

        <MyContext.Consumer>
          {value =>
            renderChildren(
              element,
              value.hoverId,
              value.lastUpdated,
              value.verticalPos
            )
          }
        </MyContext.Consumer>
      </div>
      {renderPlaceholder("bottom")}
    </div>
  );
};

// export default Element;

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.element.id === nextProps.element.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.lastUpdated === nextProps.lastUpdated &&
    prevProps.verticalPos === nextProps.verticalPos
  );
};

const Element = React.memo(Element_, areEqual);
// const Element = Element_;

export default Element;

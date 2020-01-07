import React from "react";
import { useState, useRef, useEffect } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import Element from "./Element";
import MyContext from "./context";
import Button from "./Button";

const data = {
  childrenIds: ["body"],
  children: {
    body: {
      childrenIds: ["a"],
      children: {
        a: {
          name: "Box A"
        }
      }
    }
  }
};
window.renderCount = window.renderCount || { all: 0 };

const Main = () => {
  const [elements, setElements] = useState(data);
  const [hoverId, setHoverId] = useState(null);
  const [verticalPos, setVerticalPos] = useState("none...");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  let currentHover;
  let currentVerticalPos;

  const getElement = (path, element) => {
    const el = element.children[path[0]];
    return path.length === 1 ? el : getElement(path.slice(1), el);
  };

  const insertBeforeAfter = (draggedItem, pathOfTarget) => {
    const parentPath = pathOfTarget.slice(0, -1);
    const targetId = pathOfTarget.pop();
    const els = { ...elements };

    // use pointer to replace all parents from the top down
    let pointer = els;
    for (let id of parentPath) {
      pointer = pointer.children[id];
      pointer.children = { ...pointer.children };
      pointer.children[id] = { ...pointer.children[id] };
    }

    const parent = pointer;
    const newId = Math.random()
      .toString(36)
      .substr(2, 9);

    const indexOfTarget = parent.childrenIds.findIndex(
      l_id => l_id === targetId
    );
    const ids = parent.childrenIds;

    if (currentVerticalPos === "bottom") {
      parent.childrenIds = [
        ...ids.slice(0, indexOfTarget + 1),
        newId,
        ...ids.slice(indexOfTarget + 1)
      ];
    } else {
      parent.childrenIds = [
        ...ids.slice(0, indexOfTarget),
        newId,
        ...ids.slice(indexOfTarget)
      ];
    }

    parent.children = { ...parent.children };
    parent.children[newId] = { name: draggedItem.text, childrenIds: [] };

    setElements(els);
    setLastUpdated(new Date());
  };

  const appendChild = (draggedItem, pathOfTarget) => {
    const els = { ...elements };

    // use pointer to replace all parents from the top down
    let pointer = els;
    for (let id of pathOfTarget) {
      pointer = pointer.children[id];
      pointer.children = { ...pointer.children };
      pointer.children[id] = { ...pointer.children[id] };
    }

    const target = pointer;
    const newId = Math.random()
      .toString(36)
      .substr(2, 9);

    const ids = target.childrenIds || [];
    target.childrenIds = [...ids, newId];

    target.children = target.children || {};
    target.children = { ...target.children };
    target.children[newId] = { name: draggedItem.text, childrenIds: [] };

    setElements(els);
    setLastUpdated(new Date());
  };

  const dropItem = (item, monitor, elPath, element) => {
    if (monitor.didDrop()) return;

    if (currentVerticalPos === "center") {
      appendChild(item, elPath);
    } else {
      insertBeforeAfter(item, elPath);
    }

    currentHover = null;
    setHoverId(null);
  };

  const hoverItem = (item, monitor, elPath, element, ref) => {
    if (!monitor.isOver({ shallow: true })) return;

    if (!ref.current) {
      return;
    }

    const hoverBoundingRect = ref.current.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    const centerSize = element.name === "Text" ? 0 : 6;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    const diff = hoverClientY - hoverMiddleY;
    const pos =
      Math.abs(diff) < centerSize ? "center" : diff > 0 ? "bottom" : "top";
    setVerticalPos(pos);
    currentVerticalPos = pos;

    if (element.id === currentHover || element.id === "body") {
      return;
    }
    currentHover = element.id;
    setHoverId(element.id);
  };

  const body = elements.children["body"];
  body.id = "body";

  return (
    <MyContext.Provider value={{ hoverId, lastUpdated, verticalPos }}>
      <div>
        <Element
          element={body}
          elPath={["body"]}
          isSelected={hoverId === "body"}
          insertBeforeAfter={insertBeforeAfter}
          hoverItem={hoverItem}
          dropItem={dropItem}
          lastUpdated={lastUpdated}
        />
      </div>
    </MyContext.Provider>
  );
};

export default Main;

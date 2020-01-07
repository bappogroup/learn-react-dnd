import React from "react";
import "./App.css";
import Container from "./Tree";
import ViewCanvas from "./ViewCanvas";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TestDragAndResize from "./testDragAndResize";
import ComponentList from "./ComponentList";
import { useState, useRef } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import styles from "./testDragAndResize/styles";
import NestedBlocks from "./NestedBlocks";
import Button from "./NestedBlocks/Button";

const DragLayer = ({ isDragging }) => {
  const cpr = useDragLayer(monitor => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  if (!cpr.isDragging || !cpr.currentOffset) return null;
  if (!cpr.item || cpr.item.type !== "treenode") return null;

  if (cpr.item.text === "Button") {
    return (
      <div
        style={{
          left: cpr.currentOffset.x,
          top: cpr.currentOffset.y,
          position: "absolute",
          opacity: 0.6,
          transform: "rotate(-5deg)"
        }}
      >
        <Button />
      </div>
    );
  }

  return (
    <div
      style={{
        left: cpr.currentOffset.x,
        top: cpr.currentOffset.y,
        position: "absolute",
        ...styles.draglayer
      }}
    >
      {cpr.item.text}
    </div>
  );
};

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          position: "absolute",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0
        }}
      >
        <div style={{ width: 100, background: "#334", position: "relative" }}>
          <ComponentList />
        </div>
        <div style={{ flex: 1, background: "#eef", position: "relative" }}>
          <NestedBlocks />
        </div>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            pointerEvents: "none"
          }}
        >
          <DragLayer />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;

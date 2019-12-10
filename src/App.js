import React from "react";
import "./App.css";
import Container from "./Tree";
import ViewCanvas from "./ViewCanvas";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Rnd } from "react-rnd";

function App() {
  return (
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
      <div style={{ width: 400, background: "#334" }}>
        <DndProvider backend={HTML5Backend}>
          <Container />
        </DndProvider>
      </div>
      <ViewCanvas />
    </div>
  );
}

export default App;

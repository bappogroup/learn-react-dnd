import React from "react";
import { useState } from "react";
import { Rnd } from "react-rnd";

const _data = [
  {
    id: 1,
    selectd: false,
    name: "Element1",
    x: 100,
    y: 100,
    width: 200,
    height: 50
  },
  {
    id: 2,
    selectd: false,
    name: "Element2",
    x: 200,
    y: 200,
    width: 200,
    height: 50
  },
  {
    id: 3,
    selectd: false,
    name: "Element3",
    x: 300,
    y: 300,
    width: 200,
    height: 50
  }
];

export default () => {
  const [elements, setElements] = useState(_data);
  let busy = false;

  const Block = ({ name, id, x, y, selectd, width, height }) => (
    <Rnd
      default={{
        x,
        y,
        width,
        height
      }}
      minWidth={10}
      minHeight={10}
      bounds="window"
      onDragStart={e => {
        busy = true;
        console.log(e);
        // e.nativeEvent.dataTransfer.setData("text/plain", "moving....");
      }}
      onDragStop={(e, data) => {
        console.log(data);
        busy = false;
        let els = elements.map(el =>
          el.id === id
            ? {
                ...el,
                x: data.x,
                y: data.y
              }
            : el
        );

        if (e.shiftKey) {
          els = els.map(el =>
            el.id === id ? { ...el, selectd: !el.selectd } : el
          );
        } else {
          els = els.map(el =>
            el.id === id ? { ...el, selectd: true } : { ...el, selectd: false }
          );
        }

        setElements(els);
      }}
      onResizeStop={(event, resizeDirection, refToElement, delta, position) => {
        const els = elements.map(el =>
          el.id === id
            ? {
                ...el,
                width: el.width + delta.width,
                height: el.height + delta.height
              }
            : el
        );
        setElements(els);
      }}
      onClick={e => {
        // if (e.shiftKey) {
        //   const els = elements.map(el =>
        //     el.id === id ? { ...el, selectd: true } : el
        //   );
        //   setElements(els);
        // }
      }}
    >
      <div
        style={{
          background: "white",
          position: "absolute",
          boxShadow: "0px 0px 10px #ccc",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: selectd ? "blue" : "white",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0
        }}
      >
        {name} id={id} {selectd ? "yes" : "no"}
      </div>
    </Rnd>
  );

  const resize = e => {
    const dragger = document.getElementById("dragselector");
    const pos = dragger.getBoundingClientRect();
    const height = e.clientY - pos.top;
    const width = e.clientX - pos.left;
    dragger.style.height = height + "px";
    dragger.style.width = width + "px";
  };

  const stopResize = e => {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
    const dragger = document.getElementById("dragselector");
    const range = {
      xfrom: dragger.offsetLeft,
      xto: dragger.offsetLeft + dragger.getBoundingClientRect().width,
      yfrom: dragger.offsetTop,
      yto: dragger.offsetTop + dragger.getBoundingClientRect().height
    };

    const els = elements.map(el =>
      el.x > range.xfrom &&
      el.x < range.xto &&
      el.y > range.yfrom &&
      el.y < range.yto
        ? {
            ...el,
            selectd: true
          }
        : {
            ...el,
            selectd: false
          }
    );
    setElements(els);

    dragger.style.display = "none";
  };

  const deselectAll = () => {
    setElements(elements.map(e => ({ ...e, selectd: false })));
  };

  const align = side => {
    const flat = {};
    for (let el of elements) {
      flat[el.id] = el;
    }

    // selected
    const sel = elements.filter(e => e.selectd);

    if (sel.length === 0) return;

    if (side === "right") {
      let right = 0;
      for (let el of sel) {
        const r = el.x + el.width;
        if (r > right) {
          right = r;
        }
      }
      for (let el of sel) {
        flat[el.id] = { ...flat[el.id], width: right - el.x };
      }
    } else {
      let left = 999999999;
      for (let el of sel) {
        if (el.x < left) {
          left = el.x;
        }
      }
      for (let el of sel) {
        flat[el.id] = {
          ...flat[el.id],
          x: left,
          width: el.width + el.x - left
        };
      }
    }

    const els = elements.map(el => flat[el.id]);
    setElements(els);
  };

  return (
    <div
      style={{
        flex: 1,
        background: "#dfd",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <button onClick={() => deselectAll()}>de-select</button>
      <button onClick={() => align("left")}>Align Left</button>
      <button onClick={() => align("right")}>Align Right</button>
      <div
        id="parent"
        style={{
          flex: 1,
          background: "#ddd",
          position: "relative"
        }}
        onMouseDown={e => {
          if (busy) return;
          // deselectAll();
          const dragger = document.getElementById("dragselector");
          const parent = document.getElementById("parent");
          const left = e.clientX - parent.offsetLeft;
          const top = e.clientY - parent.offsetTop;
          dragger.style.width = "3px";
          dragger.style.height = "3px";
          dragger.style.left = left + "px";
          dragger.style.top = top + "px";
          dragger.style.display = "block";
          window.addEventListener("mousemove", resize);
          window.addEventListener("mouseup", stopResize);
        }}
      >
        <div
          id="dragselector"
          style={{
            top: 10,
            left: 10,
            borderColor: "blue",
            borderWidth: 1,
            borderStyle: "solid",
            display: "none",
            position: "absolute"
          }}
        />
        {elements.map(el => (
          <Block
            name={el.name}
            id={el.id}
            x={el.x}
            y={el.y}
            selectd={el.selectd}
            width={el.width}
            height={el.height}
          />
        ))}
      </div>
    </div>
  );
};

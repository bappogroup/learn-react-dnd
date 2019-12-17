import React from "react";
import { useState, useRef } from "react";
import { useDrag, useDrop, useDragLayer } from 'react-dnd'
import styles from "./styles";
const _cards = [
  { id: 1, x: 50, y: 100, width: 100, height: 70, text: "one" }, 
  { id: 2, x: 50, y: 200, width: 100, height: 70, text: "two" },
  { id: 3, x: 50, y: 300, width: 100, height: 70, text: "three" },
  { id: 4, x: 50, y: 400, width: 100, height: 70, text: "four" },
]

let newid = 10000;

export default () => {
  const [cards, setCards] = useState(_cards);
  let startOffset = {
    x: 0,
    y: 0,
  };

  const updateCard = (id, changes) => {
    const newcards = cards.map(c => c.id === id ? { ...c, ...changes } : c );
    setCards(newcards);
  }

    const Container = ({children}) => {
    const [collectedProps, drop] = useDrop({
        accept: ["CARD", "treenode"],
        drop: (item, monitor) => {
            if (item.type === "treenode") {
                const droppedAt = monitor.getClientOffset();
                setCards([...cards, { id: newid++ , x: droppedAt.x - 100, y: droppedAt.y, width: 100, height: 70, text: item.text }])
                return;
            }
            
            if (item.type === "CARD" ) { 
                const offset = monitor.getClientOffset();
                const delta = {
                x: offset.x - startOffset.x,
                y: offset.y - startOffset.y,
                }
                updateCard(item.id, { x: item.x + delta.x, y: item.y + delta.y });
            }
        },
        hover: (item, monitor) => {
        }
    })

        return <div ref={drop} style={{ flex: 1, background: "#f8f8f8", position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
        {children}
        </div>
    }


 const Card = ({ id, text, x=20, y=10, width=100, height=100, changeCard=() =>{} } ) => {
  const ref = useRef(null);
  const size = { width, height };

  let refX = 0;
  let refY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let direction;

  const moveCard = (e) => {
    console.log(e.clientX);
  }
  let listener;

  const [{isDragging}, drag, preview] = useDrag({
    item: { type: 'CARD', id, x, y },
    begin: (monitor) => { 
        startOffset = monitor.getClientOffset();
    },
    collect: monitor => {
      return {
        isDragging: !!monitor.isDragging(),
      }
    }
  })

  const resize = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    if (ref && ref.current && ref.current.style) {
        deltaX = direction === "x" || direction === "xy" ? (e.clientX - refX ) : 0;
        deltaY = direction === "y" || direction === "xy" ? (e.clientY - refY ) : 0;
        const newWidth = size.width + deltaX;
        const newHeight = size.height + deltaY;

      if (direction === "x" || direction === "xy") ref.current.style.width = newWidth + "px";
      if (direction === "y" || direction === "xy") ref.current.style.height = newHeight + "px";
    }

  }

  const stopResize = e => {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
    const data = { width: size.width + deltaX, height: size.height + deltaY };
    console.log(data);
    updateCard(id, data);
  }

  preview(ref);

  return (
    <div
      id="card"
      ref={ref} 
      style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", top:y, left:x, width: size.width, height: size.height, background: "white", opacity: isDragging ? 0.1 : 1, boxShadow: "0px 0px 10px #aaa" }}>
      <span>{text}</span>
      <div 
        ref={drag} 
        style={styles.dragHandle} />
      <div 
        style={styles.rightHandle} 
        onMouseDown={e => {
          refX = e.clientX;
          direction = "x";
          e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
          window.addEventListener("mousemove", resize);
          window.addEventListener("mouseup", stopResize);
        }}
      />
      <div 
        style={styles.bottomHandle} 
        onMouseDown={e => {
          direction = "y";
          refY = e.clientY;
          window.addEventListener("mousemove", resize);
          window.addEventListener("mouseup", stopResize);
        }}
      />
      <div 
        style={styles.cornerHandle} 
        onMouseDown={e => {
          direction = "xy";
          refY = e.clientY;
          refX = e.clientX;
          window.addEventListener("mousemove", resize);
          window.addEventListener("mouseup", stopResize);
        }}
      />
    </div>
  )
}
    return  <Container>

        {cards.map(card => <Card id ={card.id} y={card.y} x={card.x} width={card.width} height={card.height} text={card.text} />)}  
    </Container>
};





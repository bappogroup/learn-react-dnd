import React from "react";
import { useState, useRef, useEffect } from "react";
import { useDrag, useDrop, useDragLayer } from 'react-dnd'
import MyContext from "./context";

const Element_ = ({element, elPath=[], isSelected=false, insertAfter, hoverItem, dropItem} ) => {
  const ref = useRef(null);

  const [{isDragging}, drag, preview] = useDrag({
    item: { type: 'ELEMENT', element },
    begin: (monitor) => { },
    collect: monitor => {
      return {
        isDragging: !!monitor.isDragging(),
      }
    }
  })

  const [, drop] = useDrop({
    accept: "treenode",
    drop: (item, monitor) => dropItem(item, monitor, elPath, element),
    hover: (item, monitor) => {
        hoverItem(item, monitor, elPath, element);
    }
  })

  drop(drag(ref));

  const renderChildren = (element, hoverId, lastUpdated) =>  {
    if ( !element.childrenIds ) return null;
    return element.childrenIds.map(key => ({...element.children[key], id: key })).map( el => {
      const _path = [...elPath, el.id];
      return <Element 
        element={el} 
        elPath={_path} 
        key={el.id } 
        isSelected={el.id === hoverId} 
        insertAfter={insertAfter}
        hoverItem={hoverItem}
        dropItem={dropItem}
        lastUpdated={lastUpdated}
        />
    });
  }

  const borderWidth = isSelected ? 2 : 1;
  const padding = 10 + borderWidth;

  window.renderCount[element.id] = window.renderCount[element.id] || 0;
  window.renderCount[element.id]++;
  window.renderCount.all++;

  return <div ref={ref} style={{ padding: 5}} >
        <div style={{ borderStyle: "solid", borderWidth, borderColor: "blue", padding }} >
        <div>{element.name}<span style={{ fontSize: 8, marginLeft: 20 }}>Path={elPath.join(">")}
        </span>
        </div>
        <MyContext.Consumer>
          {value => renderChildren(element, value.hoverId, value.lastUpdated)}
        </MyContext.Consumer>
        </div>
        <div style={{ background: "repeating-linear-gradient(45deg,#606dbc,#606dbc 10px,#465298 10px,#465298 20px)"
                    , height: isSelected ? 30 : 0, display: "box", color: "white"}} />
    </div>

};

// export default Element;

const areEqual = (prevProps, nextProps) => {
  return prevProps.element.id === nextProps.element.id && 
         prevProps.isSelected === nextProps.isSelected && 
         prevProps.lastUpdated === nextProps.lastUpdated;    
}

 const Element = React.memo(Element_, areEqual)
// const Element = Element_;

export default Element;

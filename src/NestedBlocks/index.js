import React from "react";
import { useState, useRef, useEffect } from "react";
import { useDrag, useDrop, useDragLayer } from 'react-dnd';
import Element from "./Element";
import MyContext from "./context";

const data = {
    childrenIds: ["body"],
    children:{
        body: {
            childrenIds: ["a", "b"],
            children: {
                a: {
                    name: "a",
                    childrenIds: ["a1", "a2"],
                    children: {
                        a1: {
                            name: "a1"
                        },
                        a2: {
                            name: "a2"
                        }
                    }
                },
                b: {
                    name: "b",
                    childrenIds: [],
                },        
            }
        }
    }
}
window.renderCount = window.renderCount || { all: 0 };


const Main = () => {
 const [elements, setElements] = useState(data);
 const [hoverId, setHoverId] = useState(null);
 const [dragId, setdragId] = useState(null);
 const [lastUpdated, setLastUpdated] = useState(new Date());


 let currentHover;

  const getElement = (path, element) => {
    const el = element.children[path[0]];
    return path.length === 1 ? el : getElement(path.slice(1), el);
  }

 const insertAfter = (draggedItem, pathOfTarget) => {
   const parentPath = pathOfTarget.slice(0,-1);   
   const targetId = pathOfTarget.pop();
   const els = {...elements};

   // use pointer to replace all parents from the top down
   let pointer = els;
   for (let id of parentPath) {
     pointer = pointer.children[id];
     pointer.children = { ...pointer.children };
     pointer.children[id] = {...pointer.children[id]};
   }

   const parent = pointer;
   const newId = Math.random().toString(36).substr(2, 9);

   const indexOfTarget = parent.childrenIds.findIndex(l_id => l_id === targetId);
   const ids = parent.childrenIds;
   parent.childrenIds = [ ...ids.slice(0,indexOfTarget+1), newId, ...ids.slice(indexOfTarget+1) ];

   parent.children = {...parent.children};
   parent.children[newId] = { name: draggedItem.text, childrenIds: [] };

   setElements(els);
   setLastUpdated(new Date());

 }

 const dropItem = (item, monitor, elPath, element) => { 
        if (monitor.didDrop()) return;
        insertAfter(item, elPath);
        currentHover = null;
        setHoverId(null);
    };


 const hoverItem = (item, monitor, elPath, element) => {     
        if (!(monitor.isOver({ shallow: true }))) return;
        if ( element.id === currentHover || element.id === "body") {
        return;
        }
        currentHover = element.id;
        setHoverId(element.id);
    };



 

const body = elements.children["body"];
body.id = "body";

return <MyContext.Provider value={{ hoverId, lastUpdated }}>
    <div>
        <Element element={body} 
            elPath={["body"]} 
            isSelected={hoverId === "body"} 
            insertAfter={insertAfter}
            hoverItem={hoverItem}
            dropItem={dropItem}
            lastUpdated={lastUpdated}
        /> 
    <button onClick={() => setHoverId("b")} >  </button>
  </div>
</MyContext.Provider>

};

export default Main;





import React, { useEffect } from "react";
import {useDrag} from "react-dnd";
import { getEmptyImage } from 'react-dnd-html5-backend';

const components = [{ id: 1001, text: "Text" }, { id: 1002, text: "View"}, { id: 1003, text: "Box" }];

export default () => {
  const Row = ({id, text}) => {
        const [collectedProps, drag, preview] = useDrag({
           item: { id, text, type: 'treenode'  },
        })
      
      	useEffect(() => {
		    preview(getEmptyImage(), { captureDraggingState: true })
	    }, []);

      return <div ref={drag} 
         style={{ margin: 10, borderWidth: 2, borderColor: "#aaa", borderStyle: "dashed", color: "#aaa", width: 50, height: 50, fontSize: 11 , display: "flex", alignItems: "center", justifyContent: "center"}}>
            {text} 
          </div>
  }

  return <div>
    {components.map(c => <Row id={c.id} text={c.text} />)}
  </div>



}
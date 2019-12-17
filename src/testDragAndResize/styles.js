const handleOpacity = 0.1;

export default {
    dragHandle : { 
        position: "absolute", 
        borderWidth: 1,
        borderColor: "black",
        borderStyle: "dashed",
        top: 0, 
        left: 0, 
        right: 10, 
        bottom: 10, 
        cursor: "move", 
        opacity: handleOpacity
    },
    rightHandle: {
        position: "absolute", 
        borderWidth: 1,
        borderColor: "black",
        borderStyle: "dashed",
        top: 0, 
        right: 0, 
        width: 5, 
        bottom: 10, 
        cursor: "col-resize", 
        opacity: handleOpacity 
    },
    bottomHandle: {
      position: "absolute", 
      borderWidth: 1,
      borderColor: "black",
      borderStyle: "dashed",
      left: 0, 
      right: 10, 
      bottom: 0, 
      height: 5, 
      cursor: "row-resize", 
      opacity: handleOpacity
    },
    cornerHandle: {
      position: "absolute", 
      borderWidth: 1,
      borderColor: "black",
      borderStyle: "dashed",
      right: 0, 
      bottom: 0, 
      height: 5,
      width: 5, 
      cursor: "nwse-resize", 
      opacity: handleOpacity
    },
    draglayer: {
      background: "white",
      height: 70,
      width: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0px 0px 10px #aaa"
    }  
}
    
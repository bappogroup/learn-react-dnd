import React, { useState } from "react";
import Card from "./Card";
import update from "immutability-helper";

const style = {
  width: 400,
  height: 500,
  paddingTop: 50
};

const Container = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: "Component1",
      parent: "root",
      expanded: false
    },
    {
      id: 2,
      text: "Component2",
      parent: 1
    },
    {
      id: 3,
      text: "Div XYZ",
      parent: 1
    },
    {
      id: 4,
      parent: "root",
      text: "Another DIV",
      expanded: true
    },
    {
      id: 5,
      text: "Text123",
      parent: 4
    },
    {
      id: 6,
      text: "Abc Component",
      parent: 4
    },
    {
      id: 7,
      text: "Another Component",
      parent: 4
    }
  ]);

  const moveCard = (dragIndex, hoverIndex) => {
    const dragCard = { ...cards[dragIndex] };
    const hoverCard = cards[hoverIndex];
    dragCard.parent = hoverCard.parent;
    setCards(
      update(cards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      })
    );
  };

  const updateCard = (id, changes) => {
    setCards(cards.map(c => (c.id === id ? { ...c, ...changes } : c)));
  };

  const moveSideways = (index, direction) => {
    const card = { ...cards[index] };
    let _cards;
    if (direction === "right") {
      const previousCard = findPreviousSibling(cards, index);
      if (!previousCard) return;
      card.parent = previousCard.id;
      previousCard.expanded = true;
      _cards = cards.map((c, idx) => {
        if (c.id === card.id) return card;
        if (c.id === previousCard.id) return previousCard;
        return c;
      });
    } else {
      const parent = cards.find(c => c.id === card.parent);
      if (!parent) return;
      card.parent = parent.parent;
      _cards = cards.map((c, idx) => {
        if (c.id === card.id) return card;
        return c;
      });
      _cards = sortCards(_cards);
    }

    setCards(_cards);
  };

  return (
    <div style={style} onClick={e => console.log(e)}>
      {enhance(cards).map((card, i) => (
        <Card
          key={card.id}
          index={i}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
          updateCard={updateCard}
          moveSideways={moveSideways}
          indent={card.indent}
          expanded={card.expanded}
          visible={card.visible}
          childrenIds={card.childrenIds}
        />
      ))}
    </div>
  );
};

const sortCards = crds => {
  return crds;
};

const findPreviousSibling = (cards, index) => {
  const card = cards[index];
  let found = false;
  let i = index;
  let sibling = card;
  while (sibling && !found) {
    i = i - 1;
    sibling = cards[i];
    if (sibling.parent === card.parent) found = true;
  }
  return sibling;
};

export default Container;

const enhance = cards => {
  const nodes = { root: { childrenIds: [] } };
  let i = 0;
  for (let card of cards) {
    i++;
    const c = { ...card };
    c.seq = i;
    c.childrenIds = [];
    nodes[c.id] = c;
  }

  // now add the children
  for (let card of cards) {
    nodes[card.parent].childrenIds.push(card.id);
  }

  const processNode = (id, indent, parent) => {
    const node = nodes[id];
    node.indent = indent;
    node.visible = parent.expanded;
    node.childrenIds.map(childId => processNode(childId, indent + 1, node));
  };

  for (let card of cards.filter(c => c.parent === "root")) {
    processNode(card.id, 1, { expanded: true });
  }

  const result = cards.map(c => nodes[c.id]);
  return result;
};

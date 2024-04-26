import attack from 'components/game/cards/attack-1.png';
import chicken from 'components/game/cards/chicken.png';
import defuse from 'components/game/cards/defuse-1.png';
import favor from 'components/game/cards/favor-1.png';
import nope from 'components/game/cards/nope.png';
import randchick1 from 'components/game/cards/randchick-1.png';
import randchick2 from 'components/game/cards/randchick-2.png';
import randchick3 from 'components/game/cards/randchick-3.png';
import randchick4 from 'components/game/cards/randchick-4.png';
import seethefuture from 'components/game/cards/seethefuture-1.png';
import shuffle from 'components/game/cards/shuffle-1.png';
import skip from 'components/game/cards/skip-1.png';


export const cardTypes = [
  {
    internalCode: 1,
    name: "explosion",
    effect: "You must play a Defuse card, or you explode!",
    imageUrl: chicken,
    isOpen: true,
  },
  {
    internalCode: 2,
    name: "defuse",
    effect: "Defuse the Exploding Kitten",
    imageUrl: defuse,
    isOpen: true,
  },
  {
    internalCode: 3,
    name: "attack",
    effect: "End your turn and force the next player to take two turns.",
    imageUrl: attack,
    isOpen: true,
  },
  {
    internalCode: 4,
    name: "skip",
    effect: "Immediately end your turn without drawing a card.",
    imageUrl: skip,
    isOpen: true,
  },
  {
    internalCode: 5,
    name: "favor",
    effect: "Force another player to give you one of their cards.",
    imageUrl: favor,
    isOpen: true,
  },
  {
    internalCode: 6,
    name: "shuffle",
    effect: "Shuffle the draw pile.",
    imageUrl: shuffle,
    isOpen: true,
  },
  {
    internalCode: 7,
    name: "future",
    effect: "Secretly peek at the top three cards in the draw pile.",
    imageUrl: seethefuture,
    isOpen: true,
  },
  {
    internalCode: 8,
    name: "hairypotatocat",
    effect: "Play two to have the same effect as a skip card.",
    imageUrl: randchick1,
    isOpen: true,
  },
  {
    internalCode: 9,
    name: "tacocat",
    effect: "Play two to have the same effect as a future card.",
    imageUrl: randchick2,
    isOpen: true,
  },
  {
    internalCode: 10,
    name: "cattermelon",
    effect: "Play two to have the same effect as a attack card.",
    imageUrl: randchick3,
    isOpen: true,
  },
  {
    internalCode: 11,
    name: "beardcat",
    effect: "Play two to have the same effect as a shuffle card.",
    imageUrl: randchick4,
    isOpen: true,
  },
  {
    internalCode: 12,
    name: "nope",
    effect: "Deny a move.",
    imageUrl: nope,
    isOpen: true,
  },
];

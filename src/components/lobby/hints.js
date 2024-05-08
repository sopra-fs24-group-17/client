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


export const hints = [
  {
    hint: "Always keep a defuse card in hand; you never know when you'll need it.",
    image: defuse
  },
  {
    hint: "Save your attack cards for when you sense an opponent is vulnerable.",
    image: attack
  },
  {
    hint: "Use skip cards wisely to avoid drawing when the deck feels dangerous.",
    image: skip
  },
  {
    hint: "Stack nope cards for crucial moments to counter significant plays.",
    image: nope
  },
  {
    hint: "Peek at the deck with a seethefuture card before making risky moves.",
    image: seethefuture
  },
  {
    hint: "Force a card trade with a favor card when your hand lacks variety.",
    image: favor
  },
  {
    hint: "Watch the number of cards in the deck; fewer cards mean higher risk.",
    image: null
  },
  {
    hint: "Remember, playing two wild chicken cards gives you a free skip—use it strategically.",
    image: randchick1
  },
  {
    hint: "Try to memorize key cards' positions when you peek at the deck.",
    image: null
  },
  {
    hint: "Use attack cards to force a well-stocked opponent to deplete their hand.",
    image: attack
  },
  {
    hint: "Playing a shuffle card after seeing the future can confuse your opponents about the deck order.",
    image: shuffle
  },
  {
    hint: "Don't waste a nope card on minor plays; save it for blocking game-changing moves.",
    image: nope
  },
  {
    hint: "The more players, the higher the chance of drawing an explosion—adjust your strategy accordingly.",
    image: null
  },
  {
    hint: "Manipulate the deck's order with a defuse card to set traps or save yourself later.",
    image: defuse
  },
  {
    hint: "Random chicken cards can be a wildcard—keep them for unexpected situations.",
    image: null
  },
  {
    hint: "Keep track of how many explosion and defuse cards have been played to gauge the risk.",
    image: chicken
  },
  {
    hint: "Use the skip card to avoid drawing when the next few cards are known threats.",
    image: skip
  },
  {
    hint: "Timing is key with the shuffle card—use it when the known card order is against you.",
    image: shuffle
  },
  {
    hint: "Gathering information from other players' actions before making your move can be crucial.",
    image: null
  },
  {
    hint: "Remember that a nope card cannot stop an explosion or defuse—plan accordingly.",
    image: nope
  },
  {
    hint: "Shuffle the deck when you feel the current order is too predictable or risky.",
    image: shuffle
  },
  {
    hint: "Favor cards can change the game dynamics; use them to disrupt opponents' hands.",
    image: favor
  },
  {
    hint: "Use two chicktionary cards tactically to gain insights like a seethefuture card.",
    image: randchick2
  },
  {
    hint: "Rainbow chicken cards can turn the tide with an unexpected attack if paired.",
    image: randchick3
  },
  {
    hint: "Surfing chicken cards are your shuffle wildcard—use them to shake up the game.",
    image: randchick4
  },
  {
    hint: "Use your knowledge of the deck to bait opponents into bad decisions.",
    image: seethefuture
  },
  {
    hint: "Track cards played to calculate the likelihood of drawing an explosion.",
    image: null
  },
  {
    hint: "Sometimes the best action is a well-timed pass; use skip strategically.",
    image: skip
  }
];


export function getRandomHint() {
  const randomIndex = Math.floor(Math.random() * hints.length);
    
  return hints[randomIndex];
}


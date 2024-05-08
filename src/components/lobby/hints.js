export const hints = [
  "Always keep a defuse card in hand; you never know when you'll need it.",
  "Save your attack cards for when you sense an opponent is vulnerable.",
  "Use skip cards wisely to avoid drawing when the deck feels dangerous.",
  "Stack nope cards for crucial moments to counter significant plays.",
  "Peek at the deck with a seethefuture card before making risky moves.",
  "Force a card trade with a favor card when your hand lacks variety.",
  "Watch the number of cards in the deck; fewer cards mean higher risk.",
  "Remember, playing two wild chicken cards gives you a free skip—use it strategically.",
  "Try to memorize key cards' positions when you peek at the deck.",
  "Use attack cards to force a well-stocked opponent to deplete their hand.",
  "Playing a shuffle card after seeing the future can confuse your opponents about the deck order.",
  "Don't waste a nope card on minor plays; save it for blocking game-changing moves.",
  "The more players, the higher the chance of drawing an explosion—adjust your strategy accordingly.",
  "Manipulate the deck's order with a defuse card to set traps or save yourself later.",
  "Random chicken cards can be a wildcard—keep them for unexpected situations.",
  "Keep track of how many explosion and defuse cards have been played to gauge the risk.",
  "Use the skip card to avoid drawing when the next few cards are known threats.",
  "Timing is key with the shuffle card—use it when the known card order is against you.",
  "Gathering information from other players' actions before making your move can be crucial.",
  "Remember that a nope card cannot stop an explosion or defuse—plan accordingly.",
  "Shuffle the deck when you feel the current order is too predictable or risky.",
  "Favor cards can change the game dynamics; use them to disrupt opponents' hands.",
  "Use two chicktionary cards tactically to gain insights like a seethefuture card.",
  "Rainbow chicken cards can turn the tide with an unexpected attack if paired.",
  "Surfing chicken cards are your shuffle wildcard—use them to shake up the game.",
  "Use your knowledge of the deck to bait opponents into bad decisions.",
  "Track cards played to calculate the likelihood of drawing an explosion.",
  "Sometimes the best action is a well-timed pass; use skip strategically."
];

export function getRandomHint() {
  const randomIndex = Math.floor(Math.random() * hints.length);
    
  return hints[randomIndex];
}


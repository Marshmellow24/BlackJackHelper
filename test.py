from deck import *

testDecks = Game()
testDecks.createMultipleDecks(2)
cards = testDecks.getCards()

print([card.split(" ")[0] for card in cards])
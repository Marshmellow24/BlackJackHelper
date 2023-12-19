from collections import Counter
import random

#Game class which can create decks, which in turn will instantiate cards. DeckNo is class property, so Card object can inherit it via __init__ (can be fixed TODO)
class Game:
    deckNo = 0

    #deckNo is 0 at first instantiation and self.deckNo always takes current class deckNo value (that way there should be unique deckNo within 1 Game Object)
    def __init__(self):
        self.deckNo = Game.deckNo
        self.deck = []

    #creates one Deck of 52 card objects and maintains them in a list    
    def createDeck(self):
        Game.deckNo += 1
        self.deckNo += 1

        for s in range(4):
            for v in range(2,15):
                self.deck.append(Card(v,s))
    
    #creates multiple decks at once  
    def createMultipleDecks(self, decksNo):
        for d in range(decksNo):
            self.createDeck()

    #shows the full deck(s) in a nice readable manner
    def showDeck(self):
        for card in self.deck:
            card.reveal()

    #gets deck (all decks)
    def getDeck(self):
        return self.deck    

    #legacy, returns single cards as list of strings
    def getCards(self):
        cards = []
        for c in self.deck:
            cards.append(c.listValue())
        return cards

    #returns count of all cards
    def getCardsCount(self):
        return len(self.deck)

    #returns number of decks for this object
    def getDeckNo(self):
        return self.deckNo
    
    #clear deck
    def clearDeck(self):
        self.deck = []

#single card object. Has value, suit, also face value (e.g. Jack has fv 10, Ace fv 1/11 etc.) properties. Inherits deck number property from Game class
class Card(Game):
    
    #starts with None None, so 2 parameter equals 2 value, 3 parameter 3 value and so on
    values = ["None", "None", "2", "3",
              "4", "5", "6", "7", "8",
              "9", "10", "Jack", "Queen",
              "King", "Ace"]
    
    suits = ["spades", "hearts", "diamonds", "clubs"]

    #create card with value, suit and face value respectively by iterating through classe's values and suits lists above. Inherits deck number from Game object by which Card object was instantiated.
    def __init__(self, v, s):
        self.v = self.values[v]
        self.s = self.suits[s]
        
        if self.v in ["Jack", "Queen","King"]:
            self.fv = 10 
        elif self.v == "Ace":
            self.fv = 11
        else: 
            self.fv = int(self.v)
        
        self.deckNo = self.deckNo

    #prints a short version of value,suit and card's deckNo
    def reveal(self):
        print(f"{self.v}|{self.s}|{self.deckNo}")

    #gets facevalue (int)
    def getFaceValue(self):
        return self.fv

    #for counting cards (turns object into string)
    def listValue(self):
        return f"{self.v} " + f"{self.s}"
    
    def getValues(self):
        return (self.s, self.v)

    #legacy
    def __str__(self):
        return f"Value: {self.v} Suit: {self.s} Deck: {self.deckNo}"
        
#class to handle counting cards and calculating probabilities
class CardCounter():
    cardsLow = ["2", "3", "4", "5", "6"] 
    cardsMid = ["7", "8","9"]
    cardsHi = ["10", "Jack", "Queen",
            "King", "Ace"]
    
    
    def __init__(self, deck):
        self.decks = deck
    
    # sort cards by value and suit and return dict with occurrence of every single card type (suit, value) in deck. Can also be used to sort Cards from pre sorted groups (e.g. sortGroups())
    def sortCards(self, groups=False):
        # if groups argument true, then we want to return a probability distribution of low, mid, hi cards
        if(groups):            
            count = []
            decks = counter.sortGroups(self.decks)
            # iterate through low, med, hi group decks
            for deck in decks:
                cards = [card.getValues() for card in deck]
                count.append(dict(Counter(cards)))
            # give out list of dicts so that calcProbs can calculate probabilities per each group
            counted = count
        # if groups is false we want a prob dist for every single card
        else: 
            cards = [card.getValues() for card in self.decks]
            # use counter to create dict with tuple(suit, value, facevalue) as key and count as value for each card           
            counted = dict(Counter(cards))
            
        return counted
    
    # calculates the relative occurence of cards within the whole deck
    def calcProbs(self, decks):

        # if argument is dict type it means that deck was not sorted into groups, thus sortCards was called with argument group = 0
        if type(decks) is dict:
            probs = {key: round(value/sum(decks.values()), 5) for (key,value) in decks.items()}
        
        # else it is a list of 3 dicts
        else:
            probs = [] 

            # total number of cards produced by lamba function that iterates through list of dicts
            totalCardsNum = sum(map(lambda x: sum(x.values()), decks))
            
            #prob distribution
            for group in decks:
                probs.append(sum(group.values())/totalCardsNum)
            print(totalCardsNum)
        return probs

    # sorts cards into arbitrary groups low, mid, high
    def sortGroups(self, deck):
        lowCount = []
        midCount = []
        hiCount = []
        
        for card in deck:
            if card.v in self.cardsLow:
                lowCount.append(card)
            elif card.v in self.cardsMid:
                midCount.append(card)
            else:
                hiCount.append(card)
        return lowCount, midCount, hiCount

    def getGroupsCount(self):
        pass

    def showCount(self):
        print(self.c)

#class to handle removing cards specifically, randomly from deck
class CardRemover():
    
    def __init__(self, deck):
        self.decks = deck
        self.removedCards = []

    #remove single random card
    def removeRandom(self, count = 1):
        
        for i in range(count):
            randomCard = random.choice(self.cards)
            self.decks.remove(randomCard)    
            self.removedCards.append(randomCard)
        return self.removedCards
    
    #remove multiple random cards
    def removeMultipleRandom(self, count):
        for item in range(count):
            self.removeRandom()

    #remove card with specific suit and value 
    def removeCard(self, value, suit, count = 1):
        
        for i in range(count):
            
            for card in self.decks:
                if card.v == value and card.s == suit:
                    self.decks.remove(card)                    
                    self.removedCards.append(card)
                    break

    # return removed cards as objects
    def getRemovedCards(self):
        return self.removedCards
    
class PlayersHand():
    pass

class DealersHand():
    pass

def valuesMapper(cards):
    return [card.getValues() for card in cards]


if __name__ == "__main__":
    decks = Game()
    decks.createMultipleDecks(3)
    total = decks.getCardsCount()
    print(decks.getDeckNo())
    remover = CardRemover(decks.getDeck())
    counter = CardCounter(decks.getDeck())

    remover.removeCard("2", "spades", 1)
    remover.removeCard("3", "spades", 2)
    remover.removeCard("4", "spades", 2)
    remover.removeCard("3", "diamonds", 2)
    remover.removeCard("3", "clubs", 2)

   
    sorted = counter.sortCards(False)

    print(counter.calcProbs(sorted))



    #print(valuesMapper(remover.getRemovedCards()))











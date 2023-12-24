from flask import Blueprint, render_template, request, jsonify, make_response
from deck import *


views = Blueprint(__name__, "views")

@views.route("/", methods=['GET', 'POST'])
def home():
    # remover and backend deck are created here globally, so other routes can access the same decks and remover
    global remover 
    global gameDeck

    # template deck only used for passing the values to display them on the front end deck
    templateDeck = Game()
    gameDeck = Game()

    remover = CardRemover(gameDeck.getDeck())

    templateDeck.createMultipleDecks(1)
    cards = templateDeck.getCards()
    
    # parse value and sort as separate lists and pass them to html templates
    valueList = [card.split(" ")[0] for card in cards]
    sortList = [sort.split(" ")[1] for sort in cards]
    
    # clear actual game deck so cards will be cleared from game deck and not added when restart or refresh of page or change of deck no (also reassign remover object to new deck object)
    if gameDeck.getCardsCount() != 0:
        gameDeck.clearDeck()
        remover.clearRemoved()
        remover = CardRemover(gameDeck.getDeck())
        # print("clear deck and remover")

    # if different deck no is requested      
    if request.method == "POST" and request.form["decks"] != "":
        decks = request.form["decks"]          
        gameDeck.createMultipleDecks(int(decks))
        # print("option 1 " + str(gameDeck.getCardsCount()))
        return render_template("index.html", value = valueList, sort = sortList, decks = decks)
    
    # if reset button is pressed
    elif request.method == "POST" and request.form["deckCount"]:
        decks = request.form["deckCount"]
        gameDeck.createMultipleDecks(int(decks))
        # print("option 2 " + str(gameDeck.getCardsCount()))
        return render_template("index.html", value = valueList, sort = sortList, decks = decks)
    
    # initial loading
    else:
        gameDeck.createMultipleDecks(1)
        # print("option 3 " + str(gameDeck.getCardsCount()))
        return render_template("index.html", value = valueList, sort = sortList, decks = 1)
   
@views.route("/recount", methods=['POST'])
def recount():
    # init remover and counter here -> can be instantiated every time card is removed w/o messing up anything
    counter = CardCounter(gameDeck.getDeck())
    
    # get json from POST request 
    data = request.get_json()

    # read dict and retrieve value from card key
    removed = data['card']

    # pass value to remover object and let cared be removed from game deck
    remover.removeCard(removed.split(" ")[0],removed.split(" ")[1])     

    # count all probabilities of remaining cards within counter object
    counted = counter.calcProbs(counter.sortCards(False))
    print(removed)

    # make response solves issue that dict cannot be serialized
    return make_response(jsonify(result = list(counted.items())),200)

# count groups of low, mid, high cards and pass them to ajax func in main.js
@views.route("/groupCount", methods=['GET'])
def groupCount():
    counter2 = CardCounter(gameDeck.getDeck())

    countedGroups = counter2.calcProbs(counter2.sortCards(True))
    return jsonify(countedGroups)

# pass list of all removed cards back to frontend
@views.route("/drawnQueue", methods=['GET'])    
def drawnQueue():
    queue = [card.listValue() for card in remover.getRemovedCards()]
    # print(queue)
    return jsonify(queue)

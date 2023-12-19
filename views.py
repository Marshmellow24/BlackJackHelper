from flask import Blueprint, render_template, request, jsonify, make_response
from deck import *

views = Blueprint(__name__, "views")

templateDeck = Game()
gameDeck = Game()

# template deck so the visual front end deck is created
templateDeck.createMultipleDecks(1)
cards = templateDeck.getCards()


@views.route("/", methods=['GET', 'POST'])
def home():
    # clear actual game deck so cards will be cleared from game deck and not added when restart or refresh of page or change of deck no
    if gameDeck.getCardsCount() != 0:
        gameDeck.clearDeck()     

    # if different deck no is requested      
    if request.method == "POST" and request.form["decks"]:
        decks = request.form["decks"]          
        gameDeck.createMultipleDecks(int(decks))
        print(gameDeck.getCardsCount())
        return render_template("index.html", value = [card.split(" ")[0] for card in cards], sort = [sort.split(" ")[1] for sort in cards], decks = decks)
    
    # if reset button is pressed
    elif request.method == "POST" and request.form["deckCount"]:
        decks = request.form["deckCount"]
        gameDeck.createMultipleDecks(int(decks))
        print(gameDeck.getCardsCount())
        return render_template("index.html", value = [card.split(" ")[0] for card in cards], sort = [sort.split(" ")[1] for sort in cards], decks = decks)
    
    # refresh of page or initial loading
    else:   
        gameDeck.createMultipleDecks(1)
        print(gameDeck.getCardsCount())
        return render_template("index.html", value = [card.split(" ")[0] for card in cards], sort = [sort.split(" ")[1] for sort in cards], decks = 1)
   
@views.route("/recount", methods=['POST'])
def recount():
    # init remover and counter here -> can be instantiated every time card is removed w/o messing up anything
    remover = CardRemover(gameDeck.getDeck())
    counter = CardCounter(gameDeck.getDeck())
    
    data = request.get_json()
    removed = data['card']
    remover.removeCard(removed.split(" ")[0],removed.split(" ")[1])     
    counted = counter.calcProbs(counter.sortCards(False))

    # make response solves issue that dict cannot be serialized
    return make_response(jsonify(result = list(counted.items())),200)

@views.route("/groupCount", methods=['GET'])
def groupCount():
    counter2 = CardCounter(gameDeck.getDeck())

    countedGroups = counter2.calcProbs(counter2.sortCards(True))
    return jsonify(countedGroups)
    
    


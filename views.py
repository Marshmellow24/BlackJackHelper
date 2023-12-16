from flask import Blueprint, render_template, request, jsonify, make_response
from deck import *

views = Blueprint(__name__, "views")

templateDeck = Game()
gameDeck = Game()

templateDeck.createMultipleDecks(1)
cards = templateDeck.getCards()


@views.route("/", methods=['GET', 'POST'])
def home():
    # clear actual game deck so cards do not get added on t
    if gameDeck.getCardsCount() != 0:
        gameDeck.clearDeck()     
          
    if request.method == "POST" and request.form["decks"]:
        decks = request.form["decks"]          
        gameDeck.createMultipleDecks(int(decks))
        print(gameDeck.getCardsCount())
        return render_template("index.html", value = [card.split(" ")[0] for card in cards], sort = [sort.split(" ")[1] for sort in cards], decks = decks)
    
    elif request.method == "POST" and request.form["deckCount"]:
        decks = request.form["deckCount"]
        gameDeck.createMultipleDecks(int(decks))
        print(gameDeck.getCardsCount())
        return render_template("index.html", value = [card.split(" ")[0] for card in cards], sort = [sort.split(" ")[1] for sort in cards], decks = decks)
    
    else:   
        gameDeck.createMultipleDecks(1)
        print(gameDeck.getCardsCount())
        return render_template("index.html", value = [card.split(" ")[0] for card in cards], sort = [sort.split(" ")[1] for sort in cards], decks = 1)
   
@views.route("/recount", methods=['POST'])
def recount():
    remover = CardRemover(gameDeck.getDeck())
    counter = CardCounter(gameDeck.getDeck())
    
    data = request.get_json()
    removed = data['card']
    remover.removeCard(removed.split(" ")[0],removed.split(" ")[1])     
    counted = counter.calcProbs(counter.sortCards(False))

    return make_response(jsonify(result = list(counted.items())),200)
    
    


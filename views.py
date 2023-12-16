from flask import Blueprint, render_template, request
from deck import *

views = Blueprint(__name__, "views")




@views.route("/", methods=['GET', 'POST'])
def home():
    templateDeck = Game()
    gameDeck = Game()

    templateDeck.createMultipleDecks(1)
    cards = templateDeck.getCards()

    if request.method == "POST" and request.form["decks"]:
        decks = request.form["decks"]          
        gameDeck.createMultipleDecks(int(decks))
        return render_template("index.html", value = [card.split(" ")[0] for card in cards], sort = [sort.split(" ")[1] for sort in cards], decks = decks)
    elif request.method == "POST" and not request.form["decks"]:
        decks = request.form["deckCount"]
        gameDeck.createMultipleDecks(int(decks))
        return render_template("index.html", value = [card.split(" ")[0] for card in cards], sort = [sort.split(" ")[1] for sort in cards], decks = decks)
    else:
        return render_template("index.html", value = [card.split(" ")[0] for card in cards], sort = [sort.split(" ")[1] for sort in cards], decks = 1)
   

    


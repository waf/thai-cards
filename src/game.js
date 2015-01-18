var Card = React.createClass({
    adjustFontSizes: function() {
        var thai = this.refs.thai.getDOMNode();
        var english = this.refs.english.getDOMNode();
        //ratio to account for script size differences betwen english and thai
        thai.style.fontSize = util.fitWordToWidth(thai, 1) + "px";
        english.style.fontSize = util.fitWordToWidth(english, 0.8) + "px";
    },
    componentDidUpdate: function() {
        this.adjustFontSizes();
    },
    componentDidMount: function() {
        this.adjustFontSizes();
    },
    render: function() {
        var cardClass = "card" + (this.props.flipped ? " flipped" : "");

        return (
            <div className={cardClass}>
                <a href="#" className="card-text" onClick={this.props.onClick}>
                    <span ref="thai" className="thai">{this.props.card.thai}</span>
                    <span ref="english" className="english">{this.props.card.english}</span>
                </a>
            </div>
        )
    }
});
var Deck = React.createClass({
    getInitialState: function() {
        return {
            cardIndex: 0,
            flippedCard: false
        }
    },
    componentWillReceiveProps: function(nextProps) {
        // when the deck receives a different number of cards, reset the index to 0
        if(nextProps.cards.length !== this.props.cards.length) {
            this.setState({
                cardIndex: 0
            });
        }
    },
    prevCard: function(e) {
        e.preventDefault();
        this.setState({
            flipped: false,
            cardIndex: Math.max(0, this.state.cardIndex - 1)
        });
    },
    nextCard: function(e) {
        e.preventDefault();
        var nextIndex = this.state.cardIndex + 1;

        if(nextIndex === this.props.cards.length) {
            this.props.onDeckFinished();
            nextIndex = 0;
        }

        this.setState({
            flipped: false,
            cardIndex: nextIndex
        });
    },
    flipCard: function(e) {
        e.preventDefault();
        this.setState({
            flipped: !this.state.flipped
        });
    },
    starCard: function(e) {
        e.preventDefault();
        this.props.onCardStarred(this.props.cards[this.state.cardIndex]);
    },
    render: function() {
        var card = this.props.cards[this.state.cardIndex];
        if(card) {
            var starClass = "star-btn" + (card.starred ? " starred" : "");
            var translateLink = "http://translate.google.com/#th/en/" + card.thai;
            var cardUI = (
                <div>
                    <Card card={card} onClick={this.flipCard} flipped={this.state.flipped} /> 
                    <a className="nav-btn back" href="#" onClick={this.prevCard}><span>&#x25C0;</span></a>
                    <a className="nav-btn next" href="#" onClick={this.nextCard}><span>&#x25B6;</span></a>
                </div>
            );
        } else {
            var cardUI = (
                <p style={{textAlign:"center"}}>
                   No topics are selected. Please select at least one topic from the Settings menu.
                </p>
            );
        }

        return (
            <div className="deck">
                <div className="action-bar">
                    <a target="_blank" href={translateLink}>google</a>
                    <a className={starClass} href="#" onClick={this.starCard}>&#9733;</a>
                    <a href="#settings">settings</a>
                </div>
                {cardUI}
            </div>
        );
    }
});
var Game = React.createClass({
    getInitialState: function() {
        var starCards = window.localStorage.starCards ? 
            JSON.parse(window.localStorage.starCards) :
            [];
        return {
            allModules: {},
            activeModules: [],
            starCards: starCards,
            starMode: false,
            cards: [],
        };
    },
    onSettingChanged: function(changeSet) {
        // update game with new settings
        var root = document.getElementById("game");
        if('font' in changeSet)
            root.dataset.font = changeSet.font;
        if('mode' in changeSet)
            root.dataset.mode = changeSet.mode;
        if('activeModules' in changeSet) {
            var cards = util.shuffleCardsFromModules(this.state.allModules, changeSet.activeModules);
            this.setState({
                activeModules: changeSet.activeModules,
                cards: cards
            });
        }
        if('clearStars' in changeSet)
            this.setState({ starCards: [] });
        if('starMode' in changeSet)
            this.setState({ starMode: changeSet.starMode });
    },
    onDeckFinished: function() {
        var cards = util.shuffleCardsFromModules(this.state.allModules, this.state.activeModules);
        this.setState({ cards: cards });
    },
    componentDidMount: function() {
        var self = this;
        util.loadModules("./modules.json", function(allModules) {
            var cards = util.shuffleCardsFromModules(allModules, self.state.activeModules);
            self.setState({
                allModules: allModules,
                cards: cards
            });
        });
    },
    onCardStarred: function(card) {
        var index = this.state.starCards.indexOf(card.thai);
        if(index === -1) {
            var starCards = this.state.starCards.concat([card.thai])
        } else {
            var starCards = this.state.starCards.filter(function(c) { return c !== card.thai });
        }
        this.setState({ starCards: starCards }, function() {
            window.localStorage.starCards = JSON.stringify(starCards);
        });
    },
    render: function() {

        var deck = this.state.cards;
        for(var i in deck) {
            deck[i].starred = this.state.starCards.indexOf(deck[i].thai) >= 0;
        }
        if(this.state.starMode) {
            deck = deck.filter(function(card) {
                return card.starred;
            });
            // if we've filtered out all the cards, let's not confuse the user by hiding them all
            if(deck.length === 0) {
                deck = this.state.cards;
            }
        }

        return (
            <div id="game">
                <Settings allModules={this.state.allModules} 
                          onSettingChanged={this.onSettingChanged} />
                <Deck cards={deck} onCardStarred={this.onCardStarred} onDeckFinished={this.onDeckFinished} />
            </div>
        );
    },
});

React.initializeTouchEvents(true);
React.render(
    <Game />,
    document.body
);

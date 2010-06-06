Ext.ns('aR.Game');

/**
 * @class aR.Game.Player
 * This is a base player class. <br/>
 * @author aR Talat
 * @version 1.0
 */
 
aR.Game.Player = function(name, shapeCls, iconCls)
{
	/**
     * Player name.
     * @type {String}
     */
	this.name = name;
	
	/**
     * Player score.
     * @type {Number}
     */
	this.score = 0;
	
	/**
     * Player's shape css class (i.e. tick or cross)
     * @type {String}
     */
	this.shapeCls = shapeCls;
	
	/**
     * Player's icon css class
     * @type {String}
     */
	this.iconCls = iconCls;
};

/**
 * @class aR.Game.TicTacToe
 * @extends Ext.util.Observable
 * <p><img src="resources/images/aR.Game.TicTacToe.jpg" /></p>This is a Tic Tac Toe game. <br/>
 * @author aR Talat
 * @version 1.1
 */

aR.Game.TicTacToe = Ext.extend(Ext.util.Observable, {

	/**
	 * @cfg Boolean alternateTurn
     * Alternate players will take the first turn after every round, if this is set to true. Same player gets the first turn if false.
     */
	alternateTurn: true,
	
	/**
	 * @cfg String applyTo
     * The id of the div in which the mark-up of the game will be created. I div will automatically be created if not specified.
     */
	applyTo: null,
	
	/**
     * @cfg Boolean bbar
     * Displays bottom toolbar if set to true.
     */
	bbar: true,

	/**
     * @cfg Boolean multiplayer
     * Determines the game mode (i.e. single-player or multi-player). If this is set to true then user input is required for both player. 
	 * If false, then the game is put in single-player mode, user input is required only for player 1 in this case.
     */
	multiplayer: true,
	
	/**
     * @cfg Boolean showLinks
     * Displays hyperlinks (or any other html) in the bottom toolbar, requires bbar to be set to true.
     */
	showLinks: true,
	
	/**
     * @cfg Boolean showScore
     * Displays the scores of each player in the top toolbar, requires tbar to be set to true.
     */
	showScore: true,
	
	/**
     * @cfg Boolean showSharer
     * Displays the social network sharing icons (or any other html) in the bottom toolbar, requires bbar to be set to true.
     */
	showSharer: true,
	
	/**
     * @cfg Boolean showTbar
     * Displays the top toolbar if set to true.
     */
	showTbar: true,
	
	/**
     * @cfg Boolean showTurn
     * Displays the name of the player who has the turn in the top toolbar, requires tbar to be set to true.
     */
	showTurn: true,
	
	/**
     * @cfg Number startTurn
     * The player that takes the first turn when the game starts from the first time. The number can either be 1 or 2.
     */
	startTurn: 1,
	
	/**
     * @cfg String title
     * The title text to be used in the game's header.
     */
	title: 'Tic Tac Toe',
	
	/**
     * This is a property with type
     * @type {Number}
     */
	 turn: null,
	
	constructor: function(config) 
	{
		config = config || {};
		Ext.apply(this, config);
		
		aR.Game.TicTacToe.superclass.constructor.call(this, config);
		
		this.addEvents(
			/**
             * @event beforemove Fired before a player move is made.
             */
			'beforemove',
			
			/**
             * @event move Fired after a player move is made and before a pc move is made.
             */
			'move',
			
			/**
             * @event aftermove Fired after both player and the following PC moves are made.
             */
			'aftermove',
            
			/**
             * @event beforeselectbox Fired before a box is selected.
             */
			'beforeselectbox',
            
			/**
             * @event afterselectbox Fired after a box is selected.
             */
			'afterselectbox',
            
			/**
             * @event gameStart Fired when a new game is started.
             */
			'gameStart',
            
			/**
             * @event gameEnd Fired when a game ends.
             */
			'gameEnd'
        );
		
		this.initPlayers();
		this.initMarkUp();
		this.initEvents();
		this.startGame();		
    },
	
	// private
	initPlayers:function()
	{
		
		this.p1 = new aR.Game.Player("Player 1", "tick", 'p1');
		
		if(this.multiplayer)
		{
			this.p2 = new aR.Game.Player("Player 2", "cross", 'p2');
		}
		else
		{
			this.p2 = new aR.Game.Player("Computer", "cross", 'pc');
		}
		
		this.draw = new aR.Game.Player("Draw", null, 'draw');
	},
	
	// private
	initMarkUp: function()
	{
		var dh = Ext.DomHelper;

		if (this.applyTo === null)
		{
			this.mainEl = Ext.get(dh.append(document.body, {tag:'div'}));
		}
		else
		{
			this.mainEl = Ext.get(this.applyTo);
		}
		
		this.mainEl.addClass('tictactoe');	
		
		this.mainEl.dom.innerHTML = '<div class="tl"><div class="tr"><div class="tm"></div></div></div><div class="ml"><div class="mr"><div class="mm"></div></div></div><div class="bl"><div class="br"><div class="bm"></div></div></div>';
		
		this.mmEl = Ext.query('.tictactoe .mm')[0];
		
		
		///// Header
		var headerEl = dh.insertFirst(this.mmEl, {tag:'div', cls: 'header', children:[{tag: 'h1', html: this.title}]});
		this.header = Ext.get(headerEl);
		
		///// Tbar
		if (this.showTbar)
		{
			var tbarEl = dh.append(this.mmEl, {tag:'div', cls: 'tbar'});
			this.tbar = Ext.get(tbarEl);
			
			if (this.showScore)
			{
				var scoreEl = dh.append(tbarEl, {tag:'div', cls: 'score'});
				
				var p1ScoreEl = dh.append(scoreEl, {tag:'span', cls: this.p1.iconCls});
				var p1ScoreCountEl = dh.append(p1ScoreEl, {tag:'span', cls: 'code', html: this.p1.score.toString()});
				
				var p2ScoreEl = dh.append(scoreEl, {tag:'span', cls: this.p2.iconCls});
				var p2ScoreCountEl = dh.append(p2ScoreEl, {tag:'span', cls: 'code', html: this.p2.score.toString()});
				
				var drawScoreEl = dh.append(scoreEl, {tag:'span', cls: this.draw.iconCls});
				var drawScoreCountEl = dh.append(drawScoreEl, {tag:'span', cls: 'code', html: this.draw.score.toString()});
				
				this.p1ScoreLabel = Ext.get(p1ScoreCountEl);
				this.p2ScoreLabel = Ext.get(p2ScoreCountEl);
				this.drawScoreLabel = Ext.get(drawScoreCountEl);
			}
			
			if (this.showTurn)
			{
				var turnEl = dh.append(tbarEl, {tag:'div', cls: 'turn', html:'Turn:'});
				var p1TurnEl = dh.append(turnEl, {tag:'span', cls: 'code', children:[{tag:'span', cls:'p1', html:this.p1.name}]});
				var p2TurnEl = dh.append(turnEl, {tag:'span', cls: 'code', children:[{tag:'span', cls:'p2', html:this.p2.name}]});
				
				this.p1TurnLabel = Ext.get(p1TurnEl).setVisibilityMode(Ext.Element.DISPLAY);
				this.p2TurnLabel = Ext.get(p2TurnEl).setVisibilityMode(Ext.Element.DISPLAY);			
				
				this.p2TurnLabel.hide();
			}
		}
		
		
		///// Body
		var bodyEl = dh.append(this.mmEl, {tag:'div', cls: 'body'});
		this.body = Ext.get(bodyEl);
		
		var playareaEl = dh.append(bodyEl, {tag:'table', cls: 'playarea'});
		
		for(var i=0; i<3; i++)
		{
			dh.append(playareaEl, {tag:'tr', children: [{tag:'td', id:'box'+((i*3)+0)},{tag:'td', id:'box'+((i*3)+1)},{tag:'td', id:'box'+((i*3)+2)}]});
		}
		
		// Removing extra borders
		Ext.get(Ext.query('.tictactoe .playarea tr:last-child')[2]).addClass('noBottomBorder');
		Ext.get(Ext.query('.tictactoe .playarea  td:last-child')).addClass('noRightBorder');
		
		this.boxes = [];
		var boxesDom = Ext.query('.tictactoe .playarea  td');
		for(i=0; i<boxesDom.length; i++) 
		{
			this.boxes[i] = Ext.get(boxesDom[i]);
		}
		
		
		///// Bbar
		var bbarEl = dh.append(this.mmEl, {tag:'div', cls: 'bbar'});
		
		var shareEl = dh.append(bbarEl, {tag:'div', cls: 'left share', html: 'Share: '});
		var linkEl = dh.append(bbarEl, {tag:'div', cls: 'right link', html: '<a href="http://artalat.obspk.com" target="_blank">aR Talat</a>'});
		
		var facebook = 'http://www.facebook.com/share.php?u=' + document.URL + '?p=' + document.title;
		var twitter = 'http://twitthis.com/twit?url=' + document.URL + '?title=' + document.title;
		
		dh.append(shareEl, {tag:'a', href: facebook, html: '<img src="images/facebook 16_16.png" alt="Facebook" title="Facebook" />'});
		dh.append(shareEl, {tag:'a', href: twitter, html: '<img src="images/twitter 16_16.png" alt="Twitter" title	="Twitter" />'});
		
		
		///// Mask: Displayed when game ends
		var mask = dh.append(this.mmEl, {tag:'div', cls: 'mask'});
		this.mask = Ext.get(mask);
		
		this.mask.setTop(this.header.getHeight() + this.tbar.getHeight());
		this.mask.setWidth(this.body.getWidth());
		this.mask.setHeight(this.body.getHeight());
		
		var maskMsgEl = dh.append(mask, {tag:'div', cls: 'maskMsg', html:'.'});
		var playagainEl = dh.append(mask, {tag:'a', cls: 'button', children:[{tag:'span', html: 'Play Again'}]});

		this.mask.hide();
		this.maskMsg = Ext.get(maskMsgEl);
		this.playagain = Ext.get(playagainEl);
		
		
		///// Menu
		var menu = dh.append(this.mmEl, {tag:'div', cls: 'mask'});
		this.menu = Ext.get(menu);
		
		this.menu.setTop(this.header.getHeight());
		this.menu.setWidth(this.body.getWidth());
		this.menu.setHeight(this.body.getHeight() + this.tbar.getHeight());
		
		var menuMsgEl = dh.append(menu, {tag:'div', cls: 'menuMsg', html:"<fieldset><legend>Settings</legend>  <label>    <input type='checkbox' name='multi-check' id='multi-check' />    Multi-player</label>  <label><br />    <input type='checkbox' name='alternate-check' id='alternate-check' />    Alternate Turns</label></fieldset>"});
		var playEl = dh.append(menu, {tag:'a', cls: 'button', children:[{tag:'span', html: 'Play'}]});

		//this.mask.hide();
		this.menuMsg = Ext.get(menuMsgEl);
		this.multiCheck = Ext.get('multi-check');
		this.alternateCheck = Ext.get('alternate-check');
		this.play = Ext.get(playEl);
		
		this.multiCheck.dom.checked = this.multiplayer;
		this.alternateCheck.dom.checked = this.alternateTurn;
		
		var menuBtnEl = dh.append(this.mmEl, {tag:'div', cls: 'menuBtn'})
		this.menuBtn = Ext.get(menuBtnEl);
	},
	
	// private
	initEvents: function()
	{
		this.on('gameStart', this.makeMove);
		
		this.on('aftermove', function()
		{
			if (!this.isEnd())
			{
				this.makeClickable();					
				this.updateTurnLabel();
			}
		});
		
		this.on('gameEnd', function()
		{
			if(this.showScore) 
			{
				this.updateScoreLabels();
			}
			
			this.mask.show();
		});		
		
		this.playagain.on('click', function()
		{
			if(this.alternateTurn)
			{			
				this.toggleStartTurn();
			}
			
			this.mask.hide();
			this.startGame();
			
		}, this);	
		
		this.menuBtn.on('click', function()
		{
			if(this.menu.isVisible())
			{
				this.menu.hide(); 
			}
			else
			{
				this.menu.show(); 
			}
			
		}, this);		
		
		this.play.on('click', function()
		{
			this.menu.hide(); 
			this.initPlayers(); 
			
			if(this.showTbar) 
			{
				this.redrawTbar();
			}
			
			this.startGame();
			
		}, this);
		
		this.multiCheck.on('click', function(){this.multiplayer = this.multiCheck.dom.checked;}, this);
		this.alternateCheck.on('click', function(){this.alternateTurn = this.alternateCheck.dom.checked;}, this);
	},
	
	/**
	 * Updates all labels in the top toolbar.
	 */
	redrawTbar: function()
	{
		if(this.showScore)
		{
			this.p1ScoreLabel.parent().set({cls: this.p1.iconCls});
			this.p2ScoreLabel.parent().set({cls: this.p2.iconCls});
			this.drawScoreLabel.parent().set({cls: this.draw.iconCls});
		}
		
		if(this.showTurn)
		{
			this.p1TurnLabel.first().dom.innerHTML = this.p1.name;
			this.p2TurnLabel.first().dom.innerHTML = this.p2.name;
		}
	},
		
	// private
	// Implements a player move.	
	makeMove: function(target)
	{			
		this.fireEvent('beforemove');
		
		if (this.multiplayer || (!this.multiplayer && this.turn == 1))
		{
			if (target === undefined) {return;}
			
			this.selectBox(target);
			
			this.checkGameStatus();	
			
			if (this.isEnd()) {return;}
			
			this.toggleTurn();
		}
		
		this.fireEvent('move');	
		
		if (!this.multiplayer && this.turn == 2)
		{
			var index = this.getPcMove();
			this.selectBox(index);
			
			this.checkGameStatus();	
			
			if (this.isEnd()) {return;}
			
			this.toggleTurn();
		}		
		
		this.fireEvent('aftermove');
	},
	
	/**
	 * Starts a new game.
	 */
	startGame: function()
	{			
		this.boxStatus = [0,0,0,0,0,0,0,0,0];
		this.cleanTable();
		
		this.currentWinner = null;
		
		this.turn = this.startTurn;
		this.updateTurnLabel();
		
		this.makeClickable();
		
		this.fireEvent('gameStart');
	},
	
	/**
	 * Updates all score labels in the top toolbar.
	 */
	updateScoreLabels: function()
	{
		this.p1ScoreLabel.dom.innerHTML = this.p1.score.toString();
		this.p2ScoreLabel.dom.innerHTML = this.p2.score.toString();
		this.drawScoreLabel.dom.innerHTML = this.draw.score.toString();
		
		if (this.currentWinner === 0)
		{
			this.maskMsg.dom.innerHTML = "Game Drawn";
		}
		else if (this.currentWinner==1)
		{
			this.maskMsg.dom.innerHTML = this.p1.name + " Wins!";
		}
		else if (this.currentWinner==2)
		{
			this.maskMsg.dom.innerHTML = this.p2.name + " Wins!";
		}
	},
	
	/**
	 * Updates the current turn label in the top toolbar.
	 */
	updateTurnLabel: function()
	{
		if (this.turn == 1)
		{			
			if (this.showTurn)
			{
				this.p2TurnLabel.hide();
				this.p1TurnLabel.show();				
			}
		}
		else if (this.turn == 2)
		{
			if (this.showTurn)
			{
				this.p1TurnLabel.hide();
				this.p2TurnLabel.show();				
			}
		}		
	},
	
	/**
	 * Makes all empty box clickable, with the hover effect of the player who has the turn.
	 */
	makeClickable: function()
	{
		for(var i=0; i<this.boxStatus.length; i++)
		{
			if (this.boxStatus[i] === 0)
			{
				if(this.boxes[i].child('.clickable'))
				{
					this.boxes[i].child('.clickable').remove();
				}
				
				Ext.DomHelper.append(this.boxes[i], {tag:'div', cls:'clickable clickable-' + this.getShapeCls()});
				this.boxes[i].on('click', function(ev, t){this.makeMove(t);}, this);
			}
		}
	},
	
	/**
	 * Makes all empty boxes unclickable.
	 */
	makeUnClickable: function()
	{
		for(var i=0; i<this.boxStatus.length; i++)
		{
			if (this.boxStatus[i] === 0)
			{
				if(this.boxes[i].child('.clickable'))
				{
					this.boxes[i].child('.clickable').remove();				
				}
			}
		}
	},
	
	/**
	 * Resets all boxes to blank.
	 */
	cleanTable: function()
	{
		for(var i=0; i<this.boxStatus.length; i++)
		{
			this.boxes[i].removeClass(this.p1.shapeCls);
			this.boxes[i].removeClass(this.p2.shapeCls);
		}
	},
	
	/**
	 * Returns the css class name for the shape of the current player
	 * @return {String} Class name or null;
	 */
	getShapeCls: function()
	{
		if (this.turn == 1)
		{
			return this.p1.shapeCls;
		}
		else if (this.turn == 2) 
		{
			return this.p2.shapeCls;
		}
		
		return null;		
	},
	
	/**
	 * Performs the basic function of performing the box selection when a user selects it. Fires the beforeselectbox and afterselectbox events.
	 * @param {Number} target Box index
	 */
	selectBox: function(target)
	{
		this.fireEvent('beforeselectbox');
		
		var index;
		
		if (isNaN(target))
		{			
			index = Ext.get(target).parent().getAttribute('id')[3];
		}
		else
		{
			index = target;
		}
				
		this.boxStatus[index] = this.turn;
		this.boxes[index].child('.clickable').remove();		
		this.boxes[index].addClass(this.getShapeCls());
		
		this.boxes[index].removeAllListeners();
		
		this.fireEvent('afterselectbox');
	},
	
	/**
	 * Swtiches the player turn from one player to another.
	 */
	toggleTurn: function()
	{
		if (this.turn == 1)
		{
			this.turn = 2;
		}
		else if (this.turn == 2)
		{
			this.turn = 1;
		}		
	},
	
	/**
	 * Toggles the player taking the first turn when the game starts.
	 */
	toggleStartTurn: function()
	{
		if (this.startTurn == 1)
		{
			this.startTurn = 2;
		}
		else if (this.startTurn == 2)
		{
			this.startTurn = 1;			
		}		
	},
	
	/**
	 * Checks the status of the game in a given point in time.
	 * In case any player has won or the game has resulted in a draw, 
	 * the currenWinner property is set, scores incremented and 'gameEnd' event is fired.
	 */
	checkGameStatus: function()
	{
		if (this.isWinner(1))
		{
			this.currentWinner = 1;
			this.p1.score++;
			this.fireEvent('gameEnd');
		}
		else if (this.isWinner(2))
		{
			this.currentWinner = 2;
			this.p2.score++;
			this.fireEvent('gameEnd');
		}
		else if (this.isEnd())
		{
			this.currentWinner = 0;
			this.draw.score++;
			this.fireEvent('gameEnd');
		}
	},
	
	/**
	 * Checks if a specific player has won the game, at a given point in time.
	 * @param {Number} player Usually 1 or 2
	 * @return {Boolean} 
	 */	
	isWinner: function(player)
	{
		if 	(((this.boxStatus[0]==player)&&(this.boxStatus[1]==player)&&(this.boxStatus[2]==player))||
			((this.boxStatus[3]==player)&&(this.boxStatus[4]==player)&&(this.boxStatus[5]==player))||
			((this.boxStatus[6]==player)&&(this.boxStatus[7]==player)&&(this.boxStatus[8]==player))||
			((this.boxStatus[0]==player)&&(this.boxStatus[3]==player)&&(this.boxStatus[6]==player))||
			((this.boxStatus[1]==player)&&(this.boxStatus[4]==player)&&(this.boxStatus[7]==player))||
			((this.boxStatus[2]==player)&&(this.boxStatus[5]==player)&&(this.boxStatus[8]==player))||
			((this.boxStatus[0]==player)&&(this.boxStatus[4]==player)&&(this.boxStatus[8]==player))||
			((this.boxStatus[2]==player)&&(this.boxStatus[4]==player)&&(this.boxStatus[6]==player)))
		{
				return true;				
		}
		
		return false;		
	},
	
	/**
	 * Checks if the game has ended.
	 * @return {Boolean} 
	 */
	isEnd: function()
	{
		if (this.isWinner(1) || this.isWinner(2)) {return true;}
		
		for(var i=0; i<this.boxStatus.length; i++)
		{
			if (this.boxStatus[i] === 0) {return false;}
		}
		
		return true;
	},
		
	/**
	 * Calculates the the next pc move.
	 * @return {Number} Box index 
	 */
	getPcMove: function()
	{		
		if (this.turn==1 || this.multiplayer) {return;}
		
		var index;
		
		// If computer wins by this move		
		for(var i=0; i<this.boxStatus.length; i++)
		{
			if (this.boxStatus[i] === 0)
			{
				this.boxStatus[i] = 2;
				if (this.isWinner(2))
				{
					this.boxStatus[i] = 0;
					return i;
				}
				this.boxStatus[i] = 0;
			}
		}
		
		// If p1 wins by this move
		for(i=0; i<this.boxStatus.length; i++)
		{
			if (this.boxStatus[i] === 0)
			{				
				this.boxStatus[i]=1;
				if (this.isWinner(1))
				{
					this.boxStatus[i]=0;
					return i;
				}
				this.boxStatus[i]=0;
			}
		}
				
		// Choose a box randomly
		if (index === undefined)
		{			
			while (1)
			{
				var randomnumber = Math.floor(Math.random()*9);
				
				if (this.boxStatus[randomnumber]===0) {return randomnumber;}
			}
		}
	}
});
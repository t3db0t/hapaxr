// Hapaxr js

var MAXPLAYERS = 4;
var FAKEMODE = true;
var FAKESCORE = 0;

var numplayers = 4;
var usequotes = true;
var searchinput;
var currentPlayer = 0;

var p1g, p2g, p3g, p4g;

var scores = [0,0,0,0];

function bodyKeyPress(e, t){
	// console.log(e);
	if(e.charCode == 13){
		// submit
		go();
	}
}

function addPlayerName(){
	numplayers++;
	var nameInputTemplate = 'Player '+numplayers+' Name: <input type="text" id="p'+numplayers+'name"></input><br>';
	$('#playerNameInputs').append(nameInputTemplate);
	if(numplayers >= MAXPLAYERS){
		$('#addPlayerLink').hide();
	}
}

function myjsonpfunction(data){
	console.log(data);//.resultCount);
    //console.log(data.responseData.cursor.resultCount);//.resultCount);
	numresults = 0;
	//if(data.responseData.results.length != 0){
	numresults = parseInt(data.searchInformation.totalResults);
	if(isNaN(numresults)){
		alert("numresults NaN???");
		console.log("numresults NaN???");
	}
	//}
	$('#numresults').html(numresults);

	pd = [];
	pd[0] = {
		guess: p1g,
		tf: $('#player1guess'),
		color:"white"
	}
	pd[1] = {
		guess: p2g,
		tf: $('#player2guess'),
		color:"white"
	}
	pd[2] = {
		guess: p3g,
		tf: $('#player3guess'),
		color:"white"
	}
	pd[3] = {
		guess: p4g,
		tf: $('#player4guess'),
		color:"white"
	}

	// DETERMINE POINTS
	if(numresults == 0){
		// subtract a point from the Phraser
		scores[currentPlayer]--;
		updateScores();
		pd[currentPlayer].color = "red";
	}

	var winner;
	var maxval = 0;
	for(var i=0; i < numplayers; i++){
		console.log(pd[i].guess, maxval, numresults);
		if(pd[i].guess >= maxval && numresults - pd[i].guess >= 0){
			maxval = pd[i].guess;
			winner = pd[i];
			scores[i]++;
			updateScores();
		}
	}
	if(typeof winner != 'undefined'){
		// no winner = 0 results but no correct guesser
		winner.tf.css("background-color","lightgreen");
		winner.color = "lightgreen";
	}

	// Obscurity bonus
	if(numresults < 10 && numresults > 0){
		scores[currentPlayer]++;
		updateScores();
		pd[currentPlayer].cssString += "border:2px gold solid;";
	}

	// generate history
	var bleh = '<div id="guess_printout">\
				<div id="result_number">\
					<h3>'+numresults+'</h3>\
				</div>\
				<div id="search_term">\
					<p>"'+searchinput+'"</p>\
				</div>\
				<div id="player1" class="resultRecord">\
					<h3 style="background-color:'+pd[0].color+';">'+pd[0].guess+'</h3>\
				</div>\
				<div id="player2" class="resultRecord">\
					<h3 style="background-color:'+pd[1].color+'">'+pd[1].guess+'</h3>\
				</div>\
				<div id="player3" class="resultRecord">\
					<h3 style="background-color:'+pd[2].color+'">'+pd[2].guess+'</h3>\
				</div>\
				<div id="player4" class="resultRecord">\
					<h3 style="background-color:'+pd[3].color+'">'+pd[3].guess+'</h3>\
				</div>\
				</div>';
 	$('#right_column').prepend(bleh);
}

function updateScores(){
	$('#p1score').html(scores[0]);
	$('#p2score').html(scores[1]);
	$('#p3score').html(scores[2]);
	$('#p4score').html(scores[3]);
}

function setCurrentPlayer(which, last){
	$('#p'+(last+1)+'name').css('border','2px transparent solid');
	$('#p'+(which+1)+'name').css('border','2px blue solid');
}

function go(){
	// reset stuff
	$('#player1guess').css("background-color","white");
	$('#player2guess').css("background-color","white");
	$('#player3guess').css("background-color","white");
	$('#player4guess').css("background-color","white");
	$('#errormessage').html("");

	searchinput = $('#searchboxinput').val().trim().replace(/"/g,"");
	$('#searchboxinput').val(searchinput);
	if(searchinput.split(" ").length != 2){
		$('#errormessage').html("Phrase must be two words");
		return;
	}

	p1g = parseInt($('#player1guess').val().trim());
	p2g = parseInt($('#player2guess').val().trim());
	p3g = parseInt($('#player3guess').val().trim());
	p4g = parseInt($('#player4guess').val().trim());
	// console.log(p1g, p2g, p3g, p4g);

	if(!isNaN(p1g) &&
	   !isNaN(p2g) &&
	   !isNaN(p3g)){
		search(searchinput);
	} else {
		$('#errormessage').html("All players must make guesses");
		return;
	}

	// advance to next player
	lastPlayer = currentPlayer;
	currentPlayer++;
	if(currentPlayer >= numplayers){
		currentPlayer = 0;
	}
	setCurrentPlayer(currentPlayer, lastPlayer);
}

function search(what){
	if($('#usequotesCB').prop('checked')){
		what = "%22" + what + "%22";
	}
	if(FAKEMODE){
		fakeresults = {
			searchInformation: {
				totalResults: FAKESCORE
			}
		}
		myjsonpfunction(fakeresults);
	} else {
	    $.ajax({
	        //url: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q='+what+'&callback=myjsonpfunction',
	        url: 'https://www.googleapis.com/customsearch/v1?q='+what+'&cx=007060078685401029577%3A_x7ctz8mxko&key=AIzaSyDiVPvHjm4GAR_mwgumfjJ7N5Kj9BJHXlI&callback=myjsonpfunction&rsz=8',
		    type:"GET",
		    dataType: 'jsonp',
		    jsonp: 'myjsonpfunction',
		    async:'true',
		    success:function (data) {
		    	//alert("success");
		    }
	    });
	}
}

$(function(){
	// init
	$('#usequotesCB').prop('checked',true);

	// $.fn.editable.defaults.mode = 'inline';
	$('#p1name').editable({
	    type: 'text',
	    title: 'Player 1 Name',
	    success: function(response, newValue) {
	        $('#p1name').html(newValue);
	    }
	});

	$('#p2name').editable({
	    type: 'text',
	    title: 'Player 2 Name',
	    success: function(response, newValue) {
	        $('#p2name').html(newValue);
	    }
	});

	$('#p3name').editable({
	    type: 'text',
	    title: 'Player 3 Name',
	    success: function(response, newValue) {
	        $('#p3name').html(newValue);
	    }
	});

	$('#p4name').editable({
	    type: 'text',
	    title: 'Player 4 Name',
	    success: function(response, newValue) {
	        $('#p4name').html(newValue);
	    }
	});

	// start game
	setCurrentPlayer(0, 0);
});
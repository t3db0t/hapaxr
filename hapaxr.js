// Hapaxr js

var NUMPLAYERS = 3;
var usequotes = true;
var searchinput;

var p1g, p2g, p3g;

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

	// DETERMINE POINTS
	var winner;
	var maxval = 0;
	for(var i=0; i < NUMPLAYERS; i++){
		if(pd[i].guess > maxval && numresults - pd[i].guess >= 0){
			maxval = pd[i].guess;
			winner = pd[i];
		}
	}
	winner.tf.css("background-color","lightgreen");
	winner.color = "lightgreen";

	// generate history
	var bleh = '<div id="guess_printout">\
 						<div id="result_number">\
 							<h3>'+numresults+'</h3>\
 						</div>\
 						<div id="search_term">\
 							<p>"'+searchinput+'"</p>\
 						</div>\
 						<div id="player1">\
 							<h3 style="background-color:'+pd[0].color+'">'+pd[0].guess+'</h3>\
 						</div>\
 						<div id="player2">\
 							<h3 style="background-color:'+pd[1].color+'">'+pd[1].guess+'</h3>\
 						</div>\
 						<div id="player3">\
 							<h3 style="background-color:'+pd[2].color+'">'+pd[2].guess+'</h3>\
 						</div>\
 					</div>';
 	$('#right_column').append(bleh);
}

function go(){
	// reset stuff
	$('#player1guess').css("background-color","white");
	$('#player2guess').css("background-color","white");
	$('#player3guess').css("background-color","white");

	searchinput = $('#searchboxinput').val().trim().replace(/"/g,"");
	$('#searchboxinput').val(searchinput);
	if(searchinput.split(" ").length != 2){
		$('#numresults').html("Phrase must be two words");
		return;
	}

	p1g = parseInt($('#player1guess').val().trim());
	p2g = parseInt($('#player2guess').val().trim());
	p3g = parseInt($('#player3guess').val().trim());
	console.log(p1g, p2g, p3g);

	if(!isNaN(p1g) &&
	   !isNaN(p2g) &&
	   !isNaN(p3g)){
		search(searchinput);
	} else {
		$('#numresults').html("All players must make guesses");
	}
	
}

function search(what){
	if($('#usequotesCB').prop('checked')){
		what = "%22" + what + "%22";
	}
    $.ajax({
        //url: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q='+what+'&callback=myjsonpfunction',
        url: 'https://www.googleapis.com/customsearch/v1?q='+what+'&cx=007060078685401029577%3A_x7ctz8mxko&key=AIzaSyDiVPvHjm4GAR_mwgumfjJ7N5Kj9BJHXlI&callback=myjsonpfunction',
	    type:"GET",
	    dataType: 'jsonp',
	    jsonp: 'myjsonpfunction',
	    async:'true',
	    success:function (data) {
	    	//alert("success");
	    }
    });
}

$(function(){
	// init
	$('#usequotesCB').prop('checked',true)
});
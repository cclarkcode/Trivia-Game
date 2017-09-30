var clockID;
var sounds = {
	right: new Audio("assets/sounds/right.mp3"),
	wrong: new Audio("assets/sounds/wrong.mp3"),
	clocktick: new Audio('assets/sounds/tick.mp3'),
	endclock: new Audio('assets/sounds/endclock.mp3'),
	buzzer: new Audio('assets/sounds/buzzer.mp3')
}
var game = {
	countdowntimer: 15,
	rightcounter: 0,
	wrongcounter: 0,
	unansweredcounter: 0,
	questioncounter: 0,
	counton: false,
	questionindex: 0,
	nextquestionindex: 0,
	rightindex: 0,
	answers: [],
	movielist: ["The Matrix","The Lion King","Inception","Good Will Hunting","Million Dollar Baby","Avatar","The Godfather","Toy Story","American Beauty"
	,"Twins","The Fast And The Furious","Jurassic Park","Full Metal Jacket","As Good As It Gets","Training Day","Moana","The Shawshank Redemption"
	,"Eternal Sunshine of the Spotless Mind","Die Hard","Trainspotting","Top Gun","Rain Man","GoldenEye","Passengers","Goodfellas"],
	gifindexarray: [],
	movies: [],
	nextmovies: [],
		
	callmovies: function() {

		//Pre calls movie(s) necessary for next question to avoid API delay issues
		//Determine question to determine number of API calls
		

		game.nextquestionindex = Math.floor(Math.random()*game.question.length);
		// game.nextquestionindex = 1;
		
		game.nextmovies = [];

	
		var moviecheck = []
		// Run movie call for as many times as necessary (determined by apicalls in question object array)
		// console.log("API calls: " + game.question[game.nextquestionindex].apicalls);
		for (var i = 0; i < game.question[game.nextquestionindex].apicalls; i++) {

			// alert("Index: " + i + "   Limit: " + game.question[game.nextquestionindex].apicalls);

			var movieindex = Math.floor(Math.random()*game.movielist.length);
			// var movieindex = 16;
			
			if (moviecheck.length > 0) {
				//Verify movie hasn't already been used to avoid duplicate calls
				for (var j = 0; j < moviecheck.length; j++) {
					if (movieindex === moviecheck[j]) {
						// Regenerate movie if duplicate found and reset for loop
						
						movieindex = Math.floor(Math.random()*game.movielist.length);
						j=-1;
					}
				}
			}

			moviecheck.push(movieindex);

			var queryURL = "https://www.omdbapi.com/?t=" + game.movielist[movieindex] + "&y=&plot=short&apikey=40e9cece";

			$.ajax({
				url: queryURL,
				method: "GET"
				}).done(function(response){

					game.nextmovies.push(response);

				}).fail(function(err) {
  					throw err;
				});
			
		}

		
	},
	start: function() {

		$(".start").remove();
		
		game.rightcounter=0;
		game.wrongcounter=0;
		game.unansweredcounter=0;
		game.questionindex=0;
		game.questioncounter=0;
		

		game.displayquestion();
		

	},

	displayquestion: function() {

		//Move pre-called movies from API into current movies so that next question can be called in advance
		game.movies = game.nextmovies;
		game.questionindex=game.nextquestionindex;
		console.log(game.movies);

		//Pre-calls next set of movies
		game.callmovies();

		clockID = setInterval(game.clock,1000);



		var questiontext = game.question[game.questionindex].generateQ();
		console.log(questiontext);
		game.answers= [];
		game.question[game.questionindex].generateA();
		
		console.log(game.answers);
		console.log("Answer: " + game.rightindex);
		game.answers = game.randanswer(game.answers);
		console.log(game.answers);
		console.log("Answer: " + game.rightindex);
		$(".game-container").children().remove();

		
		game.countdowntimer = 15;
		var timer = $("<div/>");
		var timespan = $("<span/>");
		timespan.html(game.countdowntimer).attr("id","timer");
		timer.html("Time Remaining: ").append(timespan).append(" Seconds");
		timer.css("display","block");
		$(".game-container").html(timer);
		timer.css("margin","10px 0 35px 0");
		timer.attr("id","clock");

		var ques = $("<div class='question'/>");
		ques.html(questiontext);
		ques.css("display","block");
		$(".game-container").append(ques);
		$(".question").css("margin","15px");

		//Add movie poster unless question is about actors
		if (game.questionindex !==2 && game.questionindex !==3) {
			var poster = $("<img class='poster'/>");
			poster.attr("src",game.movies[0].Poster).attr("alt","poster");
			$(".game-container").append(poster);
			poster.css("float","left").css("padding","0 50px").css("height","300px").css("width","auto");
		}
			

		var answers = $("<div/>");
		
		var smallarray = []
		for (var i = 0; i < 4; i++) {
			answers.append("<div class='answer click' id=" + i + ">" + game.answers[i] + "</div>");
			
			if (game.answers[i].length > 20) {
				smallarray.push(i);
				
			}
			
		}
		
		$(".game-container").append(answers);
		$(".answer").css("width","450px").css("padding","10px").css("cursor","pointer").css("margin","auto").css("border","thick hidden blue");
				
		if (smallarray.length > 0 ) {
			
		for (var i = 0; i < smallarray.length; i++) {
			$("#" + smallarray[i]).css("font-size","20px");
			
		}
	}

	},

	checkanswer: function(answerid) {

		console.log("Answerid: " + answerid + " -- game.rightindex: " + game.rightindex);

		clearInterval(clockID);


		sounds.endclock.pause();
		sounds.endclock.load();

		$(".poster").remove();

		if (parseInt(answerid) === game.rightindex) {

			//Right answer protocol
			$(".question").html("Correct!");
			game.rightcounter++;
			$(".answer").remove();
			$(".game-container").append("<div class='imggif'><img src='assets/images/goodjob.gif' alt=''></div>");
			sounds.right.play();
			
		}
		else {

			//Wrong answer protocol
			$(".question").html("Nope!");
			game.wrongcounter++;
			$(".answer").remove();
			$(".game-container").append("<div> The correct answer was " + game.answers[game.rightindex] + ".</div>");
			$(".game-container").append("<div class='imggif'><img src='assets/images/sad.gif' alt=''></div>");
			sounds.wrong.play();
			
		}
		
		//Determine whether game is over 
		game.questioncounter++;
		if (game.questioncounter < 10) {
			setTimeout(game.displayquestion, 3000);
		}
		else {
			setTimeout(game.end, 3000);
		}
	},

	end: function() {

		$(".game-container").empty();

		//Display summary and create start over button
		

		var summary = $("<div/>");

		summary.append("<div>All Done!</div>");

		summary.append("<div>Correct Answers: " + game.rightcounter + "</div>");
		summary.append("<div>Wrong Answers: " + game.wrongcounter + "</div>");
		summary.append("<div>Unanswered: " + game.unansweredcounter + "</div>");
		summary.append("<div class='restart click'>Start Over?</div>");
		
		$(".game-container").append(summary);
		$(".restart").css("width","250px").css("margin","50px auto");




	},

	clock: function() {

		game.countdowntimer--;
		if (game.countdowntimer > 5 ) {
			sounds.clocktick.play();
		}
		else if (game.countdowntimer === 5) {
			sounds.endclock.play();
			$("#clock").css("color","red");
		}
		$("#timer").html(game.countdowntimer)
		if(game.countdowntimer === 0){
			
			sounds.endclock.pause();
			sounds.endclock.load();
			sounds.buzzer.play();
			clearInterval(clockID);
			game.timeup();
		}

		$(".answer").on("click",function(){

			sounds.endclock.pause();
			sounds.endclock.load();
		});


	},
	timeup: function(){


			//Wrong answer protocol
			$(".poster").remove();
			$(".question").html("Time's up!");
			game.unansweredcounter++;
			$(".answer").remove();
			$(".game-container").append("<div> The correct answer was " + game.answers[game.rightindex] + ".</div>");
			$(".game-container").append("<div class='imggif'><img src='assets/images/sad.gif' alt=''></div>");

			game.questioncounter++;
			if (game.questioncounter < 10) {
				setTimeout(game.displayquestion, 3000);
			}
			else {
				setTimeout(game.end, 3000);
			}
				


	},

	//Takes an array of question answers with the correct answer as the first element
	// and returns a randomized array while updating the index to the correct answer
	randanswer: function (startarray) {

		var newarray = [];

		//Boolean used to determine if right answer index should be updated
		var alreadypushed = false;

		while (startarray.length > 0) {

			//Choose random element within answer array
			var index = Math.floor(Math.random()*startarray.length);

			//If random chosen element is the right answer (first item in original array) then define game.rightindex 
			if (index === 0 && !alreadypushed) {
				
				alreadypushed=true;
				game.rightindex=newarray.length;
				// console.log("Pushed answer to " + game.rightindex);
			}

			//Push chosen element into new array
			newarray.push(startarray[index]);
			startarray.splice(index, 1);

		}


			return newarray;

	},

	duplicate: function(answer,answerarray) {

		for (var i = 0; i < answerarray.length; i++) {
			if (answerarray[i] === answer) { return true;}
		}

		return false;



	},

	//An array of dynamic questions the application can create from the movie API. Lists number of apicalls so that those calls can be performed 
	// in advance to assist performance. genereateQ returns question text. generateA returns an array with 4 answers, the correct answer will always
	// be the first element (gets randomized later)
	question: [{
		name: "Release Date",
		apicalls: 1,
		generateQ: function() {

			//Generate code goes here
			return "What year was " + game.movies[0].Title + " released?";
		},
		generateA: function() {

			var year = parseInt(game.movies[0].Released.substring(game.movies[0].Released.length-4));

			for (var i = 0; i < 4; i++) {

				if (i===0) {
					//Add correct answer to array
					game.answers.push(year);
				}
				else {
					//Generate random incorrect answer +/- 5 years from correct answer, ensure not a duplicate
					do {

						do {

						var wrongyear = Math.floor(Math.random()*11)+(year-5);
						}
						while (wrongyear>2017);
						var runagain = game.duplicate(wrongyear,game.answers);
					}
					while (runagain)
					
					game.answers.push(wrongyear);
				}
				
			}

		}

	},
	{
		name: "Director",
		apicalls: 4,
		generateQ: function() {

			//Generate code goes here
			return "Who directed " + game.movies[0].Title + "?";
		},
		generateA: function(right) {

			//No need to check for duplicates, no two movies made by same director
			for (var i = 0; i < 4; i++) {
				
					game.answers.push(game.movies[i].Director);
			
				}

			}
	},
	{
		name: "actor",
		apicalls: 4,
		generateQ: function() {

			return "Who starred in " + game.movies[0].Title + "?";

		},
		generateA: function(right) {

				// Store array of actors in question movie for comparison
				var correctactorlist = game.movies[0].Actors.split(",");

			
			for (var i = 0; i < 4; i++) {
					
					var actorlist = game.movies[i].Actors.split(",");
					var newactor = actorlist[Math.floor(Math.random()*actorlist.length)].trim();

					if (i>0) {

					// Check to make sure actor from different movie is not also in correct movie
					for (var j = 0; j < correctactorlist.length; j++) {
						if (newactor === correctactorlist[j]) {
							newactor = actorlist[Math.floor(Math.random()*actorlist.length)].trim();
							j=-1;

						}
					}

					// Check for duplicates
					do {

						newactor = actorlist[Math.floor(Math.random()*actorlist.length)].trim();
					
						var runagain = game.duplicate(newactor,game.answers);
					}
					while (runagain)

					}
			
				game.answers.push(newactor);
			}

			

		}
	},
	{
		name: "notactor",
		apicalls: 2,
		generateQ: function () {
			return "Which actor was NOT in " + game.movies[0].Title + "?";

		},
		generateA: function () {

			var actorlist = game.movies[0].Actors.split(",");
			console.log(actorlist);
			//Pulls three actors from the movie (i.e. the wrong answers)
			for (var i = 0; i < 3; i++) {

				var actor = actorlist[Math.floor(Math.random()*actorlist.length)].trim();


				if (i>0) {

					do {

						actor = actorlist[Math.floor(Math.random()*actorlist.length)].trim();
		
						var runagain = game.duplicate(actor,game.answers);
					}
					while (runagain)
				}
				console.log ("*" + actor + "*");
				game.answers.push(actor);
				
			}

			
			//Pulls new actor from next movie (i.e. the right answer)
			var newactorlist =  game.movies[1].Actors.split(",");

			actor = newactorlist[Math.floor(Math.random()*newactorlist.length)].trim();

			//Confirms actor was NOT in original movie

			for (var i = 0; i < game.movies[0].Actors.length; i++) {

				if (actor === game.movies[0].Actors[i]) {
					actor = newactorlist[Math.floor(Math.random()*newactorlist.length)].trim();
					i=-1;
				}
				
			}

			//Inputs right answer as first element in array
			game.answers.splice(0,0,actor);


		}
	},
	{
		name: "rating",
		apicalls: 1,
		generateQ: function() {
			return "What was " + game.movies[0].Title + " rated?";
		},
		generateA: function() {

			game.answers = ["G","PG","PG-13","R"];
			var rating = game.movies[0].Rated.trim();

			for (var i = 0; i < game.answers.length; i++) {
				if (game.answers[i] === rating) {
					//Remove correct answer so that it can be reinserted at beginning of array
					console.log("Correct answer removed");
					game.answers.splice(i,1);
				}
			}

			game.answers.splice(0,0,rating);
		}



	},
	{
		name: "howlong",
		apicalls: 1,
		generateQ: function() {
			return "How long was " + game.movies[0].Title + "?";
		},
		generateA: function() {

			var runtime = parseInt(game.movies[0].Runtime.substring(0,game.movies[0].Runtime.indexOf("min")-1));
			console.log(runtime);

			for (var i = 0; i < 4; i++) {

				if (i===0) {
					//Add correct answer to array
					game.answers.push(runtime + " minutes");
				}
				else {
					//Generate random incorrect answer +/- 5 years from correct answer, ensure not a duplicate
					var wrongtime = Math.floor(Math.random()*41)+(runtime-20) + " minutes";
					
						do {

						var wrongtime = Math.floor(Math.random()*41)+(runtime-20) + " minutes";
		
						var runagain = game.duplicate(wrongtime,game.answers);
					}
					while (runagain)
					
					game.answers.push(wrongtime);
				}
				
			}

		}


	},
	{
		name: "oscar",
		apicalls: 1,
		win: false,
		awardstring: "",
		generateQ: function () {

			//Determine whether movie won an oscar
			this.awardstring = game.movies[0].Awards;
			if (this.awardstring.indexOf("Oscar") >= 0 && this.awardstring.indexOf("Won") !== -1) {
				this.win=true;
			}
			else {
				
				// Even if movie didn't win any oscars, give 1/3 chance of asking how many it won anyway so that user can't know answer won't be zero
				if(Math.random() < .34) {
					this.win=true;
					console.log("Ask win anyway");
				}
			}

			if (this.win) {
				return "How many Oscars did " + game.movies[0].Title + " win?";
			}
			else {
				return "How many Oscars was " + game.movies[0].Title + " nominated for?";
			}

		},
		generateA: function () {

			var awards = 0;

			if (this.win) {
				if (this.awardstring.indexOf("Oscar") >= 0 && this.awardstring.indexOf("Won") !== -1) {
					awards = parseInt(this.awardstring.substring(3,6).trim());
				}
			} 
			else {
				if (this.awardstring.indexOf("Oscar") >= 0 && this.awardstring.indexOf("Nominated" === 0)) {
					//Get number of nominations from award string. Substring starts at 13 to cut out "Nominated for"
					awards = parseInt(this.awardstring.substring(13,16).trim());
					
					
				}
			}

			//Push right answer to answer array
			game.answers.push(awards);

			for (var i = 0; i < 3; i++) {

				var wronganswer=0;
				var push = true;
				//Apply different logic to scope of wrong answers depending on initial value
				// If correct answer is zero, all wrong answers should be between 1 and 5, if correct answer less than 3, all answers between 0 and 7
				// If correct answer > 3, all answers between 0 and correct answer + 4
				if (awards === 0) {
					wronganswer = Math.floor(Math.random()*4)+1;
				}
				else if (awards <= 3) {
					wronganswer = Math.floor(Math.random()*8);
				}
				else {
					wronganswer = Math.floor(Math.random() * (awards+4));
				}

				for (var j = 0; j < game.answers.length; j++) {
					if (wronganswer === game.answers[j]) {
						//If answer is already in array, don't push and reset outer for loop
						push=false;
						i--;
					}
				}

				if (push) {
					game.answers.push(wronganswer);
				}

		}
	}

}] //end of question object array

} //end of game object

$(document).ready (function() {

	game.callmovies();
	// moviecheck();
});

$(".start").on("click", function(){

	game.start();
})

//Create button visual effect on mouseover of answers
$(".game-container").on("mouseenter",".click", function() {
	$(this).css("background","#bebebe").css("border","thick solid blue");

});


// Remove visual effect above
$(".game-container").on("mouseleave",".click", function() {
	$(this).css("background","").css("border","thick hidden blue");

});

$(".game-container").on("click",".answer", function(){

	game.checkanswer(this.id);

});

$(".game-container").on("click",".restart", function(){

	game.start();
})

//Not a part of the game, just a useful function for checking movie data
function moviecheck() {

	console.log(game.movielist.length);

	for (var i = 0; i < game.movielist.length; i++) {
		var queryURL = "https://www.omdbapi.com/?t=" + game.movielist[i] + "&y=&plot=short&apikey=40e9cece";

			$.ajax({
				url: queryURL,
				method: "GET"
				}).done(function(response){

					game.nextmovies.push(response);
					console.log(game.nextmovies);

				});
	}
}
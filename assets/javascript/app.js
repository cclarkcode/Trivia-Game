var game = {
	countdowntimer: 30,
	rightcounter: 0,
	wrongcounter: 0,
	unansweredcounter: 0,
	counton: false,
	questionindex: 0,
	rightindex: 0,
	questions: [{
		number: 1,
		question: "If 3x-5 = 7, what is x?",
		right: "4",
		wrong: ["2","5","1"]
	},
	{
		number: 2,
		question: "What is the square root of 49?",
		right: "7",
		wrong: ["4","3","9"]
	},
	{
		number: 3,
		question: "What is 3 cubed?",
		right: "27",
		wrong: ["36","81","9"]
	}],

	
	start: function() {

		$(".start").remove();
		game.countdowntimer = 30;
		game.rightcounter=0;
		game.wrongcounter=0;
		game.unansweredcounter=0;
		game.questionindex=0;
		game.counton = true;
		game.displayquestion();

	},
	
	displayquestion: function() {

		$(".game-container").children().remove();

		var timer = $("<div/>");
		var timespan = $("<span/>");
		timespan.html(game.countdowntimer);
		timer.html("Time Remaining: ").append(timespan).append(" Seconds");
		timer.css("display","block");
		$(".game-container").html(timer);
		var ques = $("<div class='question'/>");
		ques.html(game.questions[game.questionindex].question);
		ques.css("display","block");
		$(".game-container").append(ques);

		var answers = $("<div/>");
		game.rightindex = Math.floor(Math.random()*4);
		console.log(game.rightindex);

		for (var i = 0; i < 4; i++) {
			if (i===game.rightindex) {
				answers.append("<div class='answer click' id=" + i + ">" + game.questions[game.questionindex].right + "</div>");
			}
			else if (i<game.rightindex) {
				answers.append("<div class='answer click' id=" + i + ">" + game.questions[game.questionindex].wrong[i] + "</div>");
			}
			else {
				answers.append("<div class='answer click' id=" + i + ">" + game.questions[game.questionindex].wrong[i-1] + "</div>");
			}
		}
		
		$(".game-container").append(answers);
		$(".answer").css("width","350px").css("padding","10px").css("cursor","pointer").css("margin","auto").css("border","thick hidden blue");

	},

	checkanswer: function(answerid) {

		console.log("Answerid: " + answerid + " -- game.rightindex: " + game.rightindex);

		if (parseInt(answerid) === game.rightindex) {

			//Right answer protocol
			$(".question").html("Correct!");
			game.rightcounter++;
			$(".answer").remove();
			$(".game-container").append("<div class='imggif'><img src='assets/images/goodjob.gif' alt=''></div>");
			game.questionindex++;
			if(game.questionindex < game.questions.length) {
				console.log(game.questionindex);
			setTimeout(game.displayquestion, 2000);
			}
			else {
				setTimeout(game.end,2000);
			}
		}
		else {

			//Wrong answer protocol
			$(".question").html("Nope!");
			game.wrongcounter++;
			$(".answer").remove();
			$(".game-container").append("<div> The correct answer was " + game.questions[game.questionindex].right + ".</div>");
			$(".game-container").append("<div class='imggif'><img src='assets/images/sad.gif' alt=''></div>");
			

			game.questionindex++;
			if(game.questionindex < game.questions.length) {
				console.log(game.questionindex);
			setTimeout(game.displayquestion, 2000);
			}
			else {
				setTimeout(game.end,2000);
			}
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



	}

}

$(".start").on("click", function(){

	game.start();
})

$(".game-container").on("mouseenter",".click", function() {
	$(this).css("background","#bebebe").css("border","thick solid blue");

});

$(".game-container").on("mouseleave",".click", function() {
	$(this).css("background","").css("border","thick hidden blue");

});

$(".game-container").on("click",".answer", function(){

	game.checkanswer(this.id);

});

$(".game-container").on("click",".restart", function(){

	game.start();
})



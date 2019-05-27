
//setting up initial function so JS runs after the page has loaded
//final version of even listeners to hide remaining time and start the game
//the .option below is calling a CSS style class, I learned you can manipulate css classes with jquery as well, not only bootstrap.

$(document).ready(function() {

    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);

})

//I set up a trivia object to store all questions, options and answers

var trivia = {
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId: '',
    
    questions: {
        q1: "The Cessna 172 Skyhawk was first produced in what year?",
        q2: "Which aircraft is considered one of the most successful fighter planes in history?",
        q3: "In what year did the Wright brothers flew the first engine-powered airplane?",
        q4: "The Boeing 747's wingspan measures how many feet?",
        q5: "Which plane recorded the highest speeds in history?",
        q6: "How long did it take the supersonic jet, Concorde, to fly from Paris to New York?",
        q7: "Which single-engine aircraft company has sold more planes than any other?"

    },

    options: {
        q1: [ "1956", "1968", "1979"],
        q2: [ "Grumman F-14 Tomcat", "McDonnell Douglas F-4 Phantom II", "McDonnell Douglas F-15 Eagle"],
        q3: [ "1903", "1899", "1895"],
        q4: [ "150 feet", "195 feet", "220 feet"],
        q5: [ "North American X-15", "SR-71 Blackbird", "Bell X-1"],
        q6: ["One and a half hours", "Three and a half hours", "Seven hours"],
        q7: [ "Piper", "Cessna", "Cirrus"]

    },

    answers: {
        q1: "1956",
        q2: "McDonnell Douglas F-15 Eagle",
        q3: "1903",
        q4: "195 feet",
        q5: "North American X-15",
        q6: "Three and a half hours",
        q7: "Cessna"
    
    },

//Setting up function to initialize and reset game

    startGame: function(){

        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);


//After the startGame function runs, I want to display the #game Div section, empty the results Div, show timer, hide start button and trigger the first question:

        $('#game').show();

        $('#results').html('');

        $('#timer').text(trivia.timer);

        $('#start').hide();

        $('#remaining-time').show();

        trivia.nextQuestion();

    },
    
//Setting up method to loop through and display questions with options, also setting up timer to 10 seconds per question.    
    nextQuestion : function() {

        trivia.timer = 10;
        $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);

        if(!trivia.timerOn){
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }

// This gets all the questions and then indexes the current question        
        var questionContent = Object.values(trivia.questions) [trivia.currentSet];
        $('#question').text(questionContent);

//An array of all the guesss options for the current question and then function to append to options class and print them on html

        var questionOptions = Object.values(trivia.options) [trivia.currentSet];

        $.each(questionOptions, function(index, key) {
            $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
        })

    },
//Setting up conditionals  to handle time out event, timer numbers go red when 5 seconds remaining, increment unanswered counter and finally end the game and show results

    timerRunning: function(){
        if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
            $("#timer").text(trivia.timer);
            trivia.timer--;
            if(trivia.timer === 4){
                $('#timer').addClass('last-seconds');
            }
        }

        else if(trivia.timer === -1){
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html("<h3>Out of time! The answer is "+ Object.values(trivia.answers) [trivia.currentSet] +"</h3>");
        }

        else if(trivia.currentSet === Object.keys(trivia.questions).length){

            $('#results')
            .html('<h3> Thanks for playing! </h3>' +
            '<p>Correct: '+ trivia.correct + '</p>' +
            '<p>Wrong: '+ trivia.incorrect + '</p>' +
            '<p>Unanswered: '+ trivia.unanswered + '</p>' +
            '<p>Please play again!</p>');

//When game ends, hide game div and show the start button again

            $('#game').hide();

            $('start').show();
        }
    },
// Declaring a function to evaluate the option clicked
    guessChecker: function() {
        var resultId;
        var currentAnswer = Object.values(trivia.answers) [trivia.currentSet];

//Setting up conditionals, if option clicked on matches the correct answer the increment correct, otherwise increment wrong
        if($(this).text() === currentAnswer){
            $(this).addClass('btn-success').removeClass('btn-info');

            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Correct Answer !</h3>');
        }

        else{
            $(this).addClass('btn-danger').removeClass('btn-info');

            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Better luck next time! ' + currentAnswer + '</h3>');
        }
    },

    //method to remove previous results and options, and begin next question
    guessResult : function() {
        trivia.currentSet++;
        $('.option').remove();
        $('#results h3').remove();
        trivia.nextQuestion();
    }


}
var questions = [];
var current = null;
var score = 0;
var hintsUsed = 0;

function flashScore() {
    var speed = 100;
    for(var i=0; i<3; i++) {
        $('.flash').fadeOut(speed);
        $('.flash').fadeIn(speed);
    }
}

function fadeOutFeedback() {
    $('#feedback').fadeOut(3000, function() {
        // completion function to reset the feedback for next time
        $('#feedback').html('');
        $('#feedback').fadeIn(0);
    });
}

function handleCorrectAnswer() {
    if (hintsUsed == 0) {
        score+=current.answer.length;
    }
    else {
        score+=current.answer.length - hintsUsed + 1;
    }

    updateInterface();
    $('#score').css('color', 'blue');
    flashScore();

    $('#feedback').css('color', 'green');
    $('#feedback').html('Correct!');
    fadeOutFeedback();
    nextQuestion();
}

function handleIncorrectAnswer() {
    $('#feedback').css('color', 'red');
    $('#feedback').html('Wrong answer - try again!');
    fadeOutFeedback();
}

function handleAnswer() {
    var answer = $('#response').val();
    $('#response').val('');
    if (answer.toLowerCase() == current.answer.toLowerCase()) {
        handleCorrectAnswer();
    }
    else {
        handleIncorrectAnswer();
    }
}

function handleNextQuestionAfterPass() {
    nextQuestion();
    $('#submit').show();
    $('#response').show();
    $('#passResponse').html('');
    $('#passButton').show();
    $('#hintButton').show();
    $('#nextQuestionButton').hide();
    $('#passButton').on('click', handlePass);
}

function handlePass() {
    $('#submit').hide();
    $('#response').hide();
    $('#hintButton').hide();
    $('#passResponse').html('The answer is <span style="font-weight: bold;">' + current.answer + '</span>');
    $('#passButton').hide();
    $('#nextQuestionButton').show();

    if(score > 0) {
        score = Math.max(0, score-current.answer.length);
        updateInterface();
        flashScore();
    }
}

function handleHint() {
    var answer = current.answer
    var placeholder = ' _ '.repeat(answer.length);
    if(hintsUsed == answer.length) {
        handlePass();
    }
    else if (hintsUsed > 0) {
        var filledPrefix = answer.slice(0, hintsUsed);
        var remainingPlaceholder = ' _ '.repeat(answer.length - filledPrefix.length);
        placeholder = filledPrefix + remainingPlaceholder;
    }
    $('#hintResponse').html(placeholder);
    hintsUsed++;
}

function nextQuestion() {
    // we don't try to put the next question into 
    // context until we've maybe loaded more questions.
    function nextQuestionDeferred() {
        current = questions.shift();
        hintsUsed = 0;
        $('#question').html(current.clue)
        $('#answer').html('');
        hintsUsed = 2;
        handleHint();
    }
    if(questions.length == 0) {
        loadQuestions(nextQuestionDeferred);
    }
    else {
        nextQuestionDeferred();
    }
}

function setupInterface() {
    $('#submit').on('click', handleAnswer);
    $('#hintButton').on('click', handleHint);
    $('#passButton').on('click', handlePass);
    $('#nextQuestionButton').on('click', handleNextQuestionAfterPass);

    $('#nextQuestionButton').hide();

    $('#response').val('');
    updateInterface();
}

function updateInterface() {
    $('#score').html(score);
}

function loadQuestions(onComplete) {
    $.getJSON('/words', function(resp) {
        questions = resp;
        onComplete();
    });
}

$(document).ready(function() {
    setupInterface();
    nextQuestion();
});


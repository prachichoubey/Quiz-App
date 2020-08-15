const question=document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice-text"));
const progressText=document.getElementById('progressText');
const scoreText= document.getElementById('score');
const progressBarFull= document.getElementById("progressBarFull");
const loader=document.getElementById("loader");
const game=document.getElementById("game");
//console.log(choice);
let currentQuestion={};
let acceptingAnswers=false;
let score=0;
let questionCounter=0;
let availableQuestions=[];

let questions = [];

fetch("https://opentdb.com/api.php?amount=40&category=18&difficulty=medium&type=multiple")
.then(res => {
    console.log(res);
    return res.json();
}).then(loadedQuestions =>{
    console.log(loadedQuestions);
    questions= loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion={
                question: loadedQuestion.question
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer= Math.floor(Math.random()*3) +1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
            answerChoices.forEach((choice, index)=>{
                formattedQuestion["choice" + (index+1)]=choice;
            })
            return formattedQuestion;
    });
    //questions = loadedQuestions;
    //game.classList.remove("hidden");
    //loader.classList.add("hidden");
    startGame();
    
})
.catch(err => {
    if(availableQuestions ===0 || questionCounter === 0 ){
        alert("Please have a proper Internet Connection");
    }
    console.error(err);
});



//constants

const CORRECT_BONUS= 10;
const MAX_QUESTIONS =10;

startGame = () =>{
    questionCounter =0 ;
    score =0 ;
    availableQuestions= [...questions];
    //console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if(availableQuestions.length===0 || questionCounter >= MAX_QUESTIONS){
        //go to the end page
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("/end.html");
    }
    questionCounter++;

    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //update the progress bar
    //console.log((questionCounter/MAX_QUESTIONS)*100);


    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    const questionIndex= Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText= currentQuestion["choice" + number];  
    });

    availableQuestions.splice(questionIndex,1);
    acceptingAnswers=true;
};


choices.forEach(choice =>{
    choice.addEventListener("click", e=>{
       if(!acceptingAnswers) return;
       acceptingAnswers=false;
       const selectedchoice= e.target;
       const selectedAnswer= selectedchoice.dataset['number'];
       const classToApply = selectedAnswer == currentQuestion.answer? "correct" : "incorrect";
        console.log(classToApply);
        
        if(classToApply==='correct'){
            incrementScore(CORRECT_BONUS);
        }
        selectedchoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedchoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
        
    });
});

incrementScore = num =>{
    score +=num;
    scoreText.innerText=score;
}




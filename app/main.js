const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const results = document.getElementById('results');
const selectBtn = document.getElementById('select-btn');
const loader = document.getElementById('loader');
const quizContent = document.querySelector('.quiz-content');
const quizScore = document.querySelector('.quiz-score');

const progress = document.querySelector('.progress');
const scoreDiv = document.querySelector('.score');

let progBar = document.getElementById('progress-bar');
let progBarFull = document.querySelector('#progress-bar > span');

let currentQuestion = document.getElementById('current-question');

let answersBox = document.querySelector('.answers');
// let answers = Array.from(document.querySelectorAll('.answer'));

let questions,
  shuffleQuestions,
  currentQuestionIndex,
  timer,
  answer,
  correct,
  category,
  difficulty,
  num,
  type,
  score;

// Get the modal
const modal = document.getElementById('select-modal');

// Get the <span> element that closes the modal
const closeModal = document.getElementsByClassName('close')[0];

// When the user clicks on the button, open the modal
startBtn.onclick = function() {
  modal.style.display = 'block';
};

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
  modal.style.display = 'none';

  makeSelection();
  startQuiz();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  // modal is 100%;
  if (event.target == modal) {
    //   console.log(event);
    //   console.log(event.target);
    modal.style.display = 'none';

    makeSelection();
    startQuiz();
  }
};

selectBtn.addEventListener('click', function() {
  // displayQuestion(shuffleQuestions[currentQuestionIndex]);
  modal.style.display = 'none';
  makeSelection();
  // document.getElementById('loader').classList.remove('hide');
  startQuiz();
  // nextQuestion();
});

// submit answer
submitBtn.addEventListener('click', submitAnswer);

// next question
nextBtn.addEventListener('click', nextQuestion);

// ======================================

// get questions
async function getQuestions() {
  const response = await axios.get(
    'https://opentdb.com/api.php?amount=' +
      num +
      '&category=' +
      category +
      '&difficulty=' +
      difficulty +
      '&type=' +
      type,
  );
  currentQuestionIndex = 0;
  // response.data.slice().sort();
  shuffleQuestions = response.data.results.sort(() => Math.random() - 0.5);
  // shuffleQuestions = _.shuffle(response.data);
  displayQuestion(shuffleQuestions[currentQuestionIndex]);
}

// make selection
function makeSelection() {
  // We can get their (input select) collection as selectList.options
  let selectList = document.getElementById('select-list');
  let selectForm = document.getElementById('form-select');
  // category = selectList[selectList.selectedIndex].value;
  // category = document.getElementById('form-select').elements['select-el'].value;
  category = selectList.value;
  // difficulty = document.getElementById('form-select').elements.difficulty.value;
  difficulty = selectForm.difficulty.value;
  // let num = document.getElementById("form-select").elements[0].value;
  // num = document.getElementById('form-select').number.value;
  num = selectForm.number.value;
  // type = document.getElementById('form-select').type.value;
  type = selectForm.type.value;

  getQuestions();

  // getQuestionss();
}

// start game
function startQuiz() {
  startBtn.classList.add('hide');
  quizScore.classList.remove('hide');
  quizContent.classList.remove('hide');

  progress.classList.remove('hide');

  score = 0;
  currentQuestionIndex = 0;
  results.innerHTML = score;
  //   progBar.style.width = `${100 - (currentQuestionIndex / shuffleQuestions.length) * 100}%`;
  progBarFull.style.width = '100%';

  // currentQuestion.innerText = shuffleQuestions[currentQuestionIndex].question;
  // nextQuestion();
}

// render question and answers
function displayQuestion(question) {
  if (loader) {
    loader.classList.add('hide');
  }
  answersBox.innerHTML = '';
  currentQuestion.innerHTML = question.question;
  let allAnswers = [...question.incorrect_answers, question.correct_answer];
  allAnswers = _.shuffle(allAnswers);
  // change text in node
  // answers[i].children[0].childNodes[1].nodeValue = el;

  allAnswers.forEach((el, i) => {
    answersBox.innerHTML += `<label class="answer radio"
  ><input type="radio" name="answer" />${el}</label><br>`;
  });
  //
  let answers = Array.from(document.querySelectorAll('.answer'));
  //
  for (let i = 0; i < answers.length; i++) {
    if (!answers[i].children[0].disabled) {
      answers[i].parentElement.addEventListener(
        'click',
        () => (submitBtn.disabled = false),
      );
    }

    if (answers[i].textContent == question.correct_answer) {
      // console.log(answers[i].textContent);
      // console.log(question.correct_answer);
      correct = answers[i];
      answers[i].dataset.correct = answers[i].textContent;
    }
    //
    clearStatusClass(answers[i]);
  }
}

function submitAnswer() {
  let answersList = document.querySelectorAll('.answer');
// console.log(answersList);
  for (let i = 0; i < answersList.length; i++) {
    let answer = answersList[i];
    let question = shuffleQuestions[currentQuestionIndex];
    answer.parentElement.addEventListener(
      'click',
      () => (submitBtn.disabled = true),
    );
    // console.log('acum disabled radio remove click');

    // if (answer.children[0].checked && answer.innerText == question.correct_answer) {
    if (
      answer.children[0].checked &&
      answer.textContent == question.correct_answer
    ) {
      answer.classList.add('correct');
      score++;
    } else if (
      answer.children[0].checked &&
      answer.textContent !== question.correct_answer
    ) {
      answer.classList.add('incorrect');
      correct.classList.add('correct');
    }

    // end if
    answer.children[0].disabled = true;
  }
  // end for
  // results.innerHTML = score;
  results.innerHTML = `${score} / ${shuffleQuestions.length}`;
  currentQuestionIndex++;
  //
  progBarFull.style.width = `${100 -
    (currentQuestionIndex / shuffleQuestions.length) * 100}%`;
  //
  nextBtn.disabled = false;
  submitBtn.disabled = true;

  // nextQuestion();
}

// next question
function nextQuestion() {
  submitBtn.disabled = true;

  if (currentQuestionIndex == shuffleQuestions.length) {
    // results.classList.remove('hide');
    startBtn.classList.remove('hide');
    startBtn.innerHTML = 'Restart';
    results.innerText = `Your score on this round is ${score} / ${shuffleQuestions.length}  point(s)`;
    quizContent.classList.add('hide');
    // quizScore.classList.add('hide');
    progress.classList.add('hide');
    scoreDiv.classList.add('hide');
    currentQuestionIndex = 0;
    score = 0;
    // progBar.style.width = `${100 - (currentQuestionIndex / shuffleQuestions.length) * 100}%`;
    // results.innerHTML = score;
  }

  //
  nextBtn.disabled = true;
  //   submitBtn.disabled = false;
  displayQuestion(shuffleQuestions[currentQuestionIndex]);
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('incorrect');
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('incorrect');
}


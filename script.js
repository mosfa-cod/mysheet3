 const quizData = [
  {
    question: "We use our ________ to smell flowers.",
    options: ["eyes", "ears", "nose", "hands"],
    correct: "nose"
  },
  {
    question: "The elephant is ________ than the monkey.",
    options: ["biggest", "bigger", "small", "tallest"],
    correct: "bigger"
  },
  {
    question: "She ________ English every day.",
    options: ["study", "studies", "studying", "studied"],
    correct: "studies"
  },
  {
    question: "Where ________ you from?",
    options: ["is", "am", "are", "be"],
    correct: "are"
  }
];

let currentQuestionIndex = 0;
let score = 0;
let studentName = "";
let seatNumber = "";

const subjectName = "الانجليزى"; 

const webAppUrl = "https://script.google.com/macros/s/AKfycbzmeV7hBdpZqpDkaRvBPCzASNIkz9ekRBKq-KiidA0nU0PcZDTS9-OmY2f92eFpBloX/exec"; 

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress');

startBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('student-name').value.trim();
    const seatInput = document.getElementById('seat-number').value.trim();
    
    if (nameInput === "" || seatInput === "") {
        alert("من فضلك أدخل الاسم ورقم الجلوس أولاً!");
        return;
    }
    
    studentName = nameInput;
    seatNumber = seatInput;
    
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    loadQuestion();
});

function loadQuestion() {
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = "";
    
    const currentQuestion = quizData[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    progressText.textContent = `السؤال ${currentQuestionIndex + 1} من ${quizData.length}`;
    
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(button, currentQuestion));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedButton, currentQuestion) {
    const selectedOption = selectedButton.textContent.trim();
    const correctOption = currentQuestion.correct.trim();
    
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(button => button.disabled = true);
    
    if (selectedOption === correctOption) {
        score++;
        selectedButton.classList.add('correct'); 
    } else {
        selectedButton.classList.add('wrong'); 
        buttons.forEach(button => {
            if (button.textContent.trim() === correctOption) {
                button.classList.add('correct');
            }
        });
    }
    
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    const percentage = Math.round((score / quizData.length) * 100);
    
    const finalScoreElement = document.getElementById('final-score');
    if (finalScoreElement) {
        finalScoreElement.textContent = `%${percentage}`;
    }
    
    document.getElementById('result-text').innerHTML = `أحسنت يا ${studentName}!<br>لقد حصلت على ${score} من ${quizData.length} (${percentage}%)`;
    
    sendDataToSheet();
}

function sendDataToSheet() {
    const urlParams = new URLSearchParams();
    urlParams.append('studentName', studentName);
    urlParams.append('seatNumber', seatNumber);
    urlParams.append('studentScore', `${score} / ${quizData.length}`);
    urlParams.append('subjectName', subjectName);

    fetch(webAppUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlParams.toString()
    })
    .then(response => {
        console.log("Data successfully sent to Google Sheets gateway.");
    })
    .catch(error => console.error('Network Error:', error.message));
}

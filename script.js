 // بنك أسئلة مادة اللغة الإنجليزية التفاعلي
const quizData = [
    {
        question: "We use our _________ to smell flowers.",
        options: ["eyes", "ears", "nose", "hands"],
        correct: 2 // الإجابة الصحيحة هي nose
    },
    {
        question: "The elephant is _________ than the monkey.",
        options: ["biggest", "bigger", "small", "tallest"],
        correct: 1 // الإجابة الصحيحة هي bigger
    },
    {
        question: "She _________ English every day.",
        options: ["study", "studies", "studying", "studied"],
        correct: 1 // الإجابة الصحيحة هي studies
    },
    {
        question: "Where _________ you from?",
        options: ["is", "am", "are", "be"],
        correct: 2 // الإجابة الصحيحة هي are
    }
];

let currentQuestionIndex = 0;
let score = 0;
let studentName = "";
let seatNumber = "";

// ⚠️ توجيه البيانات مباشرة لـ "الورقة1" بالأسفل الخاصة بالإنجليزي لفرزها تلقائياً
const subjectName = "الورقة1"; 

// ⚠️ ضع رابط تطبيق الويب الموحد الخاص بك (الإصدار 11) هنا:
const webAppUrl = "https://script.google.com/macros/s/AKfycbxuxoyjtyQdzvS1wysY0xMUZPHZvVVrQQaiEo6nrkWQqfmWogvVa2r5GA4CIe_txFXw/exec"; 

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
    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    questionText.innerText = currentQuestion.question;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(button, index));
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedBtn, index) {
    const currentQuestion = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (index === currentQuestion.correct) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('wrong');
        allButtons[currentQuestion.correct].classList.add('correct');
    }
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    document.getElementById('display-name').innerText = studentName;
    document.getElementById('display-seat').innerText = seatNumber;
    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = quizData.length;

    const payload = {
        studentName: studentName,
        seatNumber: seatNumber,
        studentScore: `${score} / ${quizData.length}`,
subjectName: "الانجليزى"
    };

    fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(() => {
        document.getElementById('upload-status').innerText = "✅ Your result has been saved to the sheet successfully!";
        document.getElementById('upload-status').className = "status-message";
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById('upload-status').innerText = "❌ Error uploading result.";
        document.getElementById('upload-status').style.color = "red";
    });
}

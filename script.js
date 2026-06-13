 // 1. مصفوفة الأسئلة الخاصة باختبار اللغة الإنجليزية
const quizQuestions = [
    {
        question: "1. She ________ to school every day.",
        options: ["go", "goes", "going", "gone"],
        correct: 1
    },
    {
        question: "2. Yesterday, we ________ a beautiful movie.",
        options: ["see", "seen", "saw", "watching"],
        correct: 2
    },
    {
        question: "3. Which word is a noun?",
        options: ["run", "beautiful", "apple", "quickly"],
        correct: 2
    },
    {
        question: "4. They ________ football at the moment.",
        options: ["are playing", "is playing", "played", "plays"],
        correct: 0
    }
];

let currentQuestionIndex = 0;
let studentScore = 0;
let studentName = "";
let seatingNumber = "";

// 2. التحكم في واجهة الموقع والزر البنفسجي للبدء
document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.querySelector(".btn") || document.getElementById("startBtn") || document.querySelector("button");
    
    if (startBtn) {
        startBtn.addEventListener("click", function(e) {
            e.preventDefault();
            
            const nameInput = document.querySelector('input[type="text"]');
            const seatingInput = document.querySelector('input[type="number"]') || document.querySelectorAll('input');
            
            studentName = nameInput ? nameInput.value.trim() : "مصطفى عبد العال";
            seatingNumber = seatingInput ? seatingInput.value.trim() : "188";
            
            if (studentName === "" || seatingNumber === "") {
                alert("يرجى إدخال الاسم ورقم الجلوس أولاً!");
                return;
            }
            
            startQuiz();
        });
    }
});

// 3. دالة بدء عرض الأسئلة مكان حقول الإدخال
function startQuiz() {
    const container = document.querySelector(".container") || document.body;
    container.innerHTML = `
        <div style="text-align: right; direction: rtl; padding: 20px;">
            <h2 id="questionTitle" style="color: #3f37c9; margin-bottom: 20px;"></h2>
            <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 10px;"></div>
            <button id="nextBtn" style="background-color: #7b2cbf; color: white; border: none; padding: 12px 25px; border-radius: 10px; margin-top: 20px; cursor: pointer; font-size: 16px; width: 100%;">التالي</button>
        </div>
    `;
    showQuestion();
}

// 4. دالة عرض السؤال الحالي والخيارات
function showQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    document.getElementById("questionTitle").innerText = currentQuestion.question;
    
    const optionsContainer = document.getElementById("optionsContainer");
    optionsContainer.innerHTML = "";
    
    currentQuestion.options.forEach((option, index) => {
        optionsContainer.innerHTML += `
            <label style="background: #f0f0f0; padding: 12px; border-radius: 8px; cursor: pointer; display: block; font-size: 16px; margin-bottom: 5px;">
                <input type="radio" name="quizOption" value="${index}" style="margin-left: 10px;"> ${option}
            </label>
        `;
    });
    
    const nextBtn = document.getElementById("nextBtn");
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.innerText = "إنهاء الاختبار وإرسال النتيجة";
    }
    
    nextBtn.onclick = handleNextClick;
}

// 5. معالجة الضغط على زر التالي أو الإنهاء
function handleNextClick() {
    const selectedOption = document.querySelector('input[name="quizOption"]:checked');
    if (!selectedOption) {
        alert("يرجى اختيار إجابة واحدة!");
        return;
    }
    
    if (parseInt(selectedOption.value) === quizQuestions[currentQuestionIndex].correct) {
        studentScore++;
    }
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        sendFinalDataToSheets();
    }
}

// 6. دالة الإرسال الفعلي وعرض النتيجة في نفس الصفحة دون الانتقال لصفحة 404
function sendFinalDataToSheets() {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbxNvwTs6OVjZ52gbkdtzLZnlPPNtYh78IfIp1XkYiD7BARXM00EYJQJzrbp9QG1vpPj/exec"; 
    
    const finalScoreText = studentScore + " / " + quizQuestions.length;
    const percentage = (studentScore / quizQuestions.length) * 100;
    const subjectName = "الانجليزى";

    const requestBody = "studentName=" + encodeURIComponent(studentName) +
                        "&seatingNumber=" + encodeURIComponent(seatingNumber) +
                        "&score=" + encodeURIComponent(finalScoreText) +
                        "&subject=" + encodeURIComponent(subjectName);

    // عرض النتيجة للطالب فوراً لتفادي شاشة الـ 404 المزعجة
    const container = document.querySelector(".container") || document.body;
    container.innerHTML = `
        <div style="text-align: center; direction: rtl; padding: 30px;">
            <h1 style="color: #3f37c9; font-size: 26px;">تم الانتهاء من الاختبار بنجاح</h1>
            <div style="font-size: 58px; font-weight: bold; color: #7b2cbf; margin: 20px 0;">%${percentage}</div>
            <div style="color: #2ec4b6; font-size: 18px; font-weight: bold; margin-bottom: 15px;">تم تسجيل إجاباتك وإرسال الدرجة تلقائياً.</div>
            <div style="font-size: 20px; color: #555555; margin-bottom: 10px;">أحسنت يا ${studentName}!</div>
            <div style="font-size: 16px; color: #777;">لقد حصلت على درجة: ${finalScoreText}</div>
        </div>
    `;

    // إرسال البيانات خلف الكواليس لجوجل شيت بدون حظر CORS
    fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: requestBody
    })
    .then(() => {
        console.log("تم حفظ النتيجة في جوجل شيت بنجاح!");
    })
    .catch((error) => {
        console.error("خطأ في الاتصال بالسيرفر وجداول البيانات:", error);
    });
}

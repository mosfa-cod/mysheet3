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

// 2. الدالة الأساسية لزر البدء والتي يبحث عنها كود الـ HTML لديك
function startQuiz() {
    // جلب المدخلات بأكثر من طريقة لضمان التقاط الاسم ورقم الجلوس
    const nameInput = document.querySelector('input[type="text"]') || document.getElementById("studentNameInput");
    const seatingInput = document.querySelector('input[type="number"]') || document.getElementById("seatingInput") || document.querySelector('input[type="text"]:last-of-type');
    
    studentName = nameInput ? nameInput.value.trim() : "";
    seatingNumber = seatingInput ? seatingInput.value.trim() : "";
    
    // التحقق من تعبئة البيانات أولاً
    if (studentName === "" || seatingNumber === "") {
        alert("يرجى إدخال الاسم ورقم الجلوس أولاً!");
        return;
    }
    
    // بناء واجهة الأسئلة فوراً
    renderQuizInterface();
}

// ربط احتياطي إضافي لتشغيل الزر عند النقر تلقائياً
document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.querySelector(".btn") || document.getElementById("startBtn") || document.querySelector("button");
    if (startBtn) {
        startBtn.onclick = function(e) {
            e.preventDefault();
            startQuiz();
        };
    }
});

// 3. دالة بناء واجهة الأسئلة مكان حقول الإدخال
function renderQuizInterface() {
    const container = document.querySelector(".container") || document.body;
    container.innerHTML = `
        <div style="text-align: right; direction: rtl; padding: 20px;">
            <h2 id="questionTitle" style="color: #3f37c9; margin-bottom: 20px; font-size: 22px;"></h2>
            <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 12px;"></div>
            <button id="nextBtn" style="background-color: #7b2cbf; color: white; border: none; padding: 14px 25px; border-radius: 10px; margin-top: 25px; cursor: pointer; font-size: 18px; width: 100%; font-weight: bold;">التالي</button>
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
            <label style="background: #f8f9fa; padding: 14px; border: 2px solid #e9ecef; border-radius: 10px; cursor: pointer; display: block; font-size: 18px; margin-bottom: 5px; transition: 0.2s;">
                <input type="radio" name="quizOption" value="${index}" style="margin-left: 12px; transform: scale(1.2);"> ${option}
            </label>
        `;
    });
    
    const nextBtn = document.getElementById("nextBtn");
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.innerText = "إنهاء الاختبار وإرسال النتيجة";
    }
    
    nextBtn.onclick = handleNextClick;
}

// 5. معالجة الضغط على زر التالي وحساب النتيجة
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

// 6. دالة الإرسال وعرض لوحة النجاح المباشرة بدون الانتقال لصفحة 404
function sendFinalDataToSheets() {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbxNvwTs6OVjZ52gbkdtzLZnlPPNtYh78IfIp1XkYiD7BARXM00EYJQJzrbp9QG1vpPj/exec"; 
    
    const finalScoreText = studentScore + " / " + quizQuestions.length;
    const percentage = (studentScore / quizQuestions.length) * 100;
    const subjectName = "الانجليزى";

    const requestBody = "studentName=" + encodeURIComponent(studentName) +
                        "&seatingNumber=" + encodeURIComponent(seatingNumber) +
                        "&score=" + encodeURIComponent(finalScoreText) +
                        "&subject=" + encodeURIComponent(subjectName);

    // بناء شكل التهنئة الفوري والنهائي للطالب في نفس الشاشة
    const container = document.querySelector(".container") || document.body;
    container.innerHTML = `
        <div style="text-align: center; direction: rtl; padding: 40px 20px;">
            <h1 style="color: #3f37c9; font-size: 28px; margin-bottom: 10px;">تم الانتهاء من الاختبار بنجاح</h1>
            <div style="font-size: 64px; font-weight: bold; color: #7b2cbf; margin: 25px 0;">%${percentage}</div>
            <div style="color: #2ec4b6; font-size: 20px; font-weight: bold; margin-bottom: 20px;">تم تسجيل إجاباتك وإرسال الدرجة تلقائياً للمعلم.</div>
            <div style="font-size: 22px; color: #333333; margin-bottom: 10px;">أحسنت يا ${studentName}!</div>
            <div style="font-size: 18px; color: #666666;">لقد حصلت على درجة: ${finalScoreText}</div>
        </div>
    `;

    // تمرير البيانات السجلية لجوجل شيت خلف الكواليس
    fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: requestBody
    })
    .then(() => {
        console.log("Data saved to Google Sheets successfully.");
    })
    .catch((error) => {
        console.error("Error communicating with server:", error);
    });
}

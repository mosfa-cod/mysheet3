 // 1. مصفوفة الأسئلة الخاصة باختبار اللغة الإنجليزية
const quizQuestions = [
    {
        question: "1. She ________ to school every day.",
        options: ["go", "goes", "going", "gone"],
        correct: 1 // الإجابة الصحيحة هي goes
    },
    {
        question: "2. Yesterday, we ________ a beautiful movie.",
        options: ["see", "seen", "saw", "watching"],
        correct: 2 // الإجابة الصحيحة هي saw
    },
    {
        question: "3. Which word is a noun?",
        options: ["run", "beautiful", "apple", "quickly"],
        correct: 2 // الإجابة الصحيحة هي apple
    },
    {
        question: "4. They ________ football at the moment.",
        options: ["are playing", "is playing", "played", "plays"],
        correct: 0 // الإجابة الصحيحة هي are playing
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
            
            // جلب البيانات المكتوبة في الخانات
            const nameInput = document.querySelector('input[type="text"]');
            const seatingInput = document.querySelector('input[type="number"]') || document.querySelectorAll('input')[1];
            
            studentName = nameInput ? nameInput.value.trim() : "مصطفى عبد العال";
            seatingNumber = seatingInput ? seatingInput.value.trim() : "188";
            
            if (studentName === "" || seatingNumber === "") {
                alert("يرجى إدخال الاسم ورقم الجلوس أولاً!");
                return;
            }
            
            // تحويل الواجهة لعرض الأسئلة
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
            <label style="background: #f0f0f0; padding: 12px; border-radius: 8px; cursor: pointer; display: block; font-size: 16px;">
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
    
    // التحقق من الإجابة الصحيحة وحساب الدرجة
    if (parseInt(selectedOption.value) === quizQuestions[currentQuestionIndex].correct) {
        studentScore++;
    }
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        // إذا كان هذا آخر سؤال، أرسل البيانات فوراً لجوجل شيت
        sendFinalDataToSheets();
    }
}

// 6. دالة الإرسال الفعلي والنهائي إلى جوجل شيت والانتقال لصفحة النجاح
function sendFinalDataToSheets() {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbxNvwTs6OVjZ52gbkdtzLZnlPPNtYh78IfIp1XkYiD7BARXM00EYJQJzrbp9QG1vpPj/exec"; 
    
    const finalScoreText = studentScore + " / " + quizQuestions.length;
    const percentage = (studentScore / quizQuestions.length) * 100;
    const subjectName = "الانجليزى";

    // صياغة البيانات المشفرة لعدم حدوث حظر CORS
    const requestBody = "studentName=" + encodeURIComponent(studentName) +
                        "&seatingNumber=" + encodeURIComponent(seatingNumber) +
                        "&score=" + encodeURIComponent(finalScoreText) +
                        "&subject=" + encodeURIComponent(subjectName);

    // إرسال البيانات خلف الكواليس
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
        // الانتقال التلقائي لصفحة success.html وعرض اسم الطالب والنسبة المئوية الحقيقية له
        window.location.href = "success.html?name=" + encodeURIComponent(studentName) + 
                               "&score=" + encodeURIComponent(finalScoreText) + 
                               "&percent=" + percentage;
    })
    .catch((error) => {
        console.error("خطأ في الاتصال بالسيرفر وجداول البيانات:", error);
    });
}

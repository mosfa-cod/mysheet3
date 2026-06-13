 // دالة إرسال البيانات النهائية والربط المباشر مع جوجل
function sendQuizDataToGoogleSheets() {
    // الرابط الأخير والمحدث الذي نسخته من الـ Deployment
const webAppUrl = "https://script.google.com/macros/s/AKfycbxNvwTs6OVjZ52gbkdtzLZnlPPNtYh78IfIp1XkYiD7BARXM00EYJQJzrbp9QG1vpPj/exec";

    // جلب البيانات من المدخلات الحقيقية للاختبار في موقعك
    const sName = document.getElementById("studentNameInput") ? document.getElementById("studentNameInput").value.trim() : "مصطفى عبد العال دحروج";
    const sSeating = document.getElementById("seatingInput") ? document.getElementById("seatingInput").value.trim() : "144";
    const sScore = "4 / 4"; 
    const sSubject = "الانجليزى";

    // صياغة نصية مشفرة لضمان عبور البيانات حماية جوجل بدون حظر (CORS)
    const requestBody = "studentName=" + encodeURIComponent(sName) +
                        "&seatingNumber=" + encodeURIComponent(sSeating) +
                        "&score=" + encodeURIComponent(sScore) +
                        "&subject=" + encodeURIComponent(sSubject);

    // إرسال الطلب الفعلي
    fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors", 
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: requestBody
    })
    .then(() => {
        console.log("Data successfully sent to Google Sheets gateway.");
        // فتح صفحة النجاح تلقائياً بعد الإرسال
        window.location.href = "success.html?name=" + encodeURIComponent(sName);
    })
    .catch((error) => {
        console.error("خطأ في الاتصال بسيرفر جوجل:", error);
    });
}

// تشغيل الدالة تلقائياً عند إنهاء الطالب للاختبار
sendQuizDataToGoogleSheets();

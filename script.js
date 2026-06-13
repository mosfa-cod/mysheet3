 // الدالة المسؤولة عن إرسال بيانات الاختبار إلى جوجل شيت
function sendQuizData() {
  // الرابط الخاص بنشر البرمجية (طريقة الحفظ الفعالة من Apps Script)
  const url = "https://script.google.com/macros/s/AKfycbxapWo7PGx9qWLNMAeUyCR6SjFz9l267ur1PmEUPa6SIzt2k1-agMAtM9maFlwm4ztJ/exec";

  // تجميع البيانات من حقول الإدخال في الموقع
  // تأكد أن المعرفات (IDs) تطابق عناصر صفحتك مثل input الخاص بالاسم ورقم الجلوس
  const quizData = {
    studentName: document.getElementById("studentNameInput").value.trim(), // يجلب الاسم الفعلي "اسماعيل القبانى سلامة"
    seatingNumber: document.getElementById("seatingInput").value.trim(),   // رقم الجلوس (144)
    score: "2 / 4", // النتيجة المحققة في الاختبار
    subject: "الانجليزى" // اسم المادة
  };

  // إرسال البيانات بصيغة JSON عبر طلب POST
  fetch(url, {
    method: "POST",
    mode: "no-cors", // لمنع مشاكل حظر الطلبات الخارجية (CORS)
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quizData)
  })
  .then(() => {
    // الانتقال لصفحة النتيجة بعد نجاح الإرسال
    window.location.href = "success.html"; 
  })
  .catch((error) => {
    console.error("حدث خطأ أثناء إرسال البيانات:", error);
  });
}

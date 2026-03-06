// استيراد المكتبة بطريقة متوافقة مع المتصفحات الحديثة
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 1. ضع مفتاح الـ API الخاص بك هنا (تأكد أنه يبدأ بـ AIza)
const API_KEY = "AIzaSyAhQ7xJLsBgeETCf_EPBY8EKs0bEl6dS9A"; 

// إعداد المحرك
const genAI = new GoogleGenerativeAI(API_KEY);

// نظام التبديل بين الواجهات
window.switchTab = function(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`${tab}-section`).classList.add('active');
    document.getElementById(`btn-${tab}`).classList.add('active');
}

// وظيفة البحث
window.askGemini = async function() {
    const input = document.getElementById("searchInput").value;
    const resultsArea = document.getElementById("resultsArea");
    const btn = document.getElementById("searchBtn");

    if (!input) {
        alert("اكتب سؤالك أولاً");
        return;
    }

    // تجهيز واجهة التحميل
    btn.disabled = true;
    resultsArea.innerHTML = `
        <div class="result-card" style="text-align:center;">
            <i class="fas fa-sync fa-spin" style="font-size:2rem; color:#2563eb"></i>
            <p>جاري الاتصال بخبير الكهرباء...</p>
        </div>`;

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        });

        // التعليمات الخاصة بالسيارات في الجزائر
        const prompt = `أنت خبير كهرباء سيارات محترف في الجزائر. 
        أجب على هذا السؤال تقنياً وبالدارجة الجزائرية والفرنسية: ${input}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        resultsArea.innerHTML = `
            <div class="result-card">
                <div class="card-header">
                    <i class="fas fa-check-circle" style="color:green"></i>
                    <h3>نتيجة الفحص</h3>
                </div>
                <div class="card-body">
                    <p style="white-space: pre-line;">${text}</p>
                </div>
            </div>`;

    } catch (error) {
        console.error(error);
        let errorMsg = "حدث خطأ غير معروف";
        
        if (error.message.includes("API_KEY_INVALID")) {
            errorMsg = "مفتاح الـ API غير صحيح. تأكد من نسخه كاملاً.";
        } else if (error.message.includes("fetch")) {
            errorMsg = "لا يمكن الاتصال بـ Google. (قد يكون السبب فتح الملف مباشرة من الذاكرة، حاول رفعه على Github أو استضافة)";
        }

        resultsArea.innerHTML = `
            <div class="result-card" style="border-right-color: red;">
                <h3 style="color:red;">⚠️ فشل التشغيل</h3>
                <p>${errorMsg}</p>
                <p style="font-size:0.8rem">${error.message}</p>
            </div>`;
    } finally {
        btn.disabled = false;
    }
}

window.saveToData = function() {
    const key = document.getElementById("adminKey").value;
    if (key === "admin123") {
        alert("تم حفظ البيانات بنجاح!");
    } else {
        alert("كلمة مرور خاطئة!");
    }
}

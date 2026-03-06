import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 1. تأكد من وضع مفتاحك الصحيح هنا
const API_KEY = "AIzaSyAhQ7xJLsBgeETCf_EPBY8EKs0bEl6dS9A"; 
const genAI = new GoogleGenerativeAI(API_KEY);

window.switchTab = function(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`${tab}-section`).classList.add('active');
    document.getElementById(`btn-${tab}`).classList.add('active');
}

window.askGemini = async function() {
    const input = document.getElementById("searchInput").value;
    const resultsArea = document.getElementById("resultsArea");
    const btn = document.getElementById("searchBtn");

    if (!input) return alert("اكتب سؤالك أولاً");

    btn.disabled = true;
    resultsArea.innerHTML = `
        <div class="result-card" style="text-align:center;">
            <i class="fas fa-sync fa-spin" style="font-size:2rem; color:#2563eb"></i>
            <p>جاري فحص المخططات الكهربائية...</p>
        </div>`;

    try {
        // التعديل هنا: نستخدم الإصدار 1.5 flash ونحدد الموديل بدقة
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `أنت خبير كهرباء سيارات في الجزائر. أجب بدقة وبالدارجة والفرنسية التقنية عن: ${input}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        resultsArea.innerHTML = `
            <div class="result-card">
                <div class="card-header"><i class="fas fa-check-circle" style="color:green"></i><h3>تقرير الخبير</h3></div>
                <div class="card-body"><p style="white-space: pre-line;">${text}</p></div>
                <div class="card-footer"><span>⚠️ تنبيه: افصل البطارية قبل أي تدخل كهربائي.</span></div>
            </div>`;

    } catch (error) {
        console.error("Gemini Error:", error);
        
        // إذا استمر الخطأ 404، سنجرب الموديل المستقر الآخر كبديل تلقائي
        if (error.message.includes("404")) {
            resultsArea.innerHTML = `<div class="result-card" style="border-right-color: red;">
                <h3 style="color:red;">⚠️ خطأ في إصدار النموذج</h3>
                <p>جاري محاولة الاتصال بالنسخة الاحتياطية...</p>
            </div>`;
            // محاولة ثانية بموديل مختلف
            retryWithPro(input, resultsArea);
        } else {
            resultsArea.innerHTML = `<div class="result-card" style="border-right-color: red;">
                <h3 style="color:red;">⚠️ فشل الاتصال</h3>
                <p>${error.message}</p>
            </div>`;
        }
    } finally {
        btn.disabled = false;
    }
}

// دالة احتياطية في حال فشل الموديل الأول
async function retryWithPro(input, resultsArea) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(input);
        const response = await result.response;
        resultsArea.innerHTML = `<div class="result-card"><div class="card-body">${response.text()}</div></div>`;
    } catch (e) {
        resultsArea.innerHTML = `<div class="result-card" style="color:red;">خطأ نهائي: تأكد من إعدادات مفتاح الـ API في Google AI Studio.</div>`;
    }
}

window.saveToData = function() {
    const key = document.getElementById("adminKey").value;
    if (key === "admin123") alert("تم الحفظ!"); else alert("خطأ!");
                }

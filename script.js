// ===== تحسينات الجوال =====
(function() {
    // تعطيل التأثيرات الثقيلة على الجوال
    if (window.innerWidth <= 768) {
        // إزالة تأثيرات parallax
        window.removeEventListener('scroll', function() {});
        
        // تعطيل الرسوم المتحركة للأزرار العائمة
        document.querySelectorAll('.float-btn').forEach(btn => {
            btn.style.animation = 'none';
        });
        
        // تقليل دقة مراقبة التمرير
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // تحديث شريط التقدم فقط
                    const progressBar = document.getElementById('progressBar');
                    if (progressBar) {
                        const scrolled = window.scrollY;
                        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                        const progress = (scrolled / maxScroll) * 100;
                        progressBar.style.width = `${progress}%`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
})();

// ===== باقي الكود (كما هو مع تحسينات) =====
// ThemeManager, HeroSlider, PortfolioManager, إلخ...
// يمكنك الاحتفاظ بباقي الكلاسات كما هي، مع إضافة التحسينات أعلاه في البداية

// مثال: ThemeManager (نفس الكود السابق)
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    init() {
        this.setTheme(this.currentTheme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.currentTheme = newTheme;
    }
}

// ===== تهيئة الموقع =====
document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
    // يمكنك إضافة الكلاسات الأخرى هنا حسب الحاجة
    console.log('✅ موقع ديكور آرت جدة جاهز');
});
// ===== تحسينات الجوال (تُنفذ فوراً) =====
(function() {
    if (window.innerWidth <= 768) {
        // تعطيل تأثيرات Parallax
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

// ===== ThemeManager =====
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
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) this.setTheme(e.matches ? 'dark' : 'light');
            });
        }
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// ===== ProgressBar =====
class ProgressBar {
    constructor() {
        this.progressBar = document.getElementById('progressBar');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.updateProgressBar());
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        if (!this.progressBar) return;
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;
        this.progressBar.style.width = `${progress}%`;
        
        const scrollTopBtn = document.querySelector('.scroll-top-btn');
        if (scrollTopBtn) scrollTopBtn.style.display = scrolled > 500 ? 'flex' : 'none';
    }
}

// ===== HeroSlider =====
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-slide');
        this.nextBtn = document.querySelector('.next-slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        this.showSlide(this.currentSlide);
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.indicators.forEach((ind, i) => ind.addEventListener('click', () => this.goToSlide(i)));
        this.startAutoSlide();
        this.setupPauseOnHover();
        this.setupTouchEvents();
    }
    
    showSlide(index) {
        if (index >= this.slides.length) index = 0;
        if (index < 0) index = this.slides.length - 1;
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(ind => ind.classList.remove('active'));
        this.currentSlide = index;
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
    }
    
    nextSlide() { this.showSlide(this.currentSlide + 1); this.resetAutoSlide(); }
    prevSlide() { this.showSlide(this.currentSlide - 1); this.resetAutoSlide(); }
    goToSlide(index) { this.showSlide(index); this.resetAutoSlide(); }
    
    startAutoSlide() { this.slideInterval = setInterval(() => this.nextSlide(), 5000); }
    resetAutoSlide() { clearInterval(this.slideInterval); this.startAutoSlide(); }
    
    setupPauseOnHover() {
        const container = document.querySelector('.slider-container');
        if (container) {
            container.addEventListener('mouseenter', () => clearInterval(this.slideInterval));
            container.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }
    
    setupTouchEvents() {
        const container = document.querySelector('.slider-container');
        if (!container) return;
        let startX = 0, endX = 0;
        container.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX);
        container.addEventListener('touchend', e => {
            endX = e.changedTouches[0].screenX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) diff > 0 ? this.nextSlide() : this.prevSlide();
        });
    }
}

// ===== PortfolioManager (مبسط) =====
class PortfolioManager {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        this.setupFiltering();
        this.setupLikeButtons();
        this.setupViewButtons();
        this.setupInquiryButtons();
        this.setupModals();
        this.setupInquiryForm();
        this.setupLoadMore();
    }
    
    setupFiltering() {
        const filters = document.querySelectorAll('.filter-btn');
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.filterProjects();
            });
        });
    }
    
    filterProjects() {
        const items = document.querySelectorAll('.portfolio-item');
        items.forEach(item => {
            const cat = item.dataset.category;
            item.classList.toggle('hidden', !(this.currentFilter === 'all' || cat === this.currentFilter));
        });
    }
    
    setupLikeButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.like-btn');
            if (btn) this.handleLike(btn);
        });
    }
    
    handleLike(btn) {
        const countSpan = btn.querySelector('.like-count');
        let count = parseInt(countSpan.textContent);
        btn.classList.toggle('liked');
        const icon = btn.classList.contains('liked') ? 'fas' : 'far';
        btn.innerHTML = `<i class="${icon} fa-heart"></i><span class="like-count">${btn.classList.contains('liked') ? count + 1 : count - 1}</span>`;
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = 'scale(1)', 300);
    }
    
    setupViewButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.quick-view-btn, .details-btn');
            if (btn) {
                const id = btn.closest('.portfolio-item').dataset.id;
                this.openProjectModal(id);
            }
        });
    }
    
    openProjectModal(id) {
        const modal = document.getElementById('projectModal');
        if (!modal) return;
        const project = this.getProjectFromHTML(id);
        if (!project) return;
        modal.querySelector('.modal-content').innerHTML = `
            <div class="project-modal-content">
                <h2 class="modal-title">${project.title}</h2>
                <img src="${project.image}" alt="${project.title}" style="width:100%; border-radius:10px;" loading="lazy">
                <p>${project.description}</p>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    getProjectFromHTML(id) {
        const el = document.querySelector(`.portfolio-item[data-id="${id}"]`);
        if (!el) return null;
        return {
            id,
            title: el.querySelector('h3').textContent,
            description: el.querySelector('p').textContent,
            image: el.querySelector('img').src
        };
    }
    
    setupInquiryButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.inquire-btn');
            if (btn && btn.dataset.project) this.openInquiryModal(btn.dataset.project);
        });
    }
    
    openInquiryModal(id) {
        const modal = document.getElementById('inquiryModal');
        if (!modal) return;
        modal.querySelector('#inquiryProjectId').value = id;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    setupModals() {
        const modals = document.querySelectorAll('.project-modal, .inquiry-modal');
        const close = document.querySelectorAll('.modal-close, .modal-overlay');
        close.forEach(btn => {
            btn.addEventListener('click', () => {
                modals.forEach(m => m.style.display = 'none');
                document.body.style.overflow = 'auto';
            });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(m => m.style.display = 'none');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    setupInquiryForm() {
        const form = document.getElementById('inquiryForm');
        const wpBtn = document.getElementById('whatsappInquiry');
        if (form) form.addEventListener('submit', (e) => { e.preventDefault(); this.submitInquiryForm(form); });
        if (wpBtn) wpBtn.addEventListener('click', () => this.submitViaWhatsApp(form));
    }
    
    submitInquiryForm(form) {
        const data = {
            name: form.querySelector('#inquiryName')?.value.trim(),
            phone: form.querySelector('#inquiryPhone')?.value.trim(),
            type: form.querySelector('#inquiryType')?.value,
            message: form.querySelector('#inquiryMessage')?.value.trim()
        };
        if (!data.name || data.name.length < 2) return this.showNotification('الاسم غير صحيح', 'error');
        if (!data.phone || !/^(05|5|9665|\+9665)[0-9]{8}$/.test(data.phone)) return this.showNotification('رقم الجوال غير صحيح', 'error');
        this.showNotification('تم إرسال الاستفسار بنجاح!', 'success');
        document.getElementById('inquiryModal').style.display = 'none';
        form.reset();
        document.body.style.overflow = 'auto';
    }
    
    submitViaWhatsApp(form) {
        const phone = form.querySelector('#inquiryPhone')?.value.trim();
        const name = form.querySelector('#inquiryName')?.value.trim();
        if (!phone || !/^(05|5|9665|\+9665)[0-9]{8}$/.test(phone)) return this.showNotification('رقم الجوال غير صحيح', 'error');
        if (!name) return this.showNotification('الاسم مطلوب', 'error');
        const msg = `مرحباً، أنا ${name} أود الاستفسار عن مشروع`;
        window.open(`https://wa.me/966535544019?text=${encodeURIComponent(msg)}`, '_blank');
    }
    
    setupLoadMore() {
        const btn = document.querySelector('.load-more-btn');
        if (btn) btn.addEventListener('click', () => {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
            setTimeout(() => {
                this.showNotification('سيتم إضافة المزيد قريباً', 'info');
                btn.innerHTML = '<i class="fas fa-plus"></i> عرض المزيد';
            }, 1500);
        });
    }
    
    showNotification(msg, type = 'info') {
        const notif = document.createElement('div');
        notif.className = `notification notification-${type}`;
        notif.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span><span>${msg}</span><button class="notification-close">×</button>`;
        notif.style.cssText = `position:fixed; top:100px; left:50%; transform:translateX(-50%); background:${type === 'error' ? '#fee' : '#e8f4fd'}; color:${type === 'error' ? '#c0392b' : '#0a58ca'}; padding:15px 25px; border-radius:10px; box-shadow:0 5px 20px rgba(0,0,0,0.15); display:flex; align-items:center; gap:15px; z-index:9999; opacity:0; transition:0.3s; border-right:4px solid ${type === 'error' ? '#c0392b' : '#0a58ca'};`;
        document.body.appendChild(notif);
        setTimeout(() => notif.style.opacity = '1', 10);
        notif.querySelector('.notification-close').addEventListener('click', () => {
            notif.style.opacity = '0'; setTimeout(() => notif.remove(), 300);
        });
        setTimeout(() => { notif.style.opacity = '0'; setTimeout(() => notif.remove(), 300); }, 5000);
    }
}

// ===== MobileMenu =====
class MobileMenu {
    constructor() {
        this.btn = document.querySelector('.mobile-menu-btn');
        this.menu = document.querySelector('.nav-menu');
        this.init();
    }
    
    init() {
        if (!this.btn || !this.menu) return;
        this.btn.addEventListener('click', () => this.toggle());
        this.menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => this.close()));
        window.addEventListener('scroll', () => this.close());
    }
    
    toggle() {
        this.btn.classList.toggle('active');
        this.menu.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : 'auto';
    }
    
    close() {
        this.btn.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ===== SearchManager (مبسط) =====
class SearchManager {
    constructor() {
        this.input = document.querySelector('.search-input');
        this.btn = document.querySelector('.search-submit-btn');
        this.init();
    }
    
    init() {
        if (this.btn) this.btn.addEventListener('click', () => this.search());
        if (this.input) this.input.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.search(); });
    }
    
    search() {
        const q = this.input?.value.trim();
        if (q && window.portfolioManager) window.portfolioManager.showNotification(`جارٍ البحث عن: "${q}"`, 'info');
        else if (window.portfolioManager) window.portfolioManager.showNotification('أدخل كلمة البحث', 'warning');
    }
}

// ===== JeddahDistricts =====
class JeddahDistricts {
    constructor() {
        this.btns = document.querySelectorAll('.explore-district');
        this.init();
    }
    
    init() {
        this.btns.forEach(btn => btn.addEventListener('click', () => this.explore(btn.dataset.area)));
    }
    
    explore(area) {
        const info = {
            north: 'شمال جدة: مناطق ساحلية تحتاج مواد مقاومة للرطوبة.',
            central: 'وسط جدة: مناطق حيوية تحتاج ديكور عملي.',
            south: 'جنوب جدة: مناطق سكنية عائلية هادئة.',
            historical: 'جدة التاريخية: الحفاظ على التراث مع لمسات عصرية.'
        };
        if (window.portfolioManager) window.portfolioManager.showNotification(info[area] || 'جاري تحميل أفكار الديكور...', 'info');
        setTimeout(() => {
            if (window.portfolioManager) window.portfolioManager.showNotification('تم تحميل أفكار الديكور للحي', 'success');
        }, 1500);
    }
}

// ===== NewsletterManager =====
class NewsletterManager {
    constructor() {
        this.form = document.querySelector('.newsletter-form');
        this.init();
    }
    
    init() {
        if (this.form) this.form.addEventListener('submit', (e) => { e.preventDefault(); this.subscribe(); });
    }
    
    subscribe() {
        const input = this.form.querySelector('input[type="email"]');
        const email = input.value.trim();
        if (!this.validateEmail(email)) return window.portfolioManager?.showNotification('البريد الإلكتروني غير صحيح', 'error');
        input.disabled = true;
        const btn = this.form.querySelector('button');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        setTimeout(() => {
            this.save(email);
            window.portfolioManager?.showNotification('تم الاشتراك بنجاح!', 'success');
            input.value = '';
            input.disabled = false;
            btn.innerHTML = original;
        }, 1500);
    }
    
    validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    save(email) {
        const subs = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        if (!subs.some(s => s.email === email)) subs.push({ email, date: new Date().toISOString() });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subs.slice(-50)));
    }
}

// ===== تهيئة الموقع =====
document.addEventListener('DOMContentLoaded', function() {
    window.themeManager = new ThemeManager();
    window.progressBar = new ProgressBar();
    window.heroSlider = new HeroSlider();
    window.portfolioManager = new PortfolioManager();
    window.mobileMenu = new MobileMenu();
    window.searchManager = new SearchManager();
    window.jeddahDistricts = new JeddahDistricts();
    window.newsletterManager = new NewsletterManager();
    
    // أحداث التمرير للهيدر
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (header) header.classList.toggle('scrolled', window.scrollY > 100);
    });
    
    // زر العودة للأعلى
    const topBtn = document.querySelector('.scroll-top-btn');
    if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    console.log('✅ موقع ديكور آرت جدة جاهز');
});
// ===== تحسينات الجوال (تعطيل التأثيرات الثقيلة) =====
(function() {
    if (window.innerWidth <= 768) {
        // تعطيل الـ Parallax وغيره من التأثيرات
        window.removeEventListener('scroll', function() {});
        
        // إيقاف أنيميشن الأزرار العائمة
        document.querySelectorAll('.float-btn').forEach(btn => {
            btn.style.animation = 'none';
        });
        
        // تقليل استهلاك scroll events باستخدام requestAnimationFrame
        let ticking = false;
        const originalScrollHandler = window.onscroll;
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
                    // تحديث زر العودة للأعلى
                    const scrollTopBtn = document.querySelector('.scroll-top-btn');
                    if (scrollTopBtn) {
                        scrollTopBtn.style.display = window.scrollY > 500 ? 'flex' : 'none';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
})();

// ===== إدارة ثيمات الموقع =====
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
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
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

// ===== إدارة شريط التقدم (محسّن للجوال) =====
class ProgressBar {
    constructor() {
        this.progressBar = document.getElementById('progressBar');
        this.init();
    }

    init() {
        this.updateProgressBar(); // التحديث يتم عبر الـ scroll المحسن أعلاه
    }

    // ملاحظة: التحديث يتم عبر الـ scroll event المحسن في البداية
}

// ===== إدارة السلايدر (مصحح للـ RTL) =====
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
        
        // تصحيح الأزرار للغة العربية (prev يذهب للأمام، next للخلف)
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.nextSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.prevSlide());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.startAutoSlide();
        this.setupPauseOnHover();
        this.setupTouchEvents();
    }

    showSlide(index) {
        if (index >= this.slides.length) index = 0;
        if (index < 0) index = this.slides.length - 1;
        
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        this.currentSlide = index;
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
    }

    nextSlide() { this.showSlide(this.currentSlide + 1); this.resetAutoSlide(); }
    prevSlide() { this.showSlide(this.currentSlide - 1); this.resetAutoSlide(); }
    goToSlide(index) { this.showSlide(index); this.resetAutoSlide(); }

    startAutoSlide() {
        this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    }

    resetAutoSlide() {
        clearInterval(this.slideInterval);
        this.startAutoSlide();
    }

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
        
        let touchStartX = 0;
        container.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
        container.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            }
        });
    }
}

// ===== إدارة معرض الأعمال (مع تحسين الأداء) =====
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
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.filterProjects();
            });
        });
    }

    filterProjects() {
        const items = document.querySelectorAll('.portfolio-item');
        items.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = this.currentFilter === 'all' || category === this.currentFilter;
            item.classList.toggle('hidden', !shouldShow);
        });
    }

    setupLikeButtons() {
        document.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) this.handleLike(likeBtn);
        });
    }

    handleLike(likeBtn) {
        const countSpan = likeBtn.querySelector('.like-count');
        let count = parseInt(countSpan.textContent);
        if (likeBtn.classList.contains('liked')) {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<i class="far fa-heart"></i><span class="like-count">' + (count - 1) + '</span>';
        } else {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<i class="fas fa-heart"></i><span class="like-count">' + (count + 1) + '</span>';
        }
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => likeBtn.style.transform = 'scale(1)', 300);
        this.saveLike(likeBtn);
    }

    saveLike(likeBtn) {
        const projectId = likeBtn.closest('.portfolio-item').dataset.id;
        const liked = likeBtn.classList.contains('liked');
        const likes = JSON.parse(localStorage.getItem('projectLikes') || '{}');
        likes[projectId] = liked;
        localStorage.setItem('projectLikes', JSON.stringify(likes));
    }

    setupViewButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.quick-view-btn, .details-btn');
            if (btn) {
                const projectId = btn.closest('.portfolio-item').dataset.id;
                this.openProjectModal(projectId);
            }
        });
    }

    openProjectModal(projectId) {
        const modal = document.getElementById('projectModal');
        const modalContent = modal.querySelector('.modal-content');
        const projectData = this.getProjectFromHTML(projectId);
        if (!projectData) return;
        
        modalContent.innerHTML = this.createProjectModalHTML(projectData);
        this.setupProjectSlider();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    getProjectFromHTML(projectId) {
        const el = document.querySelector(`.portfolio-item[data-id="${projectId}"]`);
        if (!el) return null;
        return {
            id: projectId,
            title: el.querySelector('h3').textContent,
            description: el.querySelector('.project-description').textContent,
            location: el.querySelector('[itemprop="location"]').textContent,
            area: el.querySelector('[itemprop="size"]').textContent,
            year: el.querySelector('[itemprop="dateCreated"]').textContent,
            rating: el.querySelector('.project-rating span').textContent,
            tags: Array.from(el.querySelectorAll('.tag')).map(t => t.textContent),
            image: el.querySelector('img').src
        };
    }

    createProjectModalHTML(project) {
        return `
            <div class="project-modal-content">
                <h2 class="modal-title">${project.title}</h2>
                <div class="project-slider"><div class="slider-main"><img src="${project.image}" alt="${project.title}" id="mainImage" loading="lazy" width="800" height="600"></div></div>
                <div class="project-details">
                    <div class="details-grid">
                        <div class="detail-item"><i class="fas fa-map-marker-alt"></i><div><h5>الموقع</h5><p>${project.location}</p></div></div>
                        <div class="detail-item"><i class="fas fa-ruler-combined"></i><div><h5>المساحة</h5><p>${project.area}</p></div></div>
                        <div class="detail-item"><i class="fas fa-calendar-alt"></i><div><h5>سنة التنفيذ</h5><p>${project.year}</p></div></div>
                        <div class="detail-item"><i class="fas fa-star"></i><div><h5>التقييم</h5><p>${project.rating}</p></div></div>
                    </div>
                    <div class="project-description-full"><h4>وصف المشروع</h4><p>${project.description}</p></div>
                    <div class="project-tags">${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                    <div class="modal-actions"><button class="inquire-btn" onclick="portfolioManager.openInquiryModal(${project.id})"><i class="fas fa-comment"></i> استفسر</button></div>
                </div>
            </div>
        `;
    }

    setupProjectSlider() {
        const mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.style.opacity = '0';
            setTimeout(() => mainImage.style.opacity = '1', 10);
        }
    }

    setupInquiryButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.inquire-btn');
            if (btn && btn.dataset.project) this.openInquiryModal(btn.dataset.project);
        });
    }

    openInquiryModal(projectId) {
        const modal = document.getElementById('inquiryModal');
        const form = document.getElementById('inquiryForm');
        form.querySelector('#inquiryProjectId').value = projectId;
        const projectEl = document.querySelector(`.portfolio-item[data-id="${projectId}"]`);
        if (projectEl) {
            const typeSelect = form.querySelector('#inquiryType');
            const category = projectEl.dataset.category;
            if (category) typeSelect.value = category;
        }
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    setupModals() {
        const modals = document.querySelectorAll('.project-modal, .inquiry-modal');
        const closeButtons = document.querySelectorAll('.modal-close, .modal-overlay');
        closeButtons.forEach(btn => {
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
        const whatsappBtn = document.getElementById('whatsappInquiry');
        if (form) form.addEventListener('submit', (e) => { e.preventDefault(); this.submitInquiryForm(form); });
        if (whatsappBtn) whatsappBtn.addEventListener('click', () => this.submitViaWhatsApp(form));
    }

    submitInquiryForm(form) {
        const data = {
            projectId: form.querySelector('#inquiryProjectId').value,
            name: form.querySelector('#inquiryName').value.trim(),
            phone: form.querySelector('#inquiryPhone').value.trim(),
            type: form.querySelector('#inquiryType').value,
            message: form.querySelector('#inquiryMessage').value.trim()
        };
        if (!this.validateInquiryForm(data)) return;
        this.showNotification('تم إرسال استفسارك بنجاح! سنتواصل معك خلال 24 ساعة عمل.', 'success');
        document.getElementById('inquiryModal').style.display = 'none';
        form.reset();
        document.body.style.overflow = 'auto';
        this.saveInquiry(data);
    }

    validateInquiryForm(data) {
        if (!data.name || data.name.length < 2) {
            this.showNotification('يرجى إدخال اسم صحيح', 'error');
            return false;
        }
        if (!data.phone || !/^(05|5|9665|\+9665)[0-9]{8}$/.test(data.phone)) {
            this.showNotification('يرجى إدخال رقم جوال سعودي صحيح', 'error');
            return false;
        }
        return true;
    }

    submitViaWhatsApp(form) {
        const phone = form.querySelector('#inquiryPhone').value.trim();
        const name = form.querySelector('#inquiryName').value.trim();
        const type = form.querySelector('#inquiryType').value;
        const message = form.querySelector('#inquiryMessage').value.trim();
        if (!phone || !/^(05|5|9665|\+9665)[0-9]{8}$/.test(phone)) {
            this.showNotification('يرجى إدخال رقم جوال سعودي صحيح أولاً', 'error');
            return;
        }
        if (!name) {
            this.showNotification('يرجى إدخال اسمك أولاً', 'error');
            return;
        }
        const projectId = form.querySelector('#inquiryProjectId').value;
        const projectEl = document.querySelector(`.portfolio-item[data-id="${projectId}"]`);
        const projectTitle = projectEl ? projectEl.querySelector('h3').textContent : 'مشروع جديد';
        const text = `مرحباً، أنا ${name} أود الاستفسار عن مشروع ${type} ${projectTitle ? `المشروع المرجعي: ${projectTitle}` : ''} ${message ? `التفاصيل: ${message}` : ''} رقم الجوال: ${phone}`;
        window.open(`https://wa.me/966535544019?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    }

    saveInquiry(inquiry) {
        const inquiries = JSON.parse(localStorage.getItem('portfolioInquiries') || '[]');
        inquiries.push(inquiry);
        localStorage.setItem('portfolioInquiries', JSON.stringify(inquiries.slice(-50)));
    }

    setupLoadMore() {
        const btn = document.querySelector('.load-more-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
                btn.disabled = true;
                setTimeout(() => {
                    this.showNotification('سيتم إضافة المزيد من المشاريع قريباً', 'info');
                    btn.innerHTML = '<i class="fas fa-plus"></i> عرض المزيد من المشاريع';
                    btn.disabled = false;
                }, 1500);
            });
        }
    }

    showNotification(message, type = 'info') {
        const notif = document.createElement('div');
        notif.className = `notification notification-${type}`;
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        notif.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span><button class="notification-close">×</button>`;
        notif.style.cssText = `
            position: fixed; top: 100px; left: 50%; transform: translateX(-50%) translateY(-20px);
            background: ${type === 'error' ? '#fee' : type === 'success' ? '#efe' : type === 'warning' ? '#ffeaa7' : '#e8f4fd'};
            color: ${type === 'error' ? '#c0392b' : type === 'success' ? '#27ae60' : type === 'warning' ? '#e17055' : '#0a58ca'};
            padding: 15px 25px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            display: flex; align-items: center; gap: 15px; z-index: 9999; opacity: 0;
            transition: all 0.3s ease; border-right: 4px solid ${this.getNotificationColor(type)};
            font-family: 'Cairo', sans-serif; min-width: 300px; max-width: 90vw; font-weight: 500;
        `;
        document.body.appendChild(notif);
        setTimeout(() => { notif.style.opacity = '1'; notif.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
        notif.querySelector('.notification-close').addEventListener('click', () => this.closeNotification(notif));
        setTimeout(() => this.closeNotification(notif), 5000);
    }

    getNotificationColor(type) {
        const colors = { success: '#27ae60', error: '#c0392b', warning: '#e17055', info: '#0a58ca' };
        return colors[type] || colors.info;
    }

    closeNotification(notif) {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notif.parentNode?.removeChild(notif), 300);
    }
}

// ===== إدارة القائمة للجوال =====
class MobileMenu {
    constructor() {
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        if (!this.menuBtn || !this.navMenu) return;
        this.menuBtn.addEventListener('click', () => this.toggleMenu());
        this.navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => this.closeMenu()));
        window.addEventListener('scroll', () => this.closeMenu());
    }

    toggleMenu() {
        this.menuBtn.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.menuBtn.setAttribute('aria-expanded', this.menuBtn.classList.contains('active'));
        document.body.style.overflow = this.menuBtn.classList.contains('active') ? 'hidden' : 'auto';
    }

    closeMenu() {
        this.menuBtn.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
    }
}

// ===== إدارة البحث =====
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchBtn = document.querySelector('.search-submit-btn');
        this.init();
    }

    init() {
        if (this.searchBtn) this.searchBtn.addEventListener('click', () => this.performSearch());
        if (this.searchInput) this.searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.performSearch(); });
    }

    performSearch() {
        const query = this.searchInput?.value.trim();
        if (query) {
            localStorage.setItem('lastSearch', query);
            this.addToSearchHistory(query);
            this.showSearchResults(query);
        } else if (window.portfolioManager) {
            window.portfolioManager.showNotification('يرجى كتابة ما تريد البحث عنه', 'warning');
            this.searchInput?.focus();
        }
    }

    showSearchResults(query) {
        console.log('بحث عن:', query);
        if (window.portfolioManager) window.portfolioManager.showNotification(`جارٍ البحث عن: "${query}"`, 'info');
    }

    addToSearchHistory(query) {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        history.unshift({ query, timestamp: new Date().toISOString() });
        localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
    }
}

// ===== إدارة أحياء جدة =====
class JeddahDistricts {
    constructor() {
        this.buttons = document.querySelectorAll('.explore-district');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => this.exploreDistrict(btn.dataset.area));
        });
    }

    exploreDistrict(district) {
        const info = {
            north: { title: 'شمال جدة', desc: 'مناطق ساحلية تحتاج لديكور مقاوم للرطوبة والعفن.' },
            central: { title: 'وسط جدة', desc: 'مناطق حيوية تحتاج لديكور عملي وأنيق.' },
            south: { title: 'جنوب جدة', desc: 'مناطق سكنية هادئة تناسب الديكور العائلي.' },
            historical: { title: 'جدة التاريخية', desc: 'الحفاظ على التراث مع لمسات عصرية.' }
        }[district];
        if (!info) return;
        if (window.portfolioManager) window.portfolioManager.showNotification(`جاري تحميل أفكار ديكور لـ ${info.title}...`, 'info');
        setTimeout(() => {
            if (window.portfolioManager) window.portfolioManager.showNotification(`تم تحميل أفكار ديكور للحي المحدد`, 'success');
        }, 1500);
    }
}

// ===== إدارة النشرة البريدية =====
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
        if (!this.validateEmail(email)) {
            this.showError('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        input.disabled = true;
        const btn = this.form.querySelector('button');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        setTimeout(() => {
            this.saveSubscription(email);
            this.showSuccess('تم الاشتراك بنجاح! سيصلك آخر أخبار ديكور جدة.');
            input.value = '';
            input.disabled = false;
            btn.innerHTML = original;
        }, 1500);
    }

    validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

    saveSubscription(email) {
        const subs = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        if (!subs.some(s => s.email === email)) {
            subs.push({ email, date: new Date().toISOString(), source: 'website' });
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subs));
        }
    }

    showError(msg) { if (window.portfolioManager) window.portfolioManager.showNotification(msg, 'error'); }
    showSuccess(msg) { if (window.portfolioManager) window.portfolioManager.showNotification(msg, 'success'); }
}

// ===== تهيئة الموقع =====
document.addEventListener('DOMContentLoaded', function() {
    // فقط إذا لم نكن على الجوال، أو دائماً ننشئ الكلاسات
    const themeManager = new ThemeManager();
    const progressBar = new ProgressBar(); // شريط التقدم يتم التحكم به عبر الـ scroll المحسن
    const heroSlider = new HeroSlider();
    const portfolioManager = new PortfolioManager();
    const mobileMenu = new MobileMenu();
    const searchManager = new SearchManager();
    const jeddahDistricts = new JeddahDistricts();
    const newsletterManager = new NewsletterManager();
    
    window.portfolioManager = portfolioManager;
    
    // أحداث إضافية
    initScrollEvents();
    initFloatingButtons();
    initLazyLoading();
    initPerformanceMonitoring();
    
    console.log('✅ موقع ديكور آرت جدة تم تحميله بنجاح!');
});

// ===== أحداث التمرير =====
function initScrollEvents() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (header) header.classList.toggle('scrolled', window.scrollY > 100);
    });
}

// ===== أزرار التعويم =====
function initFloatingButtons() {
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    // hover effects
    document.querySelectorAll('.float-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.1) translateY(-5px)'; });
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('scroll-top-btn') || window.scrollY <= 500) {
                this.style.transform = 'scale(1) translateY(0)';
            }
        });
    });
}

// ===== تحميل كسول للصور =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
}

// ===== مراقبة الأداء =====
function initPerformanceMonitoring() {
    window.addEventListener('load', () => {
        const perf = window.performance.timing;
        const loadTime = perf.loadEventEnd - perf.navigationStart;
        console.log(loadTime < 3000 ? `✅ وقت تحميل الموقع: ${loadTime}ms (ممتاز)` :
                    loadTime < 5000 ? `⚠️ وقت تحميل الموقع: ${loadTime}ms (جيد)` :
                    `🚨 وقت تحميل الموقع: ${loadTime}ms (يحتاج تحسين)`);
    });
}

// تحميل الخلفيات بال lazy loading
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-bg]').forEach(el => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.style.backgroundImage = `url(${el.dataset.bg})`;
                    observer.unobserve(el);
                }
            });
        });
        observer.observe(el);
    });
});
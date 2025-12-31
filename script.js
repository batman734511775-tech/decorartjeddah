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

// ===== إدارة شريط التقدم =====
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
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        this.progressBar.style.width = `${progress}%`;
        
        const scrollTopBtn = document.querySelector('.scroll-top-btn');
        if (scrollTopBtn) {
            scrollTopBtn.style.display = scrolled > 500 ? 'flex' : 'none';
        }
    }
}

// ===== إدارة السلايدر المصحح =====
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
        
        // عرض الشريحة الأولى
        this.showSlide(this.currentSlide);
        
        // تصحيح أسماء الأزرار للغة العربية
        // prev-slide هو الزر الأيسر (للتقدم للأمام)
        // next-slide هو الزر الأيمن (للرجوع للخلف)
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.nextSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.prevSlide());
        
        // إضافة أحداث المؤشرات
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // بدء التشغيل التلقائي
        this.startAutoSlide();
        
        // إيقاف التشغيل التلقائي عند التمرير
        this.setupPauseOnHover();
        
        // دعم اللمس للجوال
        this.setupTouchEvents();
    }

    showSlide(index) {
        // التأكد من أن الفهرس ضمن النطاق
        if (index >= this.slides.length) index = 0;
        if (index < 0) index = this.slides.length - 1;
        
        // إخفاء جميع الشرائح
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // إزالة النشاط من جميع المؤشرات
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // عرض الشريحة الحالية
        this.currentSlide = index;
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
        this.resetAutoSlide();
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
        this.resetAutoSlide();
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoSlide();
    }

    startAutoSlide() {
        // تبديل تلقائي كل 5 ثواني
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    resetAutoSlide() {
        clearInterval(this.slideInterval);
        this.startAutoSlide();
    }

    setupPauseOnHover() {
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(this.slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }
    }

    setupTouchEvents() {
        const sliderContainer = document.querySelector('.slider-container');
        if (!sliderContainer) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        // تصحيح السحب للغة العربية
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide(); // سحب لليسار (يتقدم)
            } else {
                this.prevSlide(); // سحب لليمين (يرجع)
            }
        }
    }
}

// ===== إدارة معرض الأعمال =====
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
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentFilter = button.dataset.filter;
                this.filterProjects();
            });
        });
    }

    filterProjects() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = this.currentFilter === 'all' || category === this.currentFilter;
            
            if (shouldShow) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    setupLikeButtons() {
        document.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) {
                this.handleLike(likeBtn);
            }
        });
    }

    handleLike(likeBtn) {
        const likeCount = likeBtn.querySelector('.like-count');
        let count = parseInt(likeCount.textContent);
        
        if (likeBtn.classList.contains('liked')) {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<i class="far fa-heart"></i><span class="like-count">' + (count - 1) + '</span>';
        } else {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<i class="fas fa-heart"></i><span class="like-count">' + (count + 1) + '</span>';
        }
        
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 300);
        
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
            const viewBtn = e.target.closest('.quick-view-btn, .details-btn');
            if (viewBtn) {
                const projectId = viewBtn.closest('.portfolio-item').dataset.id;
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
        const projectElement = document.querySelector(`.portfolio-item[data-id="${projectId}"]`);
        if (!projectElement) return null;
        
        return {
            id: projectId,
            title: projectElement.querySelector('h3').textContent,
            description: projectElement.querySelector('.project-description').textContent,
            location: projectElement.querySelector('[itemprop="location"]').textContent,
            area: projectElement.querySelector('[itemprop="size"]').textContent,
            year: projectElement.querySelector('[itemprop="dateCreated"]').textContent,
            rating: projectElement.querySelector('[itemprop="ratingValue"]').textContent,
            tags: Array.from(projectElement.querySelectorAll('.tag')).map(tag => tag.textContent),
            image: projectElement.querySelector('img').src
        };
    }

    createProjectModalHTML(project) {
        return `
            <div class="project-modal-content">
                <h2 class="modal-title">${project.title}</h2>
                
                <div class="project-slider">
                    <div class="slider-main">
                        <img src="${project.image}" alt="${project.title}" id="mainImage" loading="lazy" width="800" height="600">
                    </div>
                </div>
                
                <div class="project-details">
                    <div class="details-grid">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <h5>الموقع</h5>
                                <p>${project.location}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-ruler-combined"></i>
                            <div>
                                <h5>المساحة</h5>
                                <p>${project.area}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <div>
                                <h5>سنة التنفيذ</h5>
                                <p>${project.year}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-star"></i>
                            <div>
                                <h5>التقييم</h5>
                                <p>${project.rating} / 5</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-description-full">
                        <h4>وصف المشروع</h4>
                        <p>${project.description}</p>
                    </div>
                    
                    <div class="project-tags">
                        ${project.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    
                    <div class="modal-actions">
                        <button class="inquire-btn" onclick="portfolioManager.openInquiryModal(${project.id})">
                            <i class="fas fa-comment"></i> استفسر عن مشروع مماثل
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupProjectSlider() {
        const mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 10);
        }
    }

    setupInquiryButtons() {
        document.addEventListener('click', (e) => {
            const inquireBtn = e.target.closest('.inquire-btn');
            if (inquireBtn && inquireBtn.dataset.project) {
                this.openInquiryModal(inquireBtn.dataset.project);
            }
        });
    }

    openInquiryModal(projectId) {
        const modal = document.getElementById('inquiryModal');
        const form = document.getElementById('inquiryForm');
        
        form.querySelector('#inquiryProjectId').value = projectId;
        
        const projectElement = document.querySelector(`.portfolio-item[data-id="${projectId}"]`);
        if (projectElement) {
            const typeSelect = form.querySelector('#inquiryType');
            const category = projectElement.dataset.category;
            if (category) {
                typeSelect.value = category;
            }
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    setupModals() {
        const modals = document.querySelectorAll('.project-modal, .inquiry-modal');
        const closeButtons = document.querySelectorAll('.modal-close, .modal-overlay');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
                document.body.style.overflow = 'auto';
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
                document.body.style.overflow = 'auto';
            }
        });
    }

    setupInquiryForm() {
        const form = document.getElementById('inquiryForm');
        const whatsappBtn = document.getElementById('whatsappInquiry');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitInquiryForm(form);
            });
        }
        
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                this.submitViaWhatsApp(form);
            });
        }
    }

    submitInquiryForm(form) {
        const formData = {
            projectId: form.querySelector('#inquiryProjectId').value,
            name: form.querySelector('#inquiryName').value.trim(),
            phone: form.querySelector('#inquiryPhone').value.trim(),
            type: form.querySelector('#inquiryType').value,
            message: form.querySelector('#inquiryMessage').value.trim(),
            date: new Date().toISOString()
        };
        
        if (!this.validateInquiryForm(formData)) {
            return;
        }
        
        this.showNotification('تم إرسال استفسارك بنجاح! سنتواصل معك خلال 24 ساعة عمل.', 'success');
        document.getElementById('inquiryModal').style.display = 'none';
        form.reset();
        document.body.style.overflow = 'auto';
        this.saveInquiry(formData);
    }

    validateInquiryForm(data) {
        if (!data.name || data.name.length < 2) {
            this.showNotification('يرجى إدخال اسم صحيح (على الأقل حرفين)', 'error');
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
        const projectElement = document.querySelector(`.portfolio-item[data-id="${projectId}"]`);
        const projectTitle = projectElement ? projectElement.querySelector('h3').textContent : 'مشروع جديد';
        
        const whatsappMessage = `مرحباً، أنا ${name}
أود الاستفسار عن مشروع ${type}
${projectTitle ? `المشروع المرجعي: ${projectTitle}` : ''}
${message ? `التفاصيل الإضافية:\n${message}` : ''}
رقم الجوال: ${phone}`;

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/966535544019?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    saveInquiry(inquiry) {
        const inquiries = JSON.parse(localStorage.getItem('portfolioInquiries') || '[]');
        inquiries.push(inquiry);
        localStorage.setItem('portfolioInquiries', JSON.stringify(inquiries.slice(-50)));
    }

    setupLoadMore() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProjects();
            });
        }
    }

    loadMoreProjects() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            this.showNotification('سيتم إضافة المزيد من المشاريع قريباً', 'info');
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> عرض المزيد من المشاريع';
            loadMoreBtn.disabled = false;
        }, 1500);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <span>${icons[type] || icons.info}</span>
            <span>${message}</span>
            <button class="notification-close">×</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: ${type === 'error' ? '#fee' : type === 'success' ? '#efe' : type === 'warning' ? '#ffeaa7' : '#e8f4fd'};
            color: ${type === 'error' ? '#c0392b' : type === 'success' ? '#27ae60' : type === 'warning' ? '#e17055' : '#0a58ca'};
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
            border-right: 4px solid ${this.getNotificationColor(type)};
            font-family: 'Cairo', sans-serif;
            min-width: 300px;
            max-width: 90vw;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(notification);
        });
        
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#c0392b',
            warning: '#e17055',
            info: '#0a58ca'
        };
        return colors[type] || colors.info;
    }

    closeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
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
        
        const navLinks = this.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
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
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }
        
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
    }

    performSearch() {
        const query = this.searchInput ? this.searchInput.value.trim() : '';
        
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
        if (window.portfolioManager) {
            window.portfolioManager.showNotification(`جارٍ البحث عن: "${query}"`, 'info');
        }
    }

    addToSearchHistory(query) {
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const timestamp = new Date().toISOString();
        
        searchHistory.unshift({ query, timestamp });
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 10)));
    }
}

// ===== إدارة أحياء جدة =====
class JeddahDistricts {
    constructor() {
        this.districtButtons = document.querySelectorAll('.explore-district');
        this.init();
    }

    init() {
        this.districtButtons.forEach(button => {
            button.addEventListener('click', () => {
                const district = button.dataset.area;
                this.exploreDistrict(district);
            });
        });
    }

    exploreDistrict(district) {
        const districtsInfo = {
            north: {
                title: 'شمال جدة',
                description: 'مناطق ساحلية تحتاج لديكور مقاوم للرطوبة والعفن.'
            },
            central: {
                title: 'وسط جدة',
                description: 'مناطق حيوية تحتاج لديكور عملي وأنيق.'
            },
            south: {
                title: 'جنوب جدة',
                description: 'مناطق سكنية هادئة تناسب الديكور العائلي.'
            },
            historical: {
                title: 'جدة التاريخية',
                description: 'الحفاظ على التراث مع لمسات عصرية.'
            }
        };
        
        const info = districtsInfo[district];
        if (!info) return;
        
        if (window.portfolioManager) {
            window.portfolioManager.showNotification(`جاري تحميل أفكار ديكور لـ ${info.title}...`, 'info');
        }
        
        this.loadDistrictProjects(district);
    }

    loadDistrictProjects(district) {
        setTimeout(() => {
            if (window.portfolioManager) {
                window.portfolioManager.showNotification(`تم تحميل أفكار ديكور للحي المحدد`, 'success');
            }
        }, 1500);
    }
}

// ===== إدارة النشرة البريدية =====
class NewsletterManager {
    constructor() {
        this.newsletterForm = document.querySelector('.newsletter-form');
        this.init();
    }

    init() {
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.subscribe();
            });
        }
    }

    subscribe() {
        const emailInput = this.newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showError('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        
        emailInput.disabled = true;
        const submitBtn = this.newsletterForm.querySelector('button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            this.saveSubscription(email);
            this.showSuccess('تم الاشتراك بنجاح! سيصلك آخر أخبار ديكور جدة.');
            emailInput.value = '';
            emailInput.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    saveSubscription(email) {
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        const subscription = {
            email: email,
            date: new Date().toISOString(),
            source: 'website'
        };
        
        if (!subscriptions.some(sub => sub.email === email)) {
            subscriptions.push(subscription);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        }
    }

    showError(message) {
        if (window.portfolioManager) {
            window.portfolioManager.showNotification(message, 'error');
        }
    }

    showSuccess(message) {
        if (window.portfolioManager) {
            window.portfolioManager.showNotification(message, 'success');
        }
    }
}

// ===== تهيئة الموقع عند التحميل =====
document.addEventListener('DOMContentLoaded', function() {
    const themeManager = new ThemeManager();
    const progressBar = new ProgressBar();
    const heroSlider = new HeroSlider();
    const portfolioManager = new PortfolioManager();
    const mobileMenu = new MobileMenu();
    const searchManager = new SearchManager();
    const jeddahDistricts = new JeddahDistricts();
    const newsletterManager = new NewsletterManager();
    
    window.portfolioManager = portfolioManager;
    
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
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== أزرار التعويم =====
function initFloatingButtons() {
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    const floatButtons = document.querySelectorAll('.float-btn');
    floatButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-5px)';
        });
        
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
        const imageObserver = new IntersectionObserver((entries, observer) => {
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
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== مراقبة الأداء =====
function initPerformanceMonitoring() {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        if (loadTime < 3000) {
            console.log(`✅ وقت تحميل الموقع: ${loadTime}ms (ممتاز)`);
        } else if (loadTime < 5000) {
            console.log(`⚠️ وقت تحميل الموقع: ${loadTime}ms (جيد)`);
        } else {
            console.log(`🚨 وقت تحميل الموقع: ${loadTime}ms (يحتاج تحسين)`);
        }
    });
}
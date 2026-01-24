const fs = require('fs');
const path = require('path');

// تحميل بيانات المناطق
const neighborhoodsData = require('./neighborhoods-data.js');

// قراءة القالب
const templatePath = path.join(__dirname, 'template-neighborhood.html');
const template = fs.readFileSync(templatePath, 'utf8');

// إنشاء مجلد neighborhoods إذا لم يكن موجوداً
const neighborhoodsDir = path.join(__dirname, 'neighborhoods');
if (!fs.existsSync(neighborhoodsDir)) {
    fs.mkdirSync(neighborhoodsDir, { recursive: true });
    console.log('📁 تم إنشاء مجلد neighborhoods/');
}

console.log('🚀 بدء توليد صفحات المناطق...\n');

// توليد كل صفحة
Object.values(neighborhoodsData).forEach(neighborhood => {
    console.log(`🔨 جاري إنشاء: ${neighborhood.name}`);
    
    let pageContent = template;
    
    // استبدال المتغيرات
    const replacements = {
        // SEO متغيرات
        '{PAGE_TITLE}': neighborhood.pageTitle,
        '{META_DESCRIPTION}': neighborhood.metaDescription,
        '{CANONICAL_URL}': `https://decorartjeddah.vercel.app/neighborhoods/${neighborhood.id}.html`,
        '{OG_TITLE}': `ديكور وتصميم داخلي في ${neighborhood.name}`,
        '{OG_DESCRIPTION}': neighborhood.metaDescription.substring(0, 160),
        '{OG_IMAGE}': neighborhood.ogImage,
        
        // Structured Data
        '{SERVICE_NAME}': `ديكور وتصميم داخلي في ${neighborhood.name}`,
        '{SERVICE_DESCRIPTION}': `خدمات تصميم ديكور متخصصة في ${neighborhood.name} جدة`,
        '{PLACE_TYPE}': neighborhood.type,
        '{NEIGHBORHOOD_NAME}': neighborhood.name,
        '{NEIGHBORHOOD_SCHEMA_DESC}': `منطقة ${neighborhood.name} في مدينة جدة`,
        
        // المحتوى
        '{HERO_TITLE}': neighborhood.heroTitle,
        '{HERO_SUBTITLE}': neighborhood.heroSubtitle,
        '{INTRODUCTION_PARAGRAPH}': neighborhood.introduction,
        
        // المميزات
        '{FEATURES_LIST}': neighborhood.features.map(feature => {
            const parts = feature.split(':');
            if (parts.length > 1) {
                return `<li><i class="fas fa-check"></i> <strong>${parts[0]}:</strong> ${parts.slice(1).join(':')}</li>`;
            }
            return `<li><i class="fas fa-check"></i> ${feature}</li>`;
        }).join('\n'),
        
        // المشاريع
        '{PROJECTS_INTRO}': neighborhood.projectsIntro,
        '{PROJECTS_CARDS}': neighborhood.projects.map(project => `
            <div class="project-card">
                <h4>${project.title}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${project.location}</p>
                <p><i class="fas fa-ruler-combined"></i> ${project.size}</p>
                <p>${project.description}</p>
            </div>
        `).join('\n'),
        
        // الكلمات المفتاحية
        '{KEYWORDS_LIST}': neighborhood.keywords,
        
        // النصائح المحلية
        '{LOCAL_TIPS}': neighborhood.tips.map(tip => `
            <div class="tip-card">
                <i class="${tip.icon}"></i>
                <p>${tip.text}</p>
            </div>
        `).join('\n'),
        
        // المناطق الفرعية
        '{AREAS_LIST}': neighborhood.areas.map(area => 
            `<li>${area}</li>`
        ).join('\n'),
        
        // الصور
        '{BACKGROUND_IMAGE}': neighborhood.backgroundImage,
        
        // الاسم في عدة أماكن
        '{NEIGHBORHOOD_NAME}': neighborhood.name
    };
    
    // تطبيق جميع الاستبدالات
    Object.entries(replacements).forEach(([key, value]) => {
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        pageContent = pageContent.replace(regex, value);
    });
    
    // حفظ الملف
    const filePath = path.join(neighborhoodsDir, `${neighborhood.id}.html`);
    fs.writeFileSync(filePath, pageContent, 'utf8');
    
    console.log(`   ✅ تم إنشاء: ${filePath}`);
});

console.log('\n🎉 تم إنشاء جميع الصفحات بنجاح!');
console.log('📁 الصفحات موجودة في: neighborhoods/');
console.log('\n📋 الصفحات المنشورة:');
console.log('   • neighborhoods/rawdah.html      - ديكور حي الروضة');
console.log('   • neighborhoods/corniche.html    - ديكور الكورنيش');
console.log('   • neighborhoods/naseem.html      - ديكور حي النعيم');
console.log('   • neighborhoods/historical.html  - جدة التاريخية');
console.log('\n🚀 الخطوة التالية:');
console.log('   1. رفع مجلد neighborhoods/ إلى استضافتك');
console.log('   2. إضافة صور الخلفيات في images/neighborhoods/');
console.log('   3. تحديث الروابط في index.html للربط بالصفحات الجديدة');
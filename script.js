// ============== TOGGLE THEME ==============
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ============== LOAD SAVED THEME ==============
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// ============== EXPANDABLE NAVIGATION ==============
const navItems = document.querySelectorAll('.nav-item');
const navSubitems = document.querySelectorAll('.nav-subitem');

// Toggle подразделов при клике на главу
navItems.forEach(item => {
    if (item.classList.contains('has-subitems')) {
        item.addEventListener('click', function(e) {
            // Предотвращаем скролл при клике на главу
            if (e.target === this) {
                const sublist = this.querySelector('.nav-sublist');
                if (sublist) {
                    this.classList.toggle('expanded');
                    sublist.classList.toggle('expanded');
                }
            }
        });
    } else {
        // Обычная навигация для глав без подразделов
        item.addEventListener('click', function() {
            // Убираем active со всех пунктов
            navItems.forEach(nav => nav.classList.remove('active'));
            navSubitems.forEach(nav => nav.classList.remove('active'));
            
            // Добавляем active текущему
            this.classList.add('active');
            
            const targetId = this.getAttribute('data-target');
            scrollToSection(targetId);
        });
    }
});

// Навигация при клике на подраздел
navSubitems.forEach(subitem => {
    subitem.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Убираем active со всех пунктов
        navItems.forEach(nav => nav.classList.remove('active'));
        navSubitems.forEach(nav => nav.classList.remove('active'));
        
        // Добавляем active текущему подразделу
        this.classList.add('active');
        
        const targetId = this.getAttribute('data-target');
        scrollToSection(targetId);
    });
});

// Функция плавного скролла к секции
function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============== AUTO-HIGHLIGHT НА СКРОЛЛЕ ==============
let isScrolling = false;

window.addEventListener('scroll', () => {
    if (isScrolling) return;
    isScrolling = true;
    
    setTimeout(() => {
        updateActiveSection();
        isScrolling = false;
    }, 100);
});

function updateActiveSection() {
    const sections = document.querySelectorAll('[id^="ch"]');
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section.id;
        }
    });
    
    if (currentSection) {
        // Убираем активность со всех
        navItems.forEach(item => item.classList.remove('active'));
        navSubitems.forEach(item => item.classList.remove('active'));
        
        // Добавляем активность нужному подразделу
        const activeSubitem = document.querySelector(`.nav-subitem[data-target="${currentSection}"]`);
        if (activeSubitem) {
            activeSubitem.classList.add('active');
            
            // Автоматически раскрываем родительскую главу
            const parentList = activeSubitem.closest('.nav-sublist');
            const parentItem = parentList ? parentList.previousElementSibling : null;
            
            if (parentItem && parentItem.classList.contains('has-subitems')) {
                if (!parentList.classList.contains('expanded')) {
                    parentItem.classList.add('expanded');
                    parentList.classList.add('expanded');
                }
            }
        } else {
            // Если это глава без подразделов
            const activeItem = document.querySelector(`.nav-item[data-target="${currentSection}"]`);
            if (activeItem && !activeItem.classList.contains('has-subitems')) {
                activeItem.classList.add('active');
            }
        }
    }
}

// Инициализация при загрузке
window.addEventListener('DOMContentLoaded', () => {
    updateActiveSection();
});

// ============== SEARCH FUNCTIONALITY ==============
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    navItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        
        if (text.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    if (query === '') {
        navItems.forEach(item => {
            item.style.display = 'block';
        });
    }
});

// ============== EXPANDABLE NAVIGATION (SCROLL TO CHAPTER) ==============
const navItems = document.querySelectorAll(".nav-item");
const navSubitems = document.querySelectorAll(".nav-subitem");

// Функция удаления класса "active"
function removeActive() {
    const navItems = document.querySelectorAll(".nav-item");
    const navSubitems = document.querySelectorAll(".nav-subitem");
    // Убираем active со всех пунктов
    navItems.forEach((nav) => nav.classList.remove("active"));
    navSubitems.forEach((nav) => nav.classList.remove("active"));
}

// Toggle подразделов при клике на главу
navItems.forEach((item) => {
    if (item.classList.contains("has-subitems")) {
        item.addEventListener("click", function (e) {
            // Предотвращаем скролл при клике на главу
            if (e.target === this) {
                const sublist = this.querySelector(".nav-sublist");
                if (sublist) {
                    this.classList.toggle("expanded");
                    sublist.classList.toggle("expanded");
                }
            }
        });
    } else {
        // Обычная навигация для глав без подразделов
        item.addEventListener("click", function () {
            // Убираем active со всех пунктов
            removeActive();

            // Добавляем active текущему
            this.classList.add("active");

            const targetId = this.getAttribute("data-target");
            scrollToSection(targetId);
        });
    }
});

// Навигация при клике на подраздел
navSubitems.forEach((subitem) => {
    subitem.addEventListener("click", function (e) {
        e.stopPropagation(); // Предотвращаем всплытие к родителю

        // Убираем active со всех пунктов
        removeActive();

        // Добавляем active текущему подразделу
        this.classList.add("active");

        const targetId = this.getAttribute("data-target");
        scrollToSection(targetId);
    });
});

// Функция плавного скролла к секции
function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
}

// ============== AUTO-HIGHLIGHT НА СКРОЛЛЕ ==============
let isScrolling = false;

window.addEventListener("scroll", () => {
    if (isScrolling) return;
    isScrolling = true;

    setTimeout(() => {
        updateActiveSection();
        isScrolling = false;
    }, 50);
});

function updateActiveSection() {
    // Получаем все секции (h2 и h3)
    const sections = document.querySelectorAll('[id^="ch"]');
    console.log("sections: ", sections);
    let currentSection = "";

    sections.forEach((section) => {
        console.log("section: ", section);
        const rect = section.getBoundingClientRect();
        // Если секция в верхней части экрана (с учетом header)
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
        }
    });а

    if (currentSection) {
        console.log("current section: ", currentSection);
        // Убираем активность со всех
        // navItems.forEach(item => item.classList.remove('active'));
        // navSubitems.forEach(item => item.classList.remove('active'));
        removeActive();

        // Добавляем активность нужному подразделу
        const activeSubitem = document.querySelector(
            `.nav-subitem[data-target="${currentSection}"]`
        );
        console.log("active Subitem: ", activeSubitem);
        if (activeSubitem) {
            activeSubitem.classList.add("active");

            // Автоматически раскрываем родительскую главу
            const parentList = activeSubitem.closest(".nav-sublist");
            const parentItem = parentList
                ? parentList.previousElementSibling
                : null;

            if (parentItem && parentItem.classList.contains("has-subitems")) {
                if (!parentList.classList.contains("expanded")) {
                    parentItem.classList.add("expanded");
                    parentList.classList.add("expanded");
                }
            }
        } else {
            // Если это глава без подразделов
            const activeItem = document.querySelector(
                `.nav-item[data-target="${currentSection}"]`
            );
            if (activeItem && !activeItem.classList.contains("has-subitems")) {
                activeItem.classList.add("active");
            }
        }
    }
}

// Инициализация при загрузке
window.addEventListener("DOMContentLoaded", () => {
    updateActiveSection();
});

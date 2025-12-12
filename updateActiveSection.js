function updateActiveSection() {
    // Получаем все секции (h2 и h3)
    const sections = document.querySelectorAll('[id^="ch"]');
    let currentSection = "";
    let bestMatch = null;
    let bestDistance = Infinity;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - 100);

        // Ищем ближайшую к верху экрана секцию
        if (rect.top <= 150 && rect.bottom >= 100) {
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = section;
            }
        }
    });

    // Если нашли секцию
    if (bestMatch) {
        currentSection = bestMatch.id;
        console.log("current section: ", currentSection);

        // Убираем активность со всех
        removeActive();

        // Сначала проверяем, есть ли подраздел с таким ID
        const activeSubitem = document.querySelector(
            `.nav-subitem[data-target="${currentSection}"]`
        );

        if (activeSubitem) {
            // Это подраздел - подсвечиваем его
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
            // Это глава - проверяем, есть ли у неё подразделы
            const activeItem = document.querySelector(
                `.nav-item[data-target="${currentSection}"]`
            );

            if (activeItem) {
                if (activeItem.classList.contains("has-subitems")) {
                    // У главы есть подразделы - раскрываем меню, но НЕ подсвечиваем саму главу
                    const sublist = activeItem.querySelector(".nav-sublist");
                    if (sublist && !sublist.classList.contains("expanded")) {
                        activeItem.classList.add("expanded");
                        sublist.classList.add("expanded");
                    }

                    // Пытаемся найти первый видимый подраздел
                    const firstVisibleSubitem =
                        findFirstVisibleSubitem(currentSection);
                    if (firstVisibleSubitem) {
                        const firstSubitemNav = document.querySelector(
                            `.nav-subitem[data-target="${firstVisibleSubitem}"]`
                        );
                        if (firstSubitemNav) {
                            firstSubitemNav.classList.add("active");
                        }
                    }
                } else {
                    // Обычная глава без подразделов
                    activeItem.classList.add("active");
                }
            }
        }
    }
}

// Вспомогательная функция для поиска первого видимого подраздела
function findFirstVisibleSubitem(chapterId) {
    // Ищем все h2/h3 внутри главы с id=chapterId
    const chapterElement = document.getElementById(chapterId);
    if (!chapterElement) return null;

    const subitems = chapterElement.querySelectorAll(
        '[id^="' + chapterId + '-"]'
    );

    for (let subitem of subitems) {
        const rect = subitem.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 100) {
            return subitem.id;
        }
    }

    return null;
}

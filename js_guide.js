    // <script>
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

        // ============== EXPANDABLE NAVIGATION (SCROLL TO CHAPTER) ==============
        const navItems = document.querySelectorAll('.nav-item');
        const navSubitems = document.querySelectorAll('.nav-subitem');

        // Функция удаления класса "active"
        function removeActive() {
            const navItems = document.querySelectorAll('.nav-item');
            const navSubitems = document.querySelectorAll('.nav-subitem');
            // Убираем active со всех пунктов
            navItems.forEach(nav => nav.classList.remove('active'));
            navSubitems.forEach(nav => nav.classList.remove('active'));
        }

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
                    removeActive();

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
                e.stopPropagation(); // Предотвращаем всплытие к родителю

                // Убираем active со всех пунктов
                removeActive();
                
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
                

                /* При данном переходе заголовок главы прячется под header
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                */
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
            }, 50);
        });
        
        function updateActiveSection() {
            // Получаем все секции (h2 и h3)
            const sections = document.querySelectorAll('[id^="ch"]');
            // console.log("sections: ", sections);
            let currentSection = '';
            let bestMatch = null;
            let bestDistance = Infinity; 
            
            sections.forEach(section => {
                // console.log("section: ", section);
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top - 100);

                // Если секция в верхней части экрана (с учетом header)
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
                // Убираем активность со всех
                removeActive();

                // Сначала проверяем, есть ли подраздел с таким ID
                const activeSubitem = document.querySelector(
                    `.nav-subitem[data-target="${currentSection}"]`
                );

                // Добавляем активность нужному подразделу
                if (activeSubitem) {
                    // Это подраздел - подсвечиваем его
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
                    // Это глава - проверяем, есть ли у неё подразделы
                    const activeItem = document.querySelector(`.nav-item[data-target="${currentSection}"]`);

                    if (activeItem && activeItem.classList.contains('has-subitems')) {
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

        // Вспомогательная функция для поиска первого видимого подраздела
        function findFirstVisibleSubitem(chapterId) {
            // Ищем все h2/h3 внутри главы с id=chapterId
            const chapterElement = document.getElementById(chapterId);
            // console.log("chapter Element: ", chapterElement);
            if (!chapterElement) return null;

            const subitems = chapterElement.querySelectorAll(
                '[id^="' + chapterId + '-"]'
            );


            for (let subitem of subitems) {
                const rect = subitem.getBoundingClientRect();
                // console.log("subItemID: %s, rect.top: %s, rect.bottom: %s", subitem.id, Math.round(rect.top), Math.round(rect.bottom) );
                if (rect.top <= 150 && rect.bottom >= 45) {
                    return subitem.id;
                }
            }

            return null;
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
            
            // Если поиск пустой - показываем все
            if (query === '') {
                navItems.forEach(item => {
                    item.style.display = 'block';
                });
            }
        });

    // </script>

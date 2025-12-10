```html
navItems.forEach(item => {
            item.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Плавный скролл к главе
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Обновляем активное состояние
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
```

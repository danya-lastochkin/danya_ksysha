// ==========================================
// ИДЕНТИФИКАТОР ВАШЕЙ ЯНДЕКС ФОРМЫ (UUID)
// ==========================================
const YANDEX_FORM_ID = '6a58a7faf47e7309d190927c';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Логика плеера
    let isPlaying = false;
    const audio = document.getElementById('weddingMusic');
    const button = document.getElementById('playBtn');
    const icon = document.getElementById('playIcon');

    button.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            button.classList.remove('active');
            icon.innerText = '▶';
        } else {
            audio.play();
            button.classList.add('active');
            icon.innerText = '⏸';
        }
        isPlaying = !isPlaying;
    });

    // 2. Анимации при скролле
    const animatedElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "0px 0px -30px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));
});

// 3. Функция добавления в календарь
function addToCalendar() {
    const year = 2026;
    const month = 7;
    const day = 17;
    const startHour = 17;
    const startMinute = 0;
    const durationHours = 5;

    const startDate = new Date(year, month - 1, day, startHour, startMinute);
    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

    const formatICSDate = (date) => {
        return date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) + 'T' +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            '00';
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding Invite//RU',
        'BEGIN:VEVENT',
        'SUMMARY:Свадьба Невесты и Жениха',
        'LOCATION:Ресторан "Небо", ул. Пушкина, д. 1',
        'DESCRIPTION:Дорогие гости, ждем вас на нашем торжестве!',
        'DTSTART:' + formatICSDate(startDate),
        'DTEND:' + formatICSDate(endDate),
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'svalba_17_07_2026.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 4. Логика RSVP (Подтверждение)
function setRsvp(status) {
    const acceptBtn = document.getElementById('acceptBtn');
    const declineBtn = document.getElementById('declineBtn');
    
    if (status === 'accept') {
        acceptBtn.classList.add('active');
        declineBtn.classList.remove('active');
    } else if (status === 'decline') {
        declineBtn.classList.add('active');
        acceptBtn.classList.remove('active');
    }
}

// 5. Логика выбора напитков (Кнопки)
function toggleDrink(btn) {
    btn.classList.toggle('selected');
}

// 6. ИСПРАВЛЕННАЯ ОТПРАВКА С ДИАГНОСТИКОЙ ОШИБОК
async function submitRsvp() {
    // Получаем все инпуты
    const inputs = document.querySelectorAll('.rsvp-input');
    const nameInput = inputs[0]; // Ваше имя
    const infoInput = inputs[1]; // Дополнительная информация

    const name = nameInput.value.trim();
    const info = infoInput ? infoInput.value.trim() : '';

    // Проверяем статус (Принять / Отклонить)
    const isAccepted = document.getElementById('acceptBtn').classList.contains('active');
    const statusText = isAccepted ? 'Принять' : 'Отклонить';

    // Собираем выбранные напитки
    const selectedDrinks = [];
    document.querySelectorAll('.drink-btn.selected').forEach(btn => {
        selectedDrinks.push(btn.innerText.trim());
    });
    const drinksText = selectedDrinks.length > 0 ? selectedDrinks.join(', ') : 'Не выбрано';

    // Валидация
    if (!name) {
        alert('Пожалуйста, введите ваше имя!');
        return;
    }

    // Формируем данные в порядке вопросов вашей Яндекс Формы
    const data = {
        answers: [
            { text: name },
            { text: statusText },
            { text: drinksText },
            { text: info }
        ]
    };

    try {
        const response = await fetch(`https://forms.yandex.ru/api/forms/${YANDEX_FORM_ID}/responses/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Если сервер ответил ошибкой (например, 400 или 403)
        if (!response.ok) {
            // Пытаемся прочитать, что именно сказал сервер
            const errorText = await response.text();
            console.error('🚨 Ошибка API Яндекса:', response.status, errorText);
            alert(`Ошибка сервера (код ${response.status}). Откройте консоль браузера (F12) и посмотрите ошибку.`);
            return;
        }

        // Если всё хорошо
        alert('Спасибо! Ваш ответ успешно отправлен! Мы очень ждем вас ❤️');
        
        // Сброс полей
        nameInput.value = '';
        if (infoInput) infoInput.value = '';
        document.querySelectorAll('.drink-btn.selected').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('acceptBtn').classList.add('active');
        document.getElementById('declineBtn').classList.remove('active');

    } catch (error) {
        // Если это ошибка сети / CORS
        console.error('🚨 Полная ошибка запроса:', error);
        alert('Ошибка сети или блокировка CORS. Подробности в консоли (F12).');
    }
}

// 7. Логика резервирования подарков
function reserveGift(btn) {
    const item = btn.closest('.gift-item');
    const title = item.querySelector('.gift-title').innerText;
    
    btn.classList.add('reserved');
    btn.innerText = 'Зарезервировано ✓';
    alert(`Вы зарезервировали подарок: ${title}`);
}

// 8. Логика обратного отсчета (Таймер)
function updateCountdown() {
    // Укажите вашу целевую дату: Год, Месяц (0-11), День, Час, Минута
    // Июль = 6 (так как отсчет с 0)
    const targetDate = new Date(2026, 6, 17, 17, 0, 0).getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}

// Запускаем таймер сразу и обновляем каждую секунду
updateCountdown();
setInterval(updateCountdown, 1000);
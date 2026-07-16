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

// 4. Логика резервирования подарков
function reserveGift(btn) {
    const item = btn.closest('.gift-item');
    const title = item.querySelector('.gift-title').innerText;
    
    btn.classList.add('reserved');
    btn.innerText = 'Зарезервировано ✓';
    alert(`Вы зарезервировали подарок: ${title}`);
}

// 5. САМАЯ ПРОСТАЯ ОТПРАВКА (Просто переход на Яндекс Форму)
function submitRsvp() {
    const formUrl = `https://forms.yandex.ru/u/${YANDEX_FORM_ID}/`;
    window.open(formUrl, '_blank');
}

// 6. Логика обратного отсчета (Таймер)
function updateCountdown() {
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

// 7. Навигация по странице (плавный скролл)
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Запускаем таймер сразу и обновляем каждую секунду
updateCountdown();
setInterval(updateCountdown, 1000);

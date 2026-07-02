// ===== ЭЛЕМЕНТЫ ФОРМЫ =====
const form = document.getElementById('rentForm');
const submitBtn = document.getElementById('submitBtn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const agreementCheck = document.getElementById('agreementCheck');

// ===== БЛОКИРОВКА КНОПКИ В ЗАВИСИМОСТИ ОТ ЧЕКБОКСА =====
agreementCheck.addEventListener('change', function() {
    submitBtn.disabled = !this.checked;
});

// ===== ФУНКЦИЯ УВЕДОМЛЕНИЯ =====
function showNotification(message, isError = false) {
    notificationText.textContent = message;
    notification.classList.remove('error');
    if (isError) notification.classList.add('error');
    notification.classList.add('show');
    clearTimeout(window.notificationTimeout);
    window.notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// ===== ОТПРАВКА В TELEGRAM =====
async function sendToTelegram(data) {
    const message = `
🆕 Новая заявка на аренду!

👤 Имя: ${data.name || 'Не указано'}
📞 Телефон: ${data.phone || 'Не указан'}
💻 Модель: ${data.model || 'Не выбрана'}
📅 Срок: ${data.days || 'Не указан'} дн.
💰 Итоговая цена: ${data.totalPrice || '0'} ₽
🎧 Аксессуары: ${data.accessories || 'Нет'}
📝 Комментарий: ${data.comment || 'Нет'}
✅ Согласие на обработку ПД: Да
    `;
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    });
    return response.ok;
}

// ===== ОБРАБОТЧИК ФОРМЫ =====
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Проверка согласия (дополнительная страховка)
    if (!agreementCheck.checked) {
        showNotification('⚠️ Подтвердите согласие на обработку данных!', true);
        return;
    }
    
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const modelSelect = document.getElementById('laptopSelect');
    const modelText = modelSelect.options[modelSelect.selectedIndex]?.text || 'Не выбрано';
    const days = document.getElementById('daysInput').value || '1';
    const comment = document.getElementById('userComment').value.trim();
    const finalPrice = document.getElementById('finalPrice').textContent;
    const accessoryChecks = document.querySelectorAll('.accessory-check:checked');
    const accessories = Array.from(accessoryChecks).map(cb => cb.value).join(', ') || 'Нет';

    if (!name || !phone) {
        showNotification('⚠️ Заполните имя и телефон!', true);
        return;
    }
    if (modelSelect.value === '') {
        showNotification('⚠️ Выберите ноутбук!', true);
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
        const success = await sendToTelegram({
            name, phone, model: modelText, days, totalPrice: finalPrice, accessories, comment
        });
        if (success) {
            showNotification('✅ Заявка успешно отправлена! Менеджер свяжется с вами.');
            form.reset();
            // Сбрасываем чекбокс и блокируем кнопку
            agreementCheck.checked = false;
            submitBtn.disabled = true;
            setTimeout(() => calculatePrice(), 100);
        } else {
            showNotification('❌ Ошибка отправки. Попробуйте позже или позвоните нам.', true);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('❌ Ошибка соединения. Проверьте интернет.', true);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
    }
});
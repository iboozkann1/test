// ===== ИНИЦИАЛИЗАЦИЯ =====
const laptopSelect = document.getElementById('laptopSelect');
const daysInput = document.getElementById('daysInput');
const accessoryChecks = document.querySelectorAll('.accessory-check');
const basePriceEl = document.getElementById('basePrice');
const discountAmountEl = document.getElementById('discountAmount');
const discountRow = document.getElementById('discountRow');
const accessoryTotalEl = document.getElementById('accessoryTotal');
const finalPriceEl = document.getElementById('finalPrice');

// ===== СОБЫТИЯ =====
laptopSelect.addEventListener('change', calculatePrice);
daysInput.addEventListener('input', calculatePrice);
accessoryChecks.forEach(cb => cb.addEventListener('change', calculatePrice));

// ===== КНОПКИ ВЫБОРА НОУТБУКА =====
document.querySelectorAll('.btn-order, .btn-order-gaming').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modelName = btn.getAttribute('data-name');
        const modelType = btn.getAttribute('data-type');
        for (let opt of laptopSelect.options) {
            if (opt.text.includes(modelName) || (modelType && opt.value === modelType)) {
                opt.selected = true;
                break;
            }
        }
        calculatePrice();
        document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== КНОПКИ АКСЕССУАРОВ =====
document.querySelectorAll('.btn-order, .btn-order-gaming').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const price = parseInt(btn.dataset.price);
        accessoryChecks.forEach(cb => {
            if (parseInt(cb.dataset.price) === price) {
                cb.checked = !cb.checked;
            }
        });
        calculatePrice();
        document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== КНОПКА ЗВОНКА =====
document.getElementById('callBtn')?.addEventListener('click', () => window.location.href = `tel:${PHONE_NUMBER}`);

// ===== ПЕРВОНАЧАЛЬНЫЙ РАСЧЁТ =====
calculatePrice();
// ===== КАЛЬКУЛЯТОР ЦЕН =====

function calculateOfficePrice(days) {
    if (days === 1) return 800;
    if (days === 2) return 1000;
    if (days >= 3 && days <= 10) return 1000 + (days - 2) * 400;
    if (days >= 11 && days <= 20) return 4200 + (days - 10) * 400 * 0.85;
    if (days >= 21 && days <= 30) return 7600 + (days - 20) * 400 * 0.75;
    return 1000 + (days - 2) * 400;
}

function calculateGamingPrice(days) {
    if (days === 1) return 1000;
    if (days === 2) return 1500;
    if (days >= 3 && days <= 10) return 1500 + (days - 2) * 600;
    if (days >= 11 && days <= 20) return 6300 + (days - 10) * 600 * 0.85;
    if (days >= 21 && days <= 30) return 11400 + (days - 20) * 600 * 0.75;
    return 1500 + (days - 2) * 600;
}

function calculateGamingProPrice(days) {
    if (days === 1) return 2400;
    if (days === 2) return 3500;
    if (days >= 3 && days <= 10) return 3500 + (days - 2) * 1000;
    if (days >= 11 && days <= 20) return 11500 + (days - 10) * 1000 * 0.85;
    if (days >= 21 && days <= 30) return 20000 + (days - 20) * 1000 * 0.75;
    return 3500 + (days - 2) * 1000;
}

function calculatePrice() {
    const selectedOption = laptopSelect.options[laptopSelect.selectedIndex];
    const laptopType = selectedOption.value;
    const days = parseInt(daysInput.value) || 1;

    let total = 0;
    let baseWithoutDiscount = 0;
    let discountPercent = 0;

    if (laptopType === 'office') {
        if (days === 1) baseWithoutDiscount = 800;
        else if (days === 2) baseWithoutDiscount = 1000;
        else baseWithoutDiscount = 1000 + (days - 2) * 400;
        total = calculateOfficePrice(days);
        if (days >= 11 && days <= 20) discountPercent = 15;
        else if (days >= 21 && days <= 30) discountPercent = 25;
    } else if (laptopType === 'gaming') {
        if (days === 1) baseWithoutDiscount = 1000;
        else if (days === 2) baseWithoutDiscount = 1500;
        else baseWithoutDiscount = 1500 + (days - 2) * 600;
        total = calculateGamingPrice(days);
        if (days >= 11 && days <= 20) discountPercent = 15;
        else if (days >= 21 && days <= 30) discountPercent = 25;
    } else if (laptopType === 'gaming-pro') {
        if (days === 1) baseWithoutDiscount = 2400;
        else if (days === 2) baseWithoutDiscount = 3500;
        else baseWithoutDiscount = 3500 + (days - 2) * 1000;
        total = calculateGamingProPrice(days);
        if (days >= 11 && days <= 20) discountPercent = 15;
        else if (days >= 21 && days <= 30) discountPercent = 25;
    } else {
        total = 0;
        baseWithoutDiscount = 0;
    }

    const discountAmount = baseWithoutDiscount - total;

    let accessoryTotal = 0;
    accessoryChecks.forEach(cb => {
        if (cb.checked) {
            accessoryTotal += parseInt(cb.dataset.price) * days;
        }
    });

    const finalTotal = total + accessoryTotal;

    basePriceEl.textContent = Math.round(baseWithoutDiscount) + ' ₽';

    if (discountAmount > 0 && days > 10) {
        discountRow.style.display = 'flex';
        discountAmountEl.textContent = '- ' + Math.round(discountAmount) + ' ₽ (' + discountPercent + '%)';
    } else {
        discountRow.style.display = 'none';
    }

    accessoryTotalEl.textContent = accessoryTotal + ' ₽';
    finalPriceEl.textContent = Math.round(finalTotal) + ' ₽';
}

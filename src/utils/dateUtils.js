function populateWeeks(weekSelect1, weekSelect2) {
    // Rajouter les 53 semaines - source: MDN web docs
    for (let i = 1; i <= 52; i++) {
        const option1 = document.createElement("option");
        option1.textContent = i < 10 ? `0${i}` : i;
        weekSelect2.appendChild(option1);
        const option2 = document.createElement("option");
        option2.textContent = i < 10 ? `0${i}` : i;
        weekSelect1.appendChild(option2);
    }
}

function populateOneWeek(weekSelect) {
    // Rajouter les 53 semaines - source: MDN web docs
    for (let i = 1; i <= 52; i++) {
        const option = document.createElement("option");
        option.textContent = i < 10 ? `0${i}` : i;
        weekSelect.appendChild(option);
    }
}

export { populateWeeks, populateOneWeek };
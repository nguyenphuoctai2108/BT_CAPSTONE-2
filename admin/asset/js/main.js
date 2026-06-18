import { BASE_URL } from "../../../config.js";

async function loadTotalSales() {
    const res = await fetch(`${BASE_URL}/Products`, {
        method: "GET"
    });
    const rawData = await res.json();

    let totalData = 0;

    rawData.forEach(element => {
        totalData += element.price;
    });

    const total = document.getElementById("totalSales");

    if(!total) return;

    total.innerText = `${totalData.toLocaleString('en-US')} USD`;
}

loadTotalSales()

function ToggleDarkmode() {
    const btnIcon = document.getElementById("iconMode");
    const body = document.getElementById("body");
    const iconSun = document.querySelector(".icon-sun");
    const iconMoon = document.querySelector(".icon-moon");

    function loadDarkMode() {

        const theme = localStorage.getItem('theme') || 'light'; 

        if (theme === 'dark') {
            iconSun.classList.remove("hidden");
            iconMoon.classList.add("hidden");
            body.setAttribute('data-theme', 'dark'); 
        } else {
            iconSun.classList.add("hidden");
            iconMoon.classList.remove("hidden");
            body.setAttribute('data-theme', 'light');
        }
    }

    btnIcon.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }

        loadDarkMode();
    });

    loadDarkMode(); 
}

ToggleDarkmode();

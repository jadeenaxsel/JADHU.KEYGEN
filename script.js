// DOM Elements
const resultEl = document.getElementById('generated-password');
const lengthEl = document.getElementById('length-slider');
const lengthValEl = document.getElementById('length-val');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');

// Analyze Elements
const analyzeInput = document.getElementById('analyze-input');
const strengthText = document.getElementById('strength-text');
const bars = [
    document.getElementById('bar-1'),
    document.getElementById('bar-2'),
    document.getElementById('bar-3'),
    document.getElementById('bar-4')
];
const feedbackText = document.getElementById('feedback-text');
const crackTimeText = document.getElementById('crack-time');

// Vercel Serverless URL
var API_URL = '/api';

// Events
lengthEl.addEventListener('input', (e) => {
    lengthValEl.innerText = e.target.value;
});

generateBtn.addEventListener('click', async () => {
    const length = +lengthEl.value;
    const lower = lowercaseEl.checked;
    const upper = uppercaseEl.checked;
    const number = numbersEl.checked;
    const symbol = symbolsEl.checked;
    
    // UI Update during fetch
    resultEl.value = "CONNECTING...";
    
    try {
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ length, lower, upper, number, symbol })
        });
        const data = await response.json();
        
        resultEl.value = data.password || "";
        resultEl.classList.remove('blink');
        
        if (resultEl.value) {
            analyzeInput.value = resultEl.value;
            checkServerStrength(resultEl.value);
        }
    } catch (error) {
        console.error("Backend connection failed", error);
        resultEl.value = "ERROR: BACKEND OFFLINE";
    }
});

copyBtn.addEventListener('click', () => {
    if(!resultEl.value || resultEl.value === "ERROR: BACKEND OFFLINE" || resultEl.value === "CONNECTING...") return;
    navigator.clipboard.writeText(resultEl.value);
    
    const originalText = copyBtn.innerText;
    copyBtn.innerText = '[COPIED!]';
    copyBtn.style.color = 'var(--bg-color)';
    copyBtn.style.background = 'var(--text-color)';
    
    setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.color = 'var(--text-color)';
        copyBtn.style.background = 'transparent';
    }, 2000);
});

analyzeInput.addEventListener('input', (e) => {
    checkServerStrength(e.target.value);
});

async function checkServerStrength(password) {
    if (!password) {
        resetMeter();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await response.json();
        
        updateMeter(data.strength, data.feedback);
        updateCrackTime(data.seconds);
        
    } catch(err) {
         console.error("Backend offline", err);
         updateMeter(0, ["BACKEND CONNECTION ERROR"]);
    }
}

function resetMeter() {
    strengthText.innerText = "AWAITING INPUT...";
    strengthText.className = "blink";
    strengthText.style.color = "var(--text-color)";
    feedbackText.innerText = "";
    crackTimeText.innerText = "";
    
    bars.forEach(bar => {
        bar.style.backgroundColor = "transparent";
        bar.style.boxShadow = "none";
        bar.style.borderColor = "var(--text-dim)";
    });
}

function updateMeter(score, feedback) {
    resetMeter();
    strengthText.className = ""; // Remove blink
    
    const strengthLevels = ["WEAK", "FAIR", "GOOD", "SECURE"];
    const colors = ["var(--danger)", "var(--warning)", "var(--good)", "#00ffff"];
    const shadowColors = ["#ff003c", "#ffb000", "#00ff41", "#00ffff"];
    
    let actualScore = Math.max(1, Math.min(4, score || 1));
    
    strengthText.innerText = `[ ${strengthLevels[actualScore - 1]} ]`;
    strengthText.style.color = colors[actualScore - 1];
    strengthText.style.textShadow = `0 0 10px ${shadowColors[actualScore - 1]}`;

    for (let i = 0; i < actualScore; i++) {
        bars[i].style.backgroundColor = colors[actualScore - 1];
        bars[i].style.borderColor = colors[actualScore - 1];
        bars[i].style.boxShadow = `0 0 10px ${shadowColors[actualScore - 1]}`;
    }

    if (actualScore === 4) {
        feedbackText.innerText = "> SYSTEM SECURE. ENCRYPTION OPTIMAL.";
        feedbackText.style.color = colors[actualScore - 1];
    } else {
        feedbackText.innerText = `> RECOMMENDATION: ${feedback ? feedback.join(' | ') : ''}`;
        feedbackText.style.color = "var(--text-dim)";
    }
}

function updateCrackTime(seconds) {
    if (seconds === undefined) return;
    crackTimeText.innerText = `> THIS PASSWORD WOULD TAKE ${formatTime(seconds)} TO CRACK`;
    crackTimeText.style.color = getCrackTimeColor(seconds);
}

function formatTime(seconds) {
    if (seconds < 1) return "LESS THAN A SECOND";
    if (seconds < 60) return `${Math.round(seconds)} SECONDS`;
    
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.round(minutes)} MINUTES`;
    
    const hours = minutes / 60;
    if (hours < 24) return `${Math.round(hours)} HOURS`;
    
    const days = hours / 24;
    if (days < 30) return `${Math.round(days)} DAYS`;
    
    const months = days / 30;
    if (months < 12) return `${Math.round(months)} MONTHS`;
    
    const years = months / 12;
    if (years < 100) return `${Math.round(years)} YEARS`;
    if (years < 1000) return `${Math.round(years / 100) * 100} YEARS`;
    if (years < 1000000) return `${Math.round(years / 1000)} THOUSAND YEARS`;
    if (years < 1000000000) return `${Math.round(years / 1000000)} MILLION YEARS`;
    
    return "BILLIONS OF YEARS";
}

function getCrackTimeColor(seconds) {
    if (seconds < 3600) return "var(--danger)"; // < 1 hour
    if (seconds < 31536000) return "var(--warning)"; // < 1 year
    return "var(--good)"; // > 1 year
}

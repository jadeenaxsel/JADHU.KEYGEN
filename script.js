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

// Character Sets
const alphaLower = 'abcdefghijklmnopqrstuvwxyz';
const alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

// Events
lengthEl.addEventListener('input', (e) => {
    lengthValEl.innerText = e.target.value;
});

generateBtn.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;
    
    resultEl.value = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    
    // Animate generation effect
    resultEl.classList.remove('blink');
    
    // Auto populate the analyzer
    if (resultEl.value) {
        analyzeInput.value = resultEl.value;
        checkStrength(resultEl.value);
    }
});

copyBtn.addEventListener('click', () => {
    if(!resultEl.value) {
        return;
    }
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
    checkStrength(e.target.value);
});

// Functions
function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
    
    if(typesCount === 0) {
        return '';
    }
    
    for(let i=0; i<length; i+=typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    
    const finalPassword = generatedPassword.slice(0, length);
    
    // Shuffle the result for better randomness
    return finalPassword.split('').sort(() => 0.5 - Math.random()).join('');
}

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

function getRandomLower() {
    return alphaLower[Math.floor(Math.random() * alphaLower.length)];
}

function getRandomUpper() {
    return alphaUpper[Math.floor(Math.random() * alphaUpper.length)];
}

function getRandomNumber() {
    return numbers[Math.floor(Math.random() * numbers.length)];
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Password Strength Logic
function checkStrength(password) {
    if (!password) {
        resetMeter();
        return;
    }

    let strength = 0;
    let feedback = [];

    // Length Check
    if (password.length > 7) {
        strength += 1;
    } else {
        feedback.push("TOO SHORT (MIN 8 CHARS)");
    }
    if (password.length > 11) {
        strength += 1;
    }

    // Complexity Check
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (hasLower && hasUpper) {
        strength += 1;
    } else {
        feedback.push("MIX UPPER & LOWERCASE");
    }

    if (hasNumber || hasSymbol) {
        strength += 1;
    } else {
        feedback.push("ADD NUMBERS OR SYMBOLS");
    }
    
    if (hasLower && hasUpper && hasNumber && hasSymbol && password.length > 11) {
        strength = 4; // Max strength
    }
    
    if (password.length < 5) {
        strength = 1; // Cap very short passwords
    }

    updateMeter(strength, feedback);
    calculateCrackTime(password, hasLower, hasUpper, hasNumber, hasSymbol);
}

function calculateCrackTime(password, hasLower, hasUpper, hasNumber, hasSymbol) {
    if (!password) {
        crackTimeText.innerText = '';
        return;
    }

    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSymbol) poolSize += 32;

    if (poolSize === 0) poolSize = 26; // Default fallback

    // Number of possible combinations
    const combinations = Math.pow(poolSize, password.length);
    
    // Assume 100 billion guesses per second (a modern powerful offline attack)
    const guessesPerSecond = 100e9; 
    const seconds = combinations / guessesPerSecond;

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
    
    let actualScore = Math.max(1, Math.min(4, score));
    
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
        feedbackText.innerText = `> RECOMMENDATION: ${feedback.join(' | ')}`;
        feedbackText.style.color = "var(--text-dim)";
    }
}

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const alphaLower = 'abcdefghijklmnopqrstuvwxyz';
const alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = (lower?1:0) + (upper?1:0) + (number?1:0) + (symbol?1:0);
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
    
    if(typesCount === 0) return '';
    
    for(let i=0; i<length; i+=typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            if (funcName === 'lower') generatedPassword += alphaLower[Math.floor(Math.random() * alphaLower.length)];
            if (funcName === 'upper') generatedPassword += alphaUpper[Math.floor(Math.random() * alphaUpper.length)];
            if (funcName === 'number') generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
            if (funcName === 'symbol') generatedPassword += symbols[Math.floor(Math.random() * symbols.length)];
        });
    }
    
    return generatedPassword.slice(0, length).split('').sort(() => 0.5 - Math.random()).join('');
}

function analyzePassword(password, hasLower, hasUpper, hasNumber, hasSymbol) {
    let strength = 0;
    let feedback = [];

    if (password.length > 7) strength += 1;
    else feedback.push("TOO SHORT (MIN 8 CHARS)");
    
    if (password.length > 11) strength += 1;

    if (hasLower && hasUpper) strength += 1;
    else feedback.push("MIX UPPER & LOWERCASE");

    if (hasNumber || hasSymbol) strength += 1;
    else feedback.push("ADD NUMBERS OR SYMBOLS");
    
    if (hasLower && hasUpper && hasNumber && hasSymbol && password.length > 11) strength = 4;
    if (password.length < 5) strength = 1;

    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSymbol) poolSize += 32;
    if (poolSize === 0) poolSize = 26;

    const combinations = Math.pow(poolSize, password.length);
    const seconds = combinations / 100e9;

    return { strength, feedback, seconds };
}

app.post('/api/generate', (req, res) => {
    const { lower, upper, number, symbol, length } = req.body;
    const password = generatePassword(lower, upper, number, symbol, length);
    res.json({ password });
});

app.post('/api/analyze', (req, res) => {
    const { password } = req.body;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    
    const analysis = analyzePassword(password, hasLower, hasUpper, hasNumber, hasSymbol);
    res.json(analysis);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend securely running on port ${PORT}`);
});

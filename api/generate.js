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

module.exports = (req, res) => {
    try {
        const { lower, upper, number, symbol, length } = req.body || {};
        const password = generatePassword(lower, upper, number, symbol, length);
        res.status(200).json({ password });
    } catch (e) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

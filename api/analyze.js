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

module.exports = (req, res) => {
    try {
        const { password } = req.body || {};
        if (!password) {
            return res.status(200).json({ strength: 0, feedback: [], seconds: 0 });
        }
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        
        const analysis = analyzePassword(password, hasLower, hasUpper, hasNumber, hasSymbol);
        res.status(200).json(analysis);
    } catch (e) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

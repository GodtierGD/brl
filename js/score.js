/**
 * Numbers of decimal digits to round to
 */
const scale = 2;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * Uses exponential decay: 420 * e^(-0.009 * (rank - 1))
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    // 1. Basic list boundaries
    if (!rank || rank > 10000) {
        return 0;
    }
    
    // 2. Only allow progress points for the Top 75
    if (rank > 75 && percent < 100) {
        return 0;
    }

    // 3. Prevent division by zero if minPercent is missing/invalid
    const effectiveMin = (minPercent || 1) - 1;
    const denominator = 100 - effectiveMin;
    if (denominator <= 0) return 0;

    // 4. The New Exponential Decay Formula
    // Base 420 with a -0.009 decay rate
    let basePoints = 420 * Math.exp(-0.006 * (rank - 1));
    
    // 5. Apply percentage scaling
    let calculatedScore = basePoints * ((percent - effectiveMin) / denominator);

    // 6. Safety check to ensure we never return NaN or negative
    calculatedScore = Math.max(0, calculatedScore || 0);

    // 7. Apply 33% penalty for non-100% completions
    if (percent != 100) {
        return round(calculatedScore * (2 / 3));
    }

    return Math.max(round(calculatedScore), 0);
}

/**
 * Rounds a number to the defined scale
 * @param {Number} num 
 * @returns {Number}
 */
export function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        var arr = ('' + num).split('e');
        var sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}
'use strict'

/*
 * Used to convert base specifically for the
 * Writer class.
 */
class BaseConverter {
    constructor(count) {
        this.base = this._calculateBase(count);
        this.bits = this._log(2, this.base);
        
        // Preprocessing for convert().
        this.i = (8 / this.bits) - 1;
        this.baseMinusOne = this.base - 1;
    }


    /*
     * Converts the input number into the selected
     * base.
     */
    convert(num) {
        var i = this.i;
        var baseMinusOne = this.baseMinusOne;
        var bitArray = [];

        for (; i >= 0; i -= 1) {
            bitArray.push(num >> i * this.bits & baseMinusOne);
        }

        return bitArray;
    }
    

    /*
     * Calculates the base from the input number.
     */
    _calculateBase(count) {
        var i = count;

        for (; i > 0; i -= 1) {
            if (8 % this._log(2, i) === 0) {
                return i;
            }
        }
    }

    /*
     * Calculates log to a base.
     */
    _log(base, num) {
        return Math.log(num) / Math.log(base);
    }
}

module.exports = BaseConverter;

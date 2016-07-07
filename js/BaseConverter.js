'use strict'

/*
 * Used to convert base specifically for the
 * Writer class.
 */
class BaseConverter {
    constructor(count) {
        this.base = this._calculateBase(count);
        this.bits = Math.log(this.base) / Math.log(2);
        
        // Preprocessing for convert().
        this.i = (8 / this.bits) - 1;
        this.baseMinusOne = this.base - 1;
    }


    /*
     * Calculates the base from the input number.
     */
    _calculateBase(count) {
        var i = count;

        for (; i > 0; i -= 1) {
            if (8 % (Math.log(i) / Math.log(2)) === 0) {
                return i;
            }
        }
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
}

module.exports = BaseConverter;

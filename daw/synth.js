

var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var SAMPLE_RATE = 44100;

    var oscSin = function (iFreq, t) {
        return 120 * Math.sin( 2 * Math.PI * iFreq * t / SAMPLE_RATE);
    };

    var oscSaw = function (iFreq, t) {
        return  127 - (t % (SAMPLE_RATE / iFreq)) * (255 / (SAMPLE_RATE / iFreq));
    };

    var oscSqr = function (iFreq, t) {
        return (Math.sin( 2 * Math.PI * iFreq * (t/SAMPLE_RATE)) > 0) ? -127 : 127;
    };

    var oscRec = function (iFreq, t, fPercent) {
        var iFullCycleLength = SAMPLE_RATE / iFreq;
        return ((iFullCycleLength - t % iFullCycleLength) < (fPercent * iFullCycleLength)) ? -127: 127
    };

    /**
     * Calculate the value of a function for a given sample
     *
     * @param sFormula
     * @param iFreq
     * @param iDuration
     * @param {Lazerbahn.Modules.Envelope} oEnvelope
     */
    function calc(sFormula, iFreq, iDuration, oEnvelope) {
        var cFunction =  '';
        eval('cFunction = function (t, f) { return ' + sFormula + '}');
        var sHeader = 'RIFF_oO_WAVEfmt'+atob('IBAAAAABAAEARKwAAAAAAAABAAgAZGF0YU');
        for(var t=0,S = sHeader; ++t<iDuration; ) {
            S+=String.fromCharCode(
                ( Math.round(
                    cFunction(t, iFreq) * oEnvelope.getVelocity(t)
                ) +127 ) & 255
            );
        }
        return  new Audio( 'data:audio/wav;base64,'+btoa( S ) );
    }

    Lazerbahn.synth = {
        calculate : calc
    }

})();


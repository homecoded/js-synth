
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oKeyAudios = {},
        oFormularTextarea = document.getElementById('synthesizer-formula')
        ;

    // setup event handlers
    var oUpdateButton = document.getElementById('synthesizer-update');
    oUpdateButton.onclick = function () {
        var sFormula = oFormularTextarea.value;
        var iDuration = 1<<18;
        for (var i=0; i < Lazerbahn.notes.length; i++) {
            var iFreq = Lazerbahn.frequencies[Lazerbahn.notes[i]];
            oKeyAudios[Lazerbahn.notes[i]] = Lazerbahn.synth.calculate(sFormula, iFreq, iDuration);
        }
    };

    var oLastEvent;
    var heldKeys = {};
    var oKeyCodeToNoteMap = {
        81: 'c2',
        50: 'c#2',
        87: 'd2',
        51: 'd#2',
        69: 'e2',
        82: 'f2',
        53: 'f#2',
        84: 'g2',
        54: 'g#2',
        90: 'a2',
        55: 'a#2',
        85: 'h2',
        73: 'c3',
        57: 'c#3',
        79: 'd3',
        48: 'd#3',
        80: 'e3',
        186: 'f3',
        89: 'c1',
        83: 'c#1',
        88: 'd1',
        68: 'd#1',
        67: 'e1',
        86: 'f1',
        71: 'f#1',
        66: 'g1',
        72: 'g#1',
        78: 'a1',
        74: 'a#1',
        77: 'h1',
       188: 'c2',
        76: 'c#2',
       190: 'd2',
       192: 'd#2',
       189: 'e2'

};

    document.onkeyup = function(event) {
        console.log(event.keyCode);
        oLastEvent = null;
        delete heldKeys[event.keyCode];
        if (oKeyAudios[oKeyCodeToNoteMap[event.keyCode]]) {
            oKeyAudios[oKeyCodeToNoteMap[event.keyCode]].pause();
            oKeyAudios[oKeyCodeToNoteMap[event.keyCode]].currentTime = 0;
        }
    };

    document.onkeydown = function(event) {
        if (oLastEvent && oLastEvent.keyCode == event.keyCode) {
            return;
        }
        oLastEvent = event;
        heldKeys[event.keyCode] = true;
        if (oKeyAudios[oKeyCodeToNoteMap[event.keyCode]]) {
            oKeyAudios[oKeyCodeToNoteMap[event.keyCode]].play();
        }
    };

    // sound presets
    var oPresets = {
        'sin': '.3 * oscSin(f,t)',
        'saw': '.3 * oscSaw(f,t)',
        'sqr': '.3 * oscSqr(f,t)',
        'rec': '.3 * oscRec(f,t, 0.5 + 0.3 * Math.sin(t/30000))',
        'sweep': '0.05 * (1+Math.sin(2*t/SAMPLE_RATE)) * oscRec(f * 2, t + 400*Math.sin( (t/SAMPLE_RATE)), 0.5 + .3*Math.sin(t/40000))\n' +
            '+ 0.05 * (1+Math.sin(0.5*t/SAMPLE_RATE)) * oscSqr(2*f , t)\n'+
            '+ 0.2 * oscSin(f*4,t)',
        'rich base': '0.2 * oscRec(f, t, .5 + .45* Math.sin(t/4e6)) ' +
            '+ 0.2 * oscRec(f + 1, t, .5 + .45* Math.sin(t/2e4)) '  +
            '+ 0.1 * oscSaw(f, t)'
    };

    // init select
    var oSoundSelect = document.getElementById('sound-select');
    for(var i in oPresets) {
        if (oPresets.hasOwnProperty(i)) {
            oSoundSelect.options[oSoundSelect.options.length] = new Option(i, i);
        }
    }

    oSoundSelect.onchange = function () {
        var sNewFormula = oPresets[oSoundSelect.value];
        if (sNewFormula) {
            oFormularTextarea.value = sNewFormula;
        }
    }



})();
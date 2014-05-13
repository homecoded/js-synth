
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oKeyAudios = {},
        oFormularTextarea = document.getElementById('synthesizer-formula')
        ;

    // setup event handlers
    var oUpdateButton = document.getElementById('synthesizer-update');
    oUpdateButton.onclick = function () {

        var sFormula = oFormularTextarea.value;
        var cFunction =  '';
        eval('cFunction = function (t, f) { return ' + sFormula + '}');

        var iDuration = 1<<18;
        for (var i=0; i < Lazerbahn.notes.length; i++) {
            console.log('make note', Lazerbahn.notes[i]);
            var iFreq = Lazerbahn.frequencies[Lazerbahn.notes[i]];
            var sHeader = 'RIFF_oO_WAVEfmt'+atob('IBAAAAABAAEARKwAAAAAAAABAAgAZGF0YU');
            for(var t=0,S = sHeader; ++t<iDuration; ) {
                S+=String.fromCharCode(
                    ( Math.round(
                        cFunction(t, iFreq)
                    ) +127 ) & 255
                );
            }
            /** global Audio:false **/
            oKeyAudios[Lazerbahn.notes[i]] = new Audio( 'data:audio/wav;base64,'+btoa( S ) );
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
        'sin': '32 * Math.sin( 2 * Math.PI * f * (t/44100))',
        'saw': '-32 + (t % (44100 / f)) * (664 / (44100 / f))',
        'sqr': '(Math.sin( 2 * Math.PI * f * (t/44100)) > 0) ? -32 : 32'
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
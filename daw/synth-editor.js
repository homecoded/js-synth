
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oKeyAudios = {},
        oFormularTextarea = document.getElementById('synthesizer-formula'),
        oEnvelopeTextarea = document.getElementById('envelope-editor')
    ;

    // setup event handlers
    var oUpdateButton = document.getElementById('synthesizer-update');
    oUpdateButton.onclick = function () {
        var sFormula = oFormularTextarea.value;
        var iDuration = 1<<16;
        for (var i=0; i < Lazerbahn.notes.length; i++) {
            var fFreq = Lazerbahn.frequencies[Lazerbahn.notes[i]];
            oKeyAudios[Lazerbahn.notes[i]] = Lazerbahn.synth.calculate(
                sFormula,
                fFreq,
                iDuration,
                Lazerbahn.envelopeEditor.getEnvelope()
            );
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
       189: 'e2',
        65: 'off'

    };
    Lazerbahn.keyToNoteMap = oKeyCodeToNoteMap;

    Lazerbahn.keyboard.onKeyRelease(
        function(iKeyCode) {
            oLastEvent = null;
            if (oKeyAudios[oKeyCodeToNoteMap[iKeyCode]]) {
                oKeyAudios[oKeyCodeToNoteMap[iKeyCode]].pause();
                oKeyAudios[oKeyCodeToNoteMap[iKeyCode]].currentTime = 0;
            }
        }
    );


    Lazerbahn.keyboard.onKeyPress(
        function(iKeyCode) {
            heldKeys[iKeyCode] = true;
            if (oKeyAudios[oKeyCodeToNoteMap[iKeyCode]]) {
                oKeyAudios[oKeyCodeToNoteMap[iKeyCode]].play();
            }
        }
    );

    // sound presets
    var oPresets = {
        'sin': {syn:'.1 * oscSin(f,t)' , env: '0,0,1e4,1,4e5,1,2e6,0'},
        'saw': {syn:'.1 * oscSaw(f,t)' , env: '0,0,1e4,1,4e5,1,2e6,0'},
        'sqr': {syn:'.1 * oscSqr(f,t)' , env: '0,0,1e4,1,4e5,1,2e6,0'},
        'rec': {syn:'.1 * oscRec(f,t, 0.5 + 0.3 * Math.sin(t/30000))' , env: '0,0,1e3,1,4e5,1,2e6,0'},
        'sweep': {syn:'0.2*(0.05 * (1+Math.sin(2*t/SAMPLE_RATE)) * oscRec(f * 2, t + 400*Math.sin( (t/SAMPLE_RATE)), 0.5 + .3*Math.sin(t/40000))\n' +
            '+ 0.05 * (1+Math.sin(0.5*t/SAMPLE_RATE)) * oscSqr(2*f , t)\n'+
            '+ 0.2 * oscSin(f*4,t))' , env: '0,0,1e3,1,4e5,1,2e6,0'},
        'rich_base': {syn:'0.2*(0.2 * oscRec(f, t, .5 + .45* Math.sin(t/4e6)) ' +
            '+ 0.2 * oscRec(f + 1, t, .5 + .45* Math.sin(t/2e4)) '  +
            '+ 0.1 * oscSaw(f, t))' , env: '0,0,1e3,1,4e5,1,2e6,0'},
        'basedrum' : {syn:'(.8 * oscSin(f/2, t%1e5) + .4 * oscSin(f/16 *Math.sin(1e5/(t%1e5)), t%1e5) + .1 * oscSqr(f/16* Math.sin(1e5/(t%1e5)), t%1e5))' , env: '0, 0, 3e2, 1, 1e3, .5, 2e3, 0'},
        'sweep2' : {syn: '0.8 * INSTRUMENTS.sweep(f,t,gt,d) + 0.4 * INSTRUMENTS.sweep(f,t+30*sin(t/1e4),gt,d)', env: '0,0,300,1'}
    };

    // init select
    var oSoundSelect = document.getElementById('sound-select');
    for(var i in oPresets) {
        if (oPresets.hasOwnProperty(i)) {
            oSoundSelect.options[oSoundSelect.options.length] = new Option(i, i);
            Lazerbahn.synth.addInstrument(
                i,
                oPresets[i].syn,
                Lazerbahn.envelopeEditor.getEnvelope(oPresets[i].env)
            );
        }
    }

    oSoundSelect.onchange = function () {
        var sNewFormula = oPresets[oSoundSelect.value].syn;
        var sNewEnvelope = oPresets[oSoundSelect.value].env;
        if (sNewFormula) {
            oFormularTextarea.value = sNewFormula;
            oEnvelopeTextarea.value = sNewEnvelope;
        }
    };

    Lazerbahn.synthEditor = {
        getSounds : function () {
            return oPresets;
        }
    }

})();
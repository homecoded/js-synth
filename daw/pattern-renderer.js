
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oRenderSongButton = document.getElementById('renderSong');
    oRenderSongButton.onclick = function () {
        var aInstruments = Lazerbahn.trackEditor.getInstruments(),
            aTrackData = Lazerbahn.trackEditor.getTracks(),
            iQuarterNoteSamples = (44100 * 60) / 130 / 4,
            iTrackLength = aTrackData[0].length,
            //iTrackLength = 3,
            iPatternLength = iQuarterNoteSamples * iTrackLength,
            aTrackRenderData = [],
            iNumTracks = aInstruments.length,
            i,
            oPresets = Lazerbahn.synthEditor.getSounds()
            ;

        for (i = 0; i < iNumTracks; i++) {
            aTrackRenderData.push({
                t : 0,
                lastNote : -1,
                synth: oPresets[aInstruments[i]].syn,
                persistentData: {},
                envelope: Lazerbahn.envelopeEditor.getEnvelope(oPresets[aInstruments[i]].env)
            });
        }

        var aBuffer = '';
        var iMaxValue = 0;

        for (i = 0; i < iPatternLength; i++) {
            var iIndex = Math.floor(i / iQuarterNoteSamples),
                iValue = 0;

            for (var j = 0; j < iNumTracks; j++) {
                 // render buffer
                var aCurrentTrackData = aTrackRenderData[j],
                    sFormula = aCurrentTrackData.synth,
                    fFreq = Lazerbahn.frequencies[aTrackData[j][iIndex]],
                    oPersistentData = aCurrentTrackData.persistentData,
                    oEnvelope = aCurrentTrackData.envelope
                ;

                if (typeof(fFreq) != 'undefined'){
                    if (
                        aCurrentTrackData.lastNote != fFreq
                            || aCurrentTrackData.lastIndex != iIndex
                        ) {
                        aCurrentTrackData.lastNote = fFreq;
                        aCurrentTrackData.t = 0;
                    }
                } else if (aTrackData[j][iIndex] == 'off') {
                    aCurrentTrackData.lastNote = -1;
                    aCurrentTrackData.t = 0;
                }

                aCurrentTrackData.lastIndex = iIndex;

                if (aCurrentTrackData.lastNote > 0) {
                    iValue += Lazerbahn.synth.calculatePatternStep(
                        sFormula,
                        aCurrentTrackData.lastNote,
                        aCurrentTrackData.t,
                        i,
                        oPersistentData,
                        oEnvelope
                    );
                }

                if (iMaxValue < iValue) {
                    iMaxValue = iValue;
                    console.log('new max', iMaxValue);
                }
                aCurrentTrackData.t++;
            }

            aBuffer += String.fromCharCode((iValue+128) & 255);
        }
        var oAudio = Lazerbahn.synth.buildAudio(aBuffer);
        oAudio.play();

    };

})();
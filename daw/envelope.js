var Lazerbahn = Lazerbahn ? Lazerbahn : {};
Lazerbahn.Modules = Lazerbahn.Modules ? Lazerbahn.Modules : {};

Lazerbahn.Modules.Envelope = function () {

    // [iTimeMs, fVelocity [0..1]]
    var aEnvelope = [],
        iStartTime = 0
        ;

    return {
        setEnvelope: function (aNewEnvelope) {
            aEnvelope = aNewEnvelope;
        },
        start: function (iTime) {
            iStartTime = iTime;
        },
        getVelocity: function (iTime) {
            for (var i=0; i<aEnvelope.length; i+=2 ) {
                var iEnvelopeTime = iTime - iStartTime;
                if (aEnvelope[i] > iEnvelopeTime) {
                    // this is the next data point in the envelope
                    var iTargetVelocity = aEnvelope[i+1],
                        iStartVelocity = aEnvelope[i-1],
                        iSectionStartTime = aEnvelope[i-2],
                        iSectionEndTime = aEnvelope[i],
                        fPercentageInSection = (iEnvelopeTime-iSectionStartTime)/(iSectionEndTime - iSectionStartTime)
                        ;
                    return fPercentageInSection * (iTargetVelocity - iStartVelocity) + iStartVelocity
                }
            }
            // none found, return last entry
            return aEnvelope[aEnvelope.length-1];
        }

    }
};


var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oEnvelopeTextarea = document.getElementById('envelope-editor');

    Lazerbahn.envelopeEditor = {
        getEnvelope : function (){
            var sText = oEnvelopeTextarea.value,
                aEnvelopeData = eval('[' + sText + ']'),
                oEnvelope = Lazerbahn.Modules.Envelope()
            ;
            oEnvelope.setEnvelope(aEnvelopeData);
            return oEnvelope;
        }
    }
})();
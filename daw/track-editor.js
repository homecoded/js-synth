
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oTrackDatas = document.getElementsByClassName('track-data'),
        oTracks = document.getElementsByClassName('track'),
        oSoundSelects = document.getElementsByClassName('track-sound-select'),
        oSounds = Lazerbahn.synthEditor.getSounds(),
        TRACK_LENGTH = 64,
        i
        ;

    var createClickListener = function (oTrack) {
        return function () {
            for (var i = 0; i < oTracks.length; i++) {
                if (oTracks[i].id === oTrack.id) {
                    oTracks[i].setAttribute('class', 'track selected' );
                } else {
                    oTracks[i].setAttribute('class', 'track' );
                }
            }
        }
    };

    for (i = 0; i < oTracks.length; i++) {
        // setup
        var oTrack = oTracks[i];
        oTrack.id = 'track' + i;
        oTrack.addEventListener('click', createClickListener(oTrack));
    }


    for (i = 0; i < oTrackDatas.length; i++) {
        // render track data
        var sTrack = '';
        for (var j = 1; j <= TRACK_LENGTH; j++){
            sTrack += '<div class="track-line">' +
                '<span class="number">' + ('0' + j).slice(-2) + '</span>' +
                '<span class="data">' + '---' + '</span>' +
                '</div>'
        }
        oTrackDatas[i].innerHTML = sTrack;
    }

    for (i = 0; i < oSoundSelects.length; i++) {
        for (var sSoundName in oSounds) {
            if (oSounds.hasOwnProperty(sSoundName)) {
                oSoundSelects[i].options[oSoundSelects[i].options.length] = new Option(sSoundName, sSoundName);
            }
        }
    }
})();

var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oTrackDatas = document.getElementsByClassName('track-data'),
        oTracks = document.getElementsByClassName('track'),
        oSoundSelects = document.getElementsByClassName('track-sound-select'),
        oSounds = Lazerbahn.synthEditor.getSounds(),
        TRACK_LENGTH = 64,
        i,
        iSelectedTrack = -1,
        iSelectedLine = -1,
        aTrackContentData = [],
        NO_DATA = '---'
        ;

    var selectTrack = function (iId) {
        console.log('selectTrack', iId);
        iSelectedTrack = iId;
        for (var i = 0; i < oTracks.length; i++) {
            if (i == iId) {
                oTracks[i].setAttribute('class', 'track selected');
            } else {
                oTracks[i].setAttribute('class', 'track');
                unSelectLines(i);
            }
        }
    };

    var unSelectLines = function (iTrackId) {
        var oTrack = oTracks[iTrackId];
        var aTrackLines = oTrack.getElementsByClassName('track-line');
        for (var i = 0; i < aTrackLines.length; i++) {
            aTrackLines[i].setAttribute('class', 'track-line');
        }
    };

    var selectLine = function(iLineId) {
        iSelectedLine = iLineId;
        var oTrack = oTracks[iSelectedTrack];
        var aTrackLines = oTrack.getElementsByClassName('track-line');
        unSelectLines(iSelectedTrack);
        aTrackLines[iLineId].setAttribute('class', 'track-line selected');
    };

    var createClickListener = function (iTrackId, iTrackLineId) {
        return function (oEvent) {
            // mark the track
            selectTrack(iTrackId);
            // mark the track line
            selectLine(iTrackLineId);
        }
    };

    var renderData = function () {
        for (var i = 0; i < oTrackDatas.length; i++) {
            var oTrack = oTracks[i];
            var aTrackLines = oTrack.getElementsByClassName('track-line');
            for (var j = 0; j < aTrackLines.length; j++) {
                aTrackLines[j].getElementsByClassName('data')[0].innerHTML = aTrackContentData[i][j];
            }
        }
    };

    for (i = 0; i < oTrackDatas.length; i++) {
        // render track data
        var sTrack = '';
        for (var j = 1; j <= TRACK_LENGTH; j++){
            sTrack += '<div class="track-line">' +
                '<span class="number">' + ('0' + j).slice(-2) + '</span>' +
                '<span class="data">' + '</span>' +
                '</div>'
        }
        oTrackDatas[i].innerHTML = sTrack;
    }

    for (i = 0; i < oTracks.length; i++) {
        aTrackContentData[i] = [];
        // setup
        var oTrack = oTracks[i];
        oTrack.id = 'track' + i;
        var aTrackLines = oTrack.getElementsByClassName('track-line');
        for (j = 0; j < aTrackLines.length; j++) {
            aTrackContentData[i][j] = NO_DATA;
            aTrackLines[j].id = oTrack.id + '_line' + j;
            aTrackLines[j].addEventListener('click', createClickListener(i, j));
        }
    }

    for (i = 0; i < oSoundSelects.length; i++) {
        for (var sSoundName in oSounds) {
            if (oSounds.hasOwnProperty(sSoundName)) {
                oSoundSelects[i].options[oSoundSelects[i].options.length] = new Option(sSoundName, sSoundName);
            }
        }
    }

    Lazerbahn.keyboard.onKeyPress(
        function (iKeyCode) {
            switch (iKeyCode) {
                case Lazerbahn.keyboard.KEY_DOWN:
                    if (iSelectedLine < 0) {
                        break;
                    }
                    iSelectedLine++;
                    if (iSelectedLine >= TRACK_LENGTH) {
                        iSelectedLine = 0;
                    }
                    selectLine(iSelectedLine);
                    break;
                case Lazerbahn.keyboard.KEY_UP:
                    if (iSelectedLine < 0) {
                        break;
                    }
                    iSelectedLine--;
                    if (iSelectedLine < 0) {
                        iSelectedLine = TRACK_LENGTH - 1;
                    }
                    selectLine(iSelectedLine);
                    break;
                case Lazerbahn.keyboard.KEY_LEFT:
                    if (iSelectedTrack < 0) {
                        break;
                    }
                    iSelectedTrack--;
                    if (iSelectedTrack < 0) {
                        iSelectedTrack = oTracks.length - 1;
                    }
                    selectTrack(iSelectedTrack);
                    selectLine(iSelectedLine);
                    break;
                case Lazerbahn.keyboard.KEY_RIGHT:
                    if (iSelectedTrack < 0) {
                        break;
                    }
                    iSelectedTrack++;
                    if (iSelectedTrack >= oTracks.length) {
                        iSelectedTrack = 0;
                    }
                    selectTrack(iSelectedTrack);
                    selectLine(iSelectedLine);
                    break;
            }
        }
    );
    renderData();
})();
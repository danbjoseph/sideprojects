var mapbounds = [];
var pathArray = [];


var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var mapattribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

var map = L.map('map', {   
    zoom: 14,
    center: [51.505, -0.09],
    // scrollWheelZoom: false, 
    // zoomControl: false,   
});

L.tileLayer(osmUrl, {
    attribution: mapattribution,
    maxZoom: 18
}).addTo(map);


// beginning of function chain to initialize map
function getPath() {
    $.ajax({
        type: 'GET',
        url: 'data/rail_single.json',
        contentType: 'application/json',
        dataType: 'json',
        timeout: 10000,
        success: function(json) {
            stupidArray = json.features[0].geometry.coordinates;
            $.each(stupidArray, function(i, item){
                a = item[0];
                b = item[1];
                pathArray.push([b,a]);
            })
            railpath = L.polyline(pathArray, {
                color: 'red'
            }).addTo(map);
            mapbounds = railpath.getBounds();
            map.fitBounds(mapbounds);
            addAnimatedMarker(); 
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function addAnimatedMarker(){    
    animatedMarker = L.animatedMarker(railpath.getLatLngs(), {
        distance: 414,
        interval: 1000,
        autoStart: false
    });
    map.addLayer(animatedMarker);
}

// this code loads the IFrame Player API code asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'tGTwSNPqAqs',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
}

// the API will call this function when the video player is ready.
function onPlayerReady(event) {
    // event.target.playVideo();
}

function onPlayerStateChange() {
    if (player.getPlayerState() == 1){
        animatedMarker.start();
    } else {
        animatedMarker.stop();
    }
}


// tweet popup
$('.twitterpopup').click(function(event) {
    var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;

    window.open(url, 'twitter', opts);

    return false;
});

// start function chain to initialize map
getPath();
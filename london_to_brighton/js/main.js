var mapbounds = [];
var pathArray = [];


var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var mapattribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

var map = L.map('map', {   
    zoom: 8,
    center: [51.316880, -0.005493],
    scrollWheelZoom: false, 
    zoomControl: false,   
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
                color: 'grey',
                // stroke: false,
                clickable: false
            }).addTo(map);            
            
        },
        error: function(e) {
            console.log(e);
        }
    });
}

var myIcon = L.icon({
    iconUrl: 'https://raw.github.com/danbjoseph/sideprojects/master/london_to_brighton/img/train.png',
    iconSize: [25, 31],
    iconAnchor: [12, 15]
});

function addAnimatedMarker(){    
    
    animatedMarker = L.animatedMarker(railpath.getLatLngs(), {
        distance: 414,
        interval: 1000,
        autoStart: false,
        icon: myIcon
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
        playerVars: {
            // controls: '0',
            disablekb: '1'            
        },        
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
}

var videotime = 0;
var timeupdater = null; 
var timedisplay = document.getElementById('time');
var tripStarted = false;
var tripReady = false;
var tripEnded = false;
var markerLocation = [];

function onPlayerReady(event) {
    function updateTime() {
        var oldTime = videotime;
        if(player && player.getCurrentTime) {
          videotime = player.getCurrentTime();
        }
        if(videotime !== oldTime) {
          onProgress();
        }
    }
    timeupdater = setInterval(updateTime, 100);
}

vidTimeHolder = document.getElementById('vidTime');

function onProgress() { 
    vidTimeHolder.innerHTML = videotime;
    if (videotime >= 21 && tripReady ==! true){
        addAnimatedMarker();
        markerLocation = animatedMarker.getLatLng();
        map.panTo(markerLocation);
        map.setZoom(11);        
        tripReady = true;
      }
    if (videotime >= 30 && tripStarted ==! true){
        animatedMarker.start();
        tripStarted = true;
    }
    if (tripStarted === true && tripEnded === false && player.getPlayerState() === 1 ){
        markerLocation = animatedMarker.getLatLng();
        map.panTo(markerLocation);
    }
    if (videotime >= 234 && tripEnded ==! true){
        map.removeLayer(animatedMarker);
        map.setZoom(13)
        tripEnded = true;
    } 
}

// 29-30    Start   29
// 1:45-47  Tunnel  105
// 1:54-55  Tunnel  114
// 2:29-31  Tunnel  149
// 2:42-43  Bridge? 162
// 2:53-54  Tunnel  173
// 3:20-25  Tunnel  200
// 3:35-36  Tunnel  215
// 3:48     End     228
 
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && tripStarted == true){
        animatedMarker.start();
    }
    if(event.data != 1 && tripStarted == true && tripEnded == false) {
        animatedMarker.stop();
    }
}

function playVideo(){
    player.playVideo();
}

function pauseVideo(){
    player.pauseVideo();
}

function muteVideo(){
    player.mute();
}

function volumeUp(){
    player.unMute();
    volume = player.getVolume();
    if (volume != 100){
        volume += 10;
        player.setVolume(volume);
    }
}

function volumeDown(){
    player.unMute();
    volume = player.getVolume();
    if (volume != 0){
        volume -= 10;
        player.setVolume(volume);
    }
}



// tweet popup
$('.twitterpopup').click(function(event) {
    var width  = 550,
        height = 420,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = "http://twitter.com/intent/tweet?url=http%3A%2F%2Fbit.ly%2F15toUyb&via=danbjoseph&related=LeafletJS,twbootstrap",
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
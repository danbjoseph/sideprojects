var mapbounds = [];
var pathArray = [];


var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var mapattribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | &copy; <a href="http://danbjoseph.github.io/geo" title="Dan Joseph" target="_blank">Dan Joseph</a> 2013';

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

var railStyle = {
    "color": "red",
    "weight": 5
}

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
                style: railStyle
            }).addTo(map);
            mapbounds = railpath.getBounds();
            map.fitBounds(mapbounds);
            movingdot();
 
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function movingdot(){
    
    animatedMarker = L.animatedMarker(railpath.getLatLngs(), {
        distance: 414,
        interval: 1000,
    });
    map.addLayer(animatedMarker);

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
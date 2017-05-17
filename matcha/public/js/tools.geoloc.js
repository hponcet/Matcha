function loadGeo() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updateLocation);
    }
}
function updateLocation(position) {
    var loc = {latitude: position.coords.latitude, longitude: position.coords.longitude};
        return loc;
}

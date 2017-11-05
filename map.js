
class Heatmap {

  constructor() {}

  update(data) {
    addToFirebase(data);
  }
}

/**
* Data object to be written to Firebase.
*/
var data = {
  sender: null,
  timestamp: null,
  latitude: null,
  longitude: null,
  ip: null,
  // See https://freegeoip.net/json/
};

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // ms

function makeInfoBox(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '2px';
  controlUI.style.marginBottom = '22px';
  controlUI.style.marginTop = '10px';
  controlUI.style.textAlign = 'center';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'grey';
  controlText.style.fontFamily = 'Helvetica, Arial, Sans-Serif';
  controlText.style.fontSize = '100%';
  controlText.style.padding = '6px';
  controlText.textContent = 'blue: all sites available, red: some sites are blocked';
  controlUI.appendChild(controlText);
}

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBJTHqxiXmeZ8ere_TQH_-UgG8bsGWFy-4",
  authDomain: "censormap.firebaseapp.com",
  databaseURL: "https://censormap.firebaseio.com",
  projectId: "censormap",
  storageBucket: "censormap.appspot.com",
  messagingSenderId: "810696107628"
};
firebase.initializeApp(config);

/**
* Starting point for running the program. Authenticates the user.
* @param {function()} onAuthSuccess - Called when authentication succeeds.
*/
function initAuthentication(onAuthSuccess) {
  firebase.auth().signInAnonymously().catch(function(error) {
    console.log('Auth failed!', error);
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      onAuthSuccess();
    } else {
      // User is signed out.
      // ...
    }
    // ...
  });
}

var layers = {};

/**
 * Creates a map object with a click listener and a heatmap.
 */
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40, lng: 45},
    zoom: 3,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off POI.
    },
    {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus, train stations etc.
    }],
    disableDoubleClickZoom: true,
    streetViewControl: false,
  });

  // Create the DIV to hold the control and call the makeInfoBox() constructor
  // passing in this DIV.
  var infoBoxDiv = document.createElement('div');
  makeInfoBox(infoBoxDiv, map);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);

  // For testing:
  // Listen for clicks and add the location of the click to firebase as a ping.
  /*map.addListener('click', function(e) {
    data.latitude = e.latLng.lat();
    data.longitude = e.latLng.lng();
    addToFirebase(data);
  });*/

  // Create a heatmap.
  layers['connections'] = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map,
    radius: 10,
    opacity: 1.0,
    gradient: BLUE_GRADIENT
  });

  // Create a heatmap.
  layers['blocks'] = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map,
    radius: 10,
    opacity: 1.0,
    gradient: RED_GRADIENT
  });

  /*Net.getLocation(function (data) {
    console.log("Moving to user location", data);
    map.panTo(new google.maps.LatLng(data.latitude, data.longitude));
  });*/

  initAuthentication(initFirebase.bind(undefined));
}

var PINGS = [];

/**
 * Set up a Firebase with deletion on pings older than expiryMilliseconds
 * @param {!google.maps.visualization.HeatmapLayer} heatmap The heatmaps to
 * which points are added from Firebase.
 */
function initFirebase() {

  // 1 week before current time.
  var startTime = new Date().getTime() - ONE_WEEK;

  // Reference to the pings in Firebase.
  var pings = firebase.database().ref('pings');

  // Listener for when a ping is added.
  // TODO: get last n
  pings.orderByChild('timestamp').startAt(startTime).on('child_added', onAdded);

  // Remove old data from the heatmap when a point is removed from firebase.
  pings.on('child_removed', onRemoved);
}

var BLOCKS = {};
var CONNS = {};

function onAdded (pingRef) {

  // Get that ping from firebase.
  var ping = pingRef.val();
  var point = new google.maps.LatLng(ping.latitude, ping.longitude);
  var elapsed = new Date().getTime() - ping.timestamp;

  console.log(JSON.stringify(ping));
  PINGS.push(ping);
  // Add the point to a heatmap.
  // We only the first one for each IP
  // TODO: really should be only the last n
  if (ping.blocks) {
    if (!(point in BLOCKS)) { // Only the first one
      BLOCKS[point] = 1;
      console.log(ping.country_code + " block " + ping.blocks);
      layers.blocks.getData().push(point);
    }
  } else {
    if (!(point in CONNS)) {
      CONNS[point] = 1;
      console.log(ping.country_code + " connection");
      layers.connections.getData().push(point);
    }
  }


  // Requests entries older than expiry time (1 week).
  var expiryMilliseconds = Math.max(ONE_WEEK - elapsed, 0);
  // Set client timeout to remove the point after a certain time.
  window.setTimeout(function() {
    // Delete the old point from the database.
    pingRef.ref().remove();
  }, expiryMilliseconds);
}

function onRemoved(pingRef, prevChildKey) {
  for (let layer of layers) {
    var layerData = layer.getData();
    var i = 0;
    while (pingRef.val().latitude != layerData.getAt(i).lat()
      || pingRef.val().longitude != layerData.getAt(i).lng()) {
      i++;
    }
    layerData.removeAt(i);
  };
}

/**
 * Updates the last_message/ path with the current timestamp.
 * @param {function(Date)} addPing After the last message timestamp has been updated,
 *     this function is called with the current timestamp to add the
 *     ping to the firebase.
 */
function getTimestamp(addPing) {
  // Reference to location for saving the last ping time.
  var ref = firebase.database().ref('last_ping/' + data.sender);

  ref.onDisconnect().remove();  // Delete reference from firebase on disconnect.

  // Set value to timestamp.
  ref.set(firebase.database.ServerValue.TIMESTAMP, function(err) {
    if (err) {  // Write to last message was unsuccessful.
      console.log(err);
    } else {  // Write to last message was successful.
      ref.once('value', function(snap) {
        addPing(snap.val());  // Add ping with same timestamp.
      }, function(err) {
        console.warn(err);
      });
    }
  });
}

/**
 * Adds a ping to firebase.
 * @param {Object} data The data to be added to firebase.
 *     It contains the lat, lng, sender and timestamp.
 */
function addToFirebase(data) {
  getTimestamp(function(timestamp) {
    // Add the new timestamp to the record data.
    data.timestamp = timestamp;
    var pings = firebase.database().ref('pings').push(data, function(err) {
      if (err) {  // Data was not written to firebase.
        console.warn(err);
      }
    });
  });
}

const BLUE_GRADIENT = [
  'rgba(0, 0, 255, 0)',
  'rgba(0, 0, 255, 1)'];

const RED_GRADIENT = [
  'rgba(255, 0, 0, 0)',
  'rgba(255, 0, 0, 1)'];

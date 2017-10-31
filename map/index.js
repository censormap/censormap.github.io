res = null;

fetch("https://freegeoip.net/json/").then(function(response) {
  response.json().then(function(data) {
      console.log(data);
      console.log("Sending info for " + data['latitude'] + ", " + data['longitude']);
  });
}).catch(function() {
  console.log("Booo");
});

/**
* Data object to be written to Firebase.
*/
var data = {
  sender: null,
  timestamp: null,
  lat: null,
  lng: null
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
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '100%';
  controlText.style.padding = '6px';
  controlText.textContent = 'The map shows all pings made in the last week.';
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


/**
 * Creates a map object with a click listener and a heatmap.
 */
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
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
  map.addListener('click', function(e) {
    data.lat = e.latLng.lat();
    data.lng = e.latLng.lng();
    addToFirebase(data);
  });

  // Create a heatmap.
  var conn_heatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map,
    radius: 16,
    gradient: 'rgba(127, 0, 63, 1)'
  });

  // Create a heatmap.
  var block_heatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map,
    radius: 16,
    gradient: 'rgba(0, 191, 255, 1)'
  });

  initAuthentication(initFirebase.bind(undefined, conn_heatmap));
  initAuthentication(initFirebase.bind(undefined, block_heatmap));
}

/**
 * Set up a Firebase with deletion on pings older than expiryMilliseconds
 * @param {!google.maps.visualization.HeatmapLayer} heatmap The heatmap to
 * which points are added from Firebase.
 */
function initFirebase(heatmap) {

  // 1 week before current time.
  var startTime = new Date().getTime() - ONE_WEEK;

  // Reference to the pings in Firebase.
  var pings = firebase.database().ref('pings');

  // Listener for when a ping is added.
  // TODO: get last n
  pings.orderByChild('timestamp').startAt(startTime).on('child_added',
    function(snapshot) {

      // Get that ping from firebase.
      var ping = snapshot.val();
      var point = new google.maps.LatLng(ping.lat, ping.lng);
      var elapsed = new Date().getTime() - ping.timestamp;

      // Add the point to  the heatmap.
      if (ping.blocked) {
        block_heatmap.getData().push(point);
      } else {
        conn_heatmap.getData().push(point);
      }

      // Requests entries older than expiry time (1 week).
      var expiryMilliseconds = Math.max(ONE_WEEK - elapsed, 0);
      // Set client timeout to remove the point after a certain time.
      window.setTimeout(function() {
        // Delete the old point from the database.
        snapshot.ref().remove();
      }, expiryMilliseconds);
    }
  );

  // Remove old data from the heatmap when a point is removed from firebase.
  pings.on('child_removed', function(snapshot, prevChildKey) {
    var heatmapData = heatmap.getData();
    var i = 0;
    while (snapshot.val().lat != heatmapData.getAt(i).lat()
      || snapshot.val().lng != heatmapData.getAt(i).lng()) {
      i++;
    }
    heatmapData.removeAt(i);
  });
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

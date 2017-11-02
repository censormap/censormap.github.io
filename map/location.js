

function pong(fn) {
  fetch("https://freegeoip.net/json/").then(function(response) {
    response.json().then(function(data) {
        console.log(data);
        console.log("Sending info for " + data['latitude'] + ", " + data['longitude']);
        fn(data);
    });
  }).catch(function() {
    console.log("Connection failed");
  });
}

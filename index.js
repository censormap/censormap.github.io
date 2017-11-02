
const results = new Results();

const heatmap = new Heatmap();

const net = new Net();


/**
  Fires if the website is up.
**/
function onload(domain) {
  // console.log(e);
  console.log("UP", domain);
  net.report(domain, true);
  results.write(domain, true);
  if (results.finished()) {
    updateMap();
  }
}

/**
  Fires if the website is down.
**/
function onerror(domain) {
  // console.log(e);
  console.log("DOWN", domain);
  net.report(domain, false);
  results.write(domain, false);
  if (results.finished()) {
    updateMap();
  }
}

function updateMap() {
  Net.getLocation(function (data) {
    data['blocks'] = results.blocks;
    heatmap.update(data);
  })
}

// To test the error case:
// net.ping("example.doesnotexist", onload, onerror);

function checkAllDomains () {
  results.start();

  // Check all the domains
  for (var i in DOMAINS) {
    const domain = DOMAINS[i];
    results.write(domain, null);
    net.ping(domain, onload, onerror);
  }
}

checkAllDomains();
window.setInterval(function () {
  checkAllDomains();
}, 10 * 60 * 1000); // ten minutes

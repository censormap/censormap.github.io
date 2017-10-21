const results = new Results();
const net = new Net();

/**
  Fires if the website is up.
**/
function onload(domain) {
  // console.log(e);
  console.log("UP", domain);
  net.report(domain, true);
  results.write(domain, true);
}

/**
  Fires if the website is down.
**/
function onerror(domain) {
  // console.log(e);
  console.log("DOWN", domain);
  net.report(domain, false);
  results.write(domain, false);
}

// To test the error case:
// net.ping("example.doesnotexist", onload, onerror);

// Check all the domains
for (var i in DOMAINS) {
  const domain = DOMAINS[i];
  results.write(domain, null);
  net.ping(domain, onload, onerror);
}

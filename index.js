URLS = [
  // Information and education
  "wikipedia.org", /*"wikimedia.org",*/ "wikibooks.org", "wikimediafoundation.org",
  // Leaks
  /*"wikileaks.org",*/ "liveleak.com",
  // Search engines
  "google.com", "yandex.com", "baidu.com", "bing.com",
  // News and media
  /*"dw.com", "reuters.com"*/ "bbc.com",
  // Communication
  "telegram.org", "telegra.ph", "whatsapp.com", /*"viber.com",*/
  // Social networks
  "twitter.com", "facebook.com", "linkedin.com", "youtube.com", "stackexchange.com",
  // Journalism
  "cpj.org", /*"rsf.org",*/
  // Academic research
  "sci-hub.cc", "arxiv.org",
  // Tor
  "torproject.org",
  // Marketplaces
  "alibaba.com", "amazon.com", "ebay.com",
  // Copyrighted materials
    // TODO
  // Adult
    // TODO
  // Source code
  "apache.org", "github.com", "gitlab.com", "bitbucket.com",
  // TODO: Torrent sites, .onion
];
// TODO: Country-specific TLDs

// TODO:
// Sites without a favicon.ico: viber.com, reuters.com
// Sites with a favicon.ico at another path: rsf.org, wikimedia.org, wikileaks.org
// Sites with a favicon.png: dw.com

const results = new Results();

/**
  Fires if the website is up.
**/
function onload(url, e) {
  // console.log(e);
  console.log("UP", url);
  net.report(url, true);
  results.write(url, true);
}

/**
  Fires if the website is down.
**/
function onerror(url, e) {
  // console.log(e);
  console.log("DOWN", url);
  net.report(url, false);
  results.write(url, false);
}

const net = new Net();

// net.ping("example.doesnotexist", onload, onerror);

// Check all the URLs
for (var i in URLS) {
  net.ping(URLS[i], onload, onerror);
}

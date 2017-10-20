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
  "line.me", "telegram.org", "telegra.ph", "whatsapp.com", /*"viber.com",*/
  // Social networks
  "twitter.com", "facebook.com", "linkedin.com", "stackexchange.com",
  // Video and audio
  "youtube.com", /*"dailymotion.com"*/, "soundcloud.com", "vimeo.com",
  // Journalism
  "cpj.org", /*"rsf.org",*/
  // Academic research
  "sci-hub.cc", "arxiv.org",
  // Tor
  "torproject.org",
  // Marketplaces
  "alibaba.com", "amazon.com", "ebay.com", "rakuten.co.jp",
  // Filesharing
  /*"dropbox.com", "thepiratebay.se",*/ "scribd.com",
  // Adult
    // TODO
  // Source code
  "apache.org", "github.com", "gitlab.com", "bitbucket.com",
  // TODO: Torrent sites, .onion
  // Web archives
  "archive.org"
];
// TODO: Country-specific TLDs

// TODO:
// Sites without a favicon.ico or with a favicon at another path:
// viber.com, reuters.com, rsf.org, wikimedia.org, wikileaks.org, dw.com,
// dailymotion.com
// Sites that are down long-term: thepiratebay.se

const results = new Results();

/**
  Fires if the website is up.
**/
function onload(url) {
  // console.log(e);
  console.log("UP", url);
  net.report(url, true);
  results.write(url, true);
}

/**
  Fires if the website is down.
**/
function onerror(url) {
  // console.log(e);
  console.log("DOWN", url);
  net.report(url, false);
  results.write(url, false);
}

const net = new Net();

// net.ping("example.doesnotexist", onload, onerror);

// Check all the URLs
for (var i in URLS) {
  const url = URLS[i];
  results.write(url, null);
  net.ping(url, onload, onerror);
}

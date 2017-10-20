/**
  Checks if all the URLs are up or down
**/
function check() {
  _URLS.map(_check);
}

_URLS = [
  // Control - DOWN
  "12345", "example.doesnotexist",
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

/**
  Checks if a site or IP is up or down
**/
function _check(url) {
  // TODO: Clear the "test" div if the previous check has finished.
  document.getElementById("test").appendChild(_img(url));
}

/**
  Creates an image with the given URL
**/
function _img(url) {
  var i = new Image();
  i.onerror = function (e) {
    _onerror(url, e);
  };
  i.onload = function (e) {
    _onload(url, e);
  };
  i.src = _src(url)
  return i;
}

/**
  Turns a URL like 'example.com' into a proper image source
**/
function _src(url) {
  // TODO: Check if it already has protocol
  // TODO: Check if it already has path
  // TODO: Remove subdomains
  return "https://" + url + "/favicon.ico";
}

/**
  Fires if the website is down.
**/
function _onerror(url, e) {
  console.log("DOWN", url);
  // console.log(e);
}

/**
  Fires if the website is up.
**/
function _onload(url, e) {
  console.log("UP", url);
  // console.log(e);
}

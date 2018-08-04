const GEOLOC_URL = 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBN7v2VcTeu5OIHx9q31mBd9_14bX86tRg';

class Net {

  static getLocation(fn) {
    // We purposefully do not cache

    fetch(GEOLOC_URL, {method: 'post'})
    .then(function(res) {
      console.log('Geolocation res', res);
      res.json().then(function(data) {
          console.log("location:", data.location);
          fn(data.location);
      }.bind(this));
    }).catch(function(error) {
      console.log('Geolocation failed:', error);
    });
  }

  constructor(onInit) {
    this.div = document.createElement("div");
    this.div.style.display = "none";
    document.getElementsByTagName('body')[0].appendChild(this.div);

    this.location = null;
  }

  /**
    Checks if a site or IP is up or down
  **/
  ping(domain, onload, onerror) {
    // Load an image with a source under that URL.
    // This is a hack to work around CORS
    // TODO: Clear the "test" div if the previous check has finished.
    console.log("Pinging", domain);
    this.div.appendChild(Net._img(domain, onload, onerror));
  }

  /**
    Reports to servers whether a site or IP is up or down for this user
  **/
  report(domain, result) {
    // TODO
  }

  /**
    Creates an image with the given URL
  **/
  static _img(domain, onload, onerror) {
    var i = document.createElement("img");
    i.style.visibility = "hidden";
    if (onload) {
      i.onload = function (e) {
        onload(domain);
      };
    }
    if (onerror) {
      i.onerror = function (e) {
        onerror(domain);
      };
    }
    i.src = Net._url(domain + "/favicon.ico");
    return i;
  }

  /**
    Creates an image with the favicon for the given domain
  **/
  static _favicon(domain, onload, onerror) {
    var i = document.createElement("img");
    i.src = "https://www.google.com/s2/favicons?domain=" + domain;
    return i;
  }

  /**
    Turns a domain like 'example.com' into a proper image source
  **/
  static _url(domain) {
    // TODO: Check if it already has protocol
    // TODO: Check if it already has path
    // TODO: Remove subdomains
    return "https://" + domain + "?nocache=" + Date.now();
  }
}

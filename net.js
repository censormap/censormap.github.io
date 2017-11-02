class Net {

  static getLocation(fn) {
    // We purposefully do not cache
    fetch("https://freegeoip.net/json/").then(function(response) {
      response.json().then(function(data) {
          console.log("location:", data);
          fn(data);
      }.bind(this));
    }).catch(function() {
      console.log("Connection failed");
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

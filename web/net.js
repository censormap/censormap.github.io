
class Net {

  constructor() {
    this.div = document.createElement("div");
    this.div.style.visibility = "hidden";
    document.getElementsByTagName('body')[0].appendChild(this.div);
  }

  /**
    Checks if a site or IP is up or down
  **/
  ping(url, onload, onerror) {
    // Load an image with a source under that URL.
    // This is a hack to work around CORS
    // TODO: Clear the "test" div if the previous check has finished.
    this.div.appendChild(Net._img(url, onload, onerror));
  }

  /**
    Reports to servers whether a site or IP is up or down for this user
  **/
  report(url, result) {
    // TODO
  }

  /**
    Creates an image with the given URL
  **/
  static _img(url, onload, onerror) {
    var i = new Image();
    if (onload) {
      i.onload = function (e) {
        console.log(url, "onload");
        onload(url);
      };
    }
    if (onerror) {
      i.onerror = function (e) {
        console.log(url, "onerror");
        onerror(url);
      };
    }
    i.src = Net._src(url)
    return i;
  }

  /**
    Turns a URL like 'example.com' into a proper image source
  **/
  static _src(url) {
    // TODO: Check if it already has protocol
    // TODO: Check if it already has path
    // TODO: Remove subdomains
    return "https://" + url + "/favicon.ico?nocache=" + Date.now();
  }
}

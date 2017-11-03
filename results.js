
class Results {

  constructor() {
    this.sec = document.createElement("section");
    document.getElementsByTagName('body')[0].appendChild(this.sec);

    this.stats = document.createElement("div");
    this.stats.className = 'stats';
    this.sec.appendChild(this.stats);
    this.stats.innerHTML = "blocked: <span class='start'>none</span>";

    this.list = document.createElement("div");
    this.list.className = 'list';
    this.sec.appendChild(this.list);

    this.started = []
    this.blocks = [];
    this.connections = [];
  }

  /**
    Writes or updates the result in the dashboard
  **/
  write(domain, result) {
    var d = document.getElementById(domain);
    if (!d) {
      var d = document.createElement("span");
      d.className = 'result start';
      d.id = domain;
      var i = Net._favicon(domain);
      i.className = 'favicon';
      d.appendChild(i);
      var s = document.createElement("span");
      s.className = 'domain notranslate';
      s.innerHTML = domain;
      d.appendChild(s);
      this.list.innerHTML += ' ';
      this.list.appendChild(d);
      setTimeout(
        function () {
          if (d.className == 'result start') {
            d.className = 'result late';
          }
        }
      , 3000);
      this.started.push(domain);
    }
    if (result != null) {
      d.className = result? 'result up' : 'result down';
      if (!result) {
        var sep = "";
        if (this.blocks.length == 0) {
          sep = "blocked: ";
          this.stats.innerHTML = '';
        }
        var s = document.createElement("span");
        s.innerHTML = sep;
        this.stats.appendChild(s);
        var s = document.createElement("span");
        s.innerHTML = domain;
        s.className = 'result down';
        this.stats.appendChild(s);
        this.blocks.push(domain);
      } else {
        this.connections.push(domain);
      }
      if (this.blocks.length > 10 && this.connections.length == this.blocks.length) {
        this.stats.innerHTML = "Check your internet connection";
      }
    }
  }

  start() {
    this.started = [];
    this.blocks = [];
    this.connections = [];
  }

  finished() {
    return this.blocks.length + this.connections.length == this.started.length;
  }
}

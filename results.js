
class Results {

  constructor() {
    this.div = document.createElement("div");
    document.getElementsByTagName('body')[0].appendChild(this.div);

    this.stats = document.createElement("div");
    this.stats.className = 'stats';
    this.div.appendChild(this.stats);
    this.stats.innerHTML = "blocked: <span class='start'>none</span>";

    this.list = document.createElement("div");
    this.list.className = 'list';
    this.div.appendChild(this.list);

    this.blocked = [];
    this.errorCount = 0;
    this.totalCount = 0;
  }

  /**
    Writes or updates the result in the dashboard
  **/
  write(domain, result) {
    var d = document.getElementById(domain);
    if (!d) {
      var d = document.createElement("div");
      d.className = 'result start';
      d.id = domain;
      var i = Net._favicon(domain);
      i.className = 'favicon';
      d.appendChild(i);
      var s = document.createElement("span");
      s.className = 'domain notranslate';
      s.innerHTML = domain;
      d.appendChild(s);
      this.list.appendChild(d);
      setTimeout(
        function () {
          if (d.className == 'result start') {
            d.className = 'result late';
          }
        }
      , 3000);
    }
    if (result != null) {
      d.className = result? 'result up' : 'result down';
      if (!result) {
        var sep;
        if (!this.errorCount) {
          sep = "blocked: ";
          this.stats.innerHTML = '';
        } else {
          sep = ", ";
        }
        var s = document.createElement("span");
        s.innerHTML = sep;
        this.stats.appendChild(s);
        var s = document.createElement("span");
        s.innerHTML = domain;
        s.className = 'result down';
        this.stats.appendChild(s);
        this.errorCount += 1;
      }
      this.totalCount += 1;
      if (this.errorCount > 10 && this.totalCount == this.errorCount) {
        this.stats.innerHTML = "Check your internet connection";
      }
    }
  }
}


class Results {

  constructor() {
    this.div = document.createElement("div");
    document.getElementsByTagName('body')[0].appendChild(this.div);

    this.stats = document.createElement("div");
    this.div.appendChild(this.stats);

    this.list = document.createElement("div");
    this.div.appendChild(this.list);

    this.errorCount = 0;
    this.totalCount = 0;
  }

  /**
    Clears the dashboard
  **/
  clear(url, result) {
    this.stats.innerHTML = '';
    this.list.innerHTML = '';
  }

  /**
    Writes or updates the result in the dashboard
  **/
  write(url, result) {
    var d = document.getElementById(url);
    if (!d) {
      var d = document.createElement("div");
      var i = Net._img(url);
      i.style.width = "1em";
      i.style.height = "1em";
      i.style.paddingRight = "10px";
      d.appendChild(i);
      d.style.padding = "5px";
      d.innerHTML += url;
      d.id = url;
      this.list.appendChild(d);
      d.style.color = "lightgrey";
      setTimeout(
        function () {
          if (d.style.color == "lightgrey") {
            d.style.color = "pink";
          }
        }
      , 3000);
    } else {
      d.style.color = result ? "darkgrey" : "red";
      if (!result) {
        this.errorCount += 1;
      }
      this.totalCount += 1;
    }
    if (this.totalCount) {
      this.stats.innerHTML = (100.0 * (this.totalCount - this.errorCount) / this.totalCount) + "%";
    }
  }
}

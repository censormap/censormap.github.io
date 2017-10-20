
class Results {

  constructor() {
    this.div = document.createElement("div");
    document.getElementsByTagName('body')[0].appendChild(this.div);
  }

  /**
    Writes the result to the dashboard
  **/
  write(url, result) {
    var d = document.createElement("div");
    d.innerHTML = url;
    d.id = url;
    d.style.color = result ? "lightgrey" : "red";
    this.div.appendChild(d);
  }
}

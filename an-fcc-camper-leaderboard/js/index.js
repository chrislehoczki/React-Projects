"use strict";

var fccUrl = "http://fcctop100.herokuapp.com/api/fccusers/top/";

var Leaderboard = React.createClass({
  displayName: "Leaderboard",

  //ON LOAD
  componentDidMount: function componentDidMount() {
    //GET ALL TIME DATA
    $.getJSON(
      fccUrl + "alltime",
      function(data) {
        this.setState({ list: data });
      }.bind(this)
    );
  },

  //SET ORIGINAL STATES
  getInitialState: function getInitialState() {
    return {
      list: [],
      header1: "unselected",
      header2: "selected"
    };
  },

  //FUNCTION TO SORT BY 30 DAYS POINTS
  sortRecent: function sortRecent() {
    //RECENT
    $.getJSON(
      fccUrl + "recent",
      function(data) {
        this.setState({ list: data });
      }.bind(this)
    );

    this.setState({ header1: "selected" });
    this.setState({ header2: "unselected" });
  },

  //FUNCTION TO SORT BY ALL TIME POINTS
  sortAll: function sortAll() {
    $.getJSON(
      fccUrl + "alltime",
      function(data) {
        this.setState({ list: data });
      }.bind(this)
    );

    this.setState({ header1: "unselected" });
    this.setState({ header2: "selected" });
  },

  render: function render() {
    return React.createElement(
      "table",
      { className: "table table-striped table-bordered" },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement("th", null, " # "),
          React.createElement("th", null, " Camper Name "),
          React.createElement(
            "th",
            { className: this.state.header1, onClick: this.sortRecent },
            " Points Last 30 Days ▼ ",
            this.state.arrow1,
            " "
          ),
          React.createElement(
            "th",
            { className: this.state.header2, onClick: this.sortAll },
            " All Time Points ▼ ",
            this.state.arrow2,
            " "
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        this.state.list.map(function(item, i) {
          var itemName = item.username;
          return React.createElement(TableRow, {
            number: i,
            name: item.username,
            recentPoints: item.recent,
            allTimePoints: item.alltime,
            img: item.img,
            url: "http://www.freecodecamp.com/" + itemName
          });
        })
      )
    );
  }
});

var TableRow = React.createClass({
  displayName: "TableRow",

  render: function render() {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        { className: "number" },
        "  ",
        this.props.number,
        " "
      ),
      React.createElement(
        "td",
        null,
        " ",
        React.createElement("img", { src: this.props.img }),
        React.createElement(
          "a",
          { target: "_blank", href: this.props.url },
          " ",
          this.props.name,
          " "
        ),
        " "
      ),
      React.createElement("td", null, " ", this.props.recentPoints, " "),
      React.createElement("td", null, " ", this.props.allTimePoints, " ")
    );
  }
});

React.render(
  React.createElement(Leaderboard, null),
  document.getElementById("container")
);

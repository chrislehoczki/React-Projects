"use strict";

//BOARD VARIABLES
var height = 20,
  width = 20,
  cellWidth = 15,
  margin = 2;
var startingCells = 70;
var speed = 750;
//CREATE BOARD
var boardState = createBoard(
  height,
  width,
  cellWidth,
  margin,
  speed,
  startingCells
);
var game; //GLOBAL VAR TO HOLD INTERVAL

//BOARD COMPONENT
var Board = React.createClass({
  displayName: "Board",

  getInitialState: function getInitialState() {
    return boardState;
  },

  componentDidMount: function componentDidMount() {
    //RUN ON START
    this.interval = setInterval(
      function() {
        this.takeTurn();
        this.setState({ generations: this.state.generations + 1 });
      }.bind(this),
      this.state.speed
    );
  },

  takeTurn: function takeTurn() {
    //FUNCTION TO GET LIVE AND DEAD CELLS
    var cells = getCells(this.state);

    //console.log(cells)
    //LOOP THROUGH ALL INNER CELLS
    //find number of specific cell
    var stateObj = {};
    cells.innerCells.deadCells.map(
      function(cell) {
        var number = cell.number;
        var neighbours = [];
        neighbours[0] = this.state[number - 1];
        neighbours[1] = this.state[number + 1];
        neighbours[2] = this.state[number - this.state.width];
        neighbours[3] = this.state[number - this.state.width - 1];
        neighbours[4] = this.state[number - this.state.width + 1];
        neighbours[5] = this.state[number + this.state.width];
        neighbours[6] = this.state[number + this.state.width - 1];
        neighbours[7] = this.state[number + this.state.width + 1];
        //if cell has 3 neighbours - comes alive
        var neighbourCounter = 0;
        neighbours.map(function(neighbour) {
          if (neighbour.status === "alive") {
            neighbourCounter += 1;
          }
        });

        if (neighbourCounter === 3) {
          //BUILD STATE OBJECT TO SET STATE TO ALIVE

          stateObj[number] = {};
          stateObj[number].number = cell.number;
          stateObj[number].status = "alive";

          //SET NEW STATE FOR SPECIFIC CELL
        } //END OF IF
      }.bind(this)
    ); //END OF MAP

    cells.innerCells.aliveCells.map(
      function(cell) {
        var number = cell.number;

        var neighbours = [];
        neighbours[0] = this.state[number - 1];
        neighbours[1] = this.state[number + 1];
        neighbours[2] = this.state[number - this.state.width];
        neighbours[3] = this.state[number - this.state.width - 1];
        neighbours[4] = this.state[number - this.state.width + 1];
        neighbours[5] = this.state[number + this.state.width];
        neighbours[6] = this.state[number + this.state.width - 1];
        neighbours[7] = this.state[number + this.state.width + 1];

        //if cell has 2 or 3 neighbours - it dies
        var neighbourCounter = 0;
        neighbours.map(function(neighbour) {
          if (neighbour.status === "alive") {
            neighbourCounter += 1;
          }
        });

        if (neighbourCounter < 2 || neighbourCounter > 3) {
          stateObj[number] = {};
          stateObj[number].number = cell.number;
          stateObj[number].status = "dead";
        } //END OF IF
      }.bind(this)
    ); //END OF MAP

    //IF CELL IS ON OUTSIDE, DESTROY IT
    cells.outerCells.allCells.map(function(cell) {
      var number = cell.number;
      stateObj[number] = {};
      stateObj[number].number = cell.number;
      stateObj[number].status = "dead";
    }); //END OF MAP

    //SET NEW STATE
    this.setState(stateObj);
  },

  startGame: function startGame() {
    //SETS INTERVAL AND RUNS GAME FUNCTION EACH SEC
    clearInterval(this.interval);
    this.interval = setInterval(
      function() {
        this.takeTurn();
        this.setState({ generations: this.state.generations + 1 });
      }.bind(this),
      this.state.speed
    );
  },

  stopGame: function stopGame() {
    clearInterval(this.interval);
  },

  resetGame: function resetGame() {
    clearInterval(this.interval);
    var newState = createBoard(
      this.state.height,
      this.state.width,
      cellWidth,
      margin,
      this.state.speed
    );
    this.setState(newState);
  },

  convert: function convert(state, number) {
    //CREATE NEW STATE OBJ FROM ARGS FOR SPECIFIC CELL

    var stateObj = {};
    stateObj[number] = {};
    stateObj[number].number = number;
    stateObj[number].status = state;
    this.setState(stateObj);
  },

  changeSpeed: function changeSpeed(speed) {
    clearInterval(this.interval);
    var newSpeed;
    if (speed === "Slow") {
      newSpeed = 750;
    } else if (speed === "Medium") {
      newSpeed = 500;
    } else {
      newSpeed = 250;
    }

    this.setState({ speed: newSpeed }, function() {
      console.log(this.state.speed);
    });
    this.interval = setInterval(
      function() {
        this.takeTurn();
        this.setState({ generations: this.state.generations + 1 });
      }.bind(this),
      this.state.speed
    );
  },

  changeWidth: function changeWidth(value) {
    var newWidth = value;
    clearInterval(this.interval);
    var height = this.state.height;
    var boardState = createBoard(height, +newWidth, cellWidth, margin, speed);
    this.setState(boardState, function() {
      console.log("width: " + this.state.width + "size: " + this.state.size);
    });
  },

  changeHeight: function changeHeight(value) {
    var newHeight = value;
    var width = this.state.width;
    clearInterval(game);
    var boardState = createBoard(+newHeight, width, cellWidth, margin, speed);
    this.setState(boardState, function() {
      console.log("height: " + this.state.height + "size: " + this.state.size);
    });
  },

  render: function render() {
    //CREATE BOARD STYLES - RETURNS styles object with cell and board keys
    var styles = createStyles(this.state);

    //CREATE CELLS
    var cells = [];
    for (var i = 0; i < this.state.size; i++) {
      cells.push(
        React.createElement(Cell, {
          styling: styles.cell,
          status: this.state[i].status,
          number: i,
          convert: this.convert
        })
      );
    }

    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(ButtonGroup, {
        startGame: this.startGame,
        stopGame: this.stopGame,
        resetGame: this.resetGame
      }),
      React.createElement(
        "span",
        { className: "generation" },
        " ",
        this.state.generations,
        " "
      ),
      React.createElement(
        "div",
        { className: "board-container" },
        React.createElement(
          "div",
          { className: "board", style: styles.board },
          cells
        ),
        React.createElement(InputGroup, {
          changeSpeed: this.changeSpeed,
          changeWidth: this.changeWidth,
          changeHeight: this.changeHeight
        })
      )
    );
  }
});

var ButtonGroup = React.createClass({
  displayName: "ButtonGroup",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "btn btn-primary", onClick: this.props.startGame },
        " Start "
      ),
      React.createElement(
        "div",
        { className: "btn btn-primary", onClick: this.props.stopGame },
        " Stop "
      ),
      React.createElement(
        "div",
        { className: "btn btn-primary", onClick: this.props.resetGame },
        " Reset "
      )
    );
  }
});

var InputGroup = React.createClass({
  displayName: "InputGroup",

  changeWidth: function changeWidth(value) {
    this.props.changeWidth(value);
  },

  changeHeight: function changeHeight(value) {
    this.props.changeHeight(value);
  },

  changeSpeed: function changeSpeed(value) {
    this.props.changeSpeed(value);
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "form",
        { className: "form" },
        React.createElement(FieldSet, {
          onChange: this.changeWidth,
          name: "Width",
          options: [20, 30, 40, 50]
        }),
        React.createElement(FieldSet, {
          onChange: this.changeHeight,
          name: "Height",
          options: [20, 30, 40, 50]
        }),
        React.createElement(FieldSet, {
          onChange: this.changeSpeed,
          name: "Speed",
          selected: [false, "selected", false],
          options: ["Slow", "Medium", "Fast"]
        })
      )
    );
  }
});

var FieldSet = React.createClass({
  displayName: "FieldSet",

  getInitialState: function getInitialState() {
    return { value: "Slow" };
  },

  onChange: function onChange(event) {
    var value = event.target.value;
    this.props.onChange(value);
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "control" },
      React.createElement(
        "fieldset",
        null,
        React.createElement("label", { for: "height" }, this.props.name),
        React.createElement(
          "select",
          { onChange: this.onChange, id: "height" },
          this.props.options.map(function(option) {
            return React.createElement("option", null, " ", option, " ");
          })
        )
      )
    );
  }
});

var Cell = React.createClass({
  displayName: "Cell",

  getInitialState: function getInitialState() {
    return { status: this.props.status, number: this.props.number };
  },

  changeState: function changeState() {
    if (this.props.status === "alive") {
      //MAKE DEAD
      this.props.convert("dead", this.state.number);
    } else {
      //MAKE ALIVE
      this.props.convert("alive", this.state.number);
    }
  },

  render: function render() {
    return React.createElement("div", {
      style: this.props.styling,
      onClick: this.changeState,
      className: this.props.status
    });
  }
});

ReactDOM.render(
  React.createElement(Board, null),
  document.getElementById("board")
);

//CREATE BOARD LAYOUT FROM VALUES
function createBoard(height, width, cellWidth, margin, speed, options) {
  var boardSize = height * width;

  if (options) {
    console.log(options);
    var randomArray = [];
    for (var i = 0; i < options; i++) {
      randomArray.push(Math.floor(Math.random() * boardSize));
    }
  }
  console.log(randomArray);

  var boardState = {};
  for (var i = 0; i < boardSize; i++) {
    boardState[i] = {};
    boardState[i].number = i;
    boardState[i].status = "dead";

    if (options) {
      if (randomArray.indexOf(i) > -1) {
        boardState[i].status = "alive";
      }
    }
  }

  boardState.height = height;
  boardState.width = width;
  boardState.size = width * height;
  boardState.cellWidth = cellWidth;
  boardState.margin = margin;
  boardState.speed = speed;
  boardState.generations = 0;
  return boardState;
}

//CREATE BOARD AND CELL STYLES
function createStyles(state) {
  //SET BOARD SIZE
  var boardStyle = {
    width: state.width * state.cellWidth + state.width * state.margin * 2 + "px"
  };

  var cellStyle = {
    width: state.cellWidth + "px",
    height: state.cellWidth + "px",
    margin: state.margin + "px",
    display: "inline",
    float: "left"
  };

  return { board: boardStyle, cell: cellStyle };
}

//FUNCTION TO GET LIVE AND DEAD CELLS AT ANY MOMENT
function getCells(state) {
  //GET CELLS ARRAY
  var cells = [];
  for (var i = 0; i < state.size; i++) {
    cells.push(state[i]);
  }

  //STORE REFS TO OUTER CELLS IN OBJ
  var outside = {
    top: [],
    bottom: [],
    left: [],
    right: []
  };

  //GET NUMBER OF SIDE NUMBERS TO USE ON OUTSIDE
  var sideNumber = state.height - 2;

  //POPULATE LEFT SIDE
  var counter = 0;
  for (var i = state.width; i < state.size; i += state.width) {
    if (counter < sideNumber) {
      outside.left.push(state[i].number);
    }
    counter += 1;
  }

  //POPULATE RIGHT SIDE

  var counter = 0;
  for (var i = state.width * 2 - 1; i < state.size; i += state.width) {
    if (counter < sideNumber) {
      outside.right.push(state[i].number);
    }
    counter += 1;
  }

  //POPULATE TOP
  for (var i = 0; i < state.width; i++) {
    outside.top.push(state[i].number);
  }

  //POPULATE BOTTOM
  for (var i = state.size - state.width; i < state.size; i++) {
    outside.bottom.push(state[i].number);
  }

  //GET OUTER CELLS
  var outerCells = cells.filter(function(obj) {
    var top = outside.top.indexOf(obj.number) > -1;
    var bottom = outside.bottom.indexOf(obj.number) > -1;
    var left = outside.left.indexOf(obj.number) > -1;
    var right = outside.right.indexOf(obj.number) > -1;

    return bottom + top + left + right;
  });

  var outerCellNumbers = [];
  for (var i = 0; i < outerCells.length; i++) {
    outerCellNumbers.push(outerCells[i].number);
  }

  //GET INNER CELLS
  var innerCells = cells.filter(function(obj) {
    return outerCellNumbers.indexOf(obj.number) === -1;
  });

  //FIRST WORK ON INNER CELLS
  var innerDeadCells = innerCells.filter(function(obj) {
    return obj.status === "dead";
  });

  var innerAliveCells = innerCells.filter(function(obj) {
    return obj.status === "alive";
  });

  //NOW OUTER CELLS
  var outerDeadCells = outerCells.filter(function(obj) {
    return obj.status === "dead";
  });

  var outerAliveCells = outerCells.filter(function(obj) {
    return obj.status === "alive";
  });

  return {
    innerCells: {
      allCells: innerCells,
      aliveCells: innerAliveCells,
      deadCells: innerDeadCells
    },
    outerCells: {
      allCells: outerCells,
      aliveCells: outerAliveCells,
      deadCells: outerDeadCells
    }
  };
}

function makeFooter() {
  var html = "<footer><ul>";
  html += "<ul>";
  html +=
    "<li><a target='_blank' href='http://blog.cphillips.co.uk'> Blog </a> </li>";
  html +=
    "<li><a target='_blank' href='http://cphillips.co.uk'> Portfolio </a> </li>";
  $("body").append(html);
}

makeFooter();

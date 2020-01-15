var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;

//STOP SCROLLING
window.addEventListener(
  "keydown",
  function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  },
  false
);

var width = 40;
var height = 40;

var weapons = [
  { name: "stick", damage: 3, ammo: 1000 },
  { name: "pistol", damage: 6, ammo: 10 },
  { name: "shotgun", damage: 8, ammo: 5 },
  { name: "machine gun", damage: 12, ammo: 3 },
  { name: "bazooka", damage: 15, ammo: 2 },
  { name: "rail gun", damage: 25, ammo: 1 }
];

//GET TILES FOR BOARD
var tiles = generateBoard();

//CREATE GAME DEFAULTS
var game = {
  health: 10,
  weapons: [weapons[0]],
  currentWeapon: "stick",
  level: 0,
  attack: 5,
  nextLevel: 20,
  board: tiles,
  message: "Welcome to the game. Updates will appear here.",
  alertStyle: "alert-info",
  buttonText: "Show Board"
};

var Board = React.createClass({
  getInitialState: function() {
    return game;
  },

  componentDidMount: function() {
    window.addEventListener("keydown", this.movePlayer, false);
    this.hideBoard();
    this.addPlayerSurrounds();
  },

  startGame: function() {
    var tiles = generateBoard();
    var game = {
      health: 10,
      weapons: [weapons[0]],
      currentWeapon: "stick",
      level: 0,
      attack: 5,
      nextLevel: 20,
      board: tiles,
      message: "Welcome to the game. Updates will appear here.",
      alertStyle: "alert-info",
      buttonText: "Show Board"
    };
    this.setState(game);
    this.hideBoard();
    this.addPlayerSurrounds();
  },

  addWeapon: function(weaponName) {
    var attackValue;
    var currentWeapons = this.state.weapons;
    weapons.forEach(function(weapon) {
      if (weapon.name === weaponName) {
        currentWeapons.push(weapon);
        attackValue = weapon.damage;
      }
    });

    this.setState({ message: "Nice, you picked up a " + weaponName });
    this.setState({ weapons: currentWeapons }, console.log(this.state));
  },

  changeWeapon: function(weapon) {
    var attackValue;
    console.log("weapon" + weapon);
    weapons.forEach(function(arrayWeapon) {
      console.log("weapon from array" + JSON.stringify(weapon));
      if (arrayWeapon.name === weapon) {
        attackValue = arrayWeapon.damage;
        console.log("working");
      }
    });

    this.setState({ currentWeapon: weapon, attack: attackValue });
  },

  addHealth: function(amount) {
    this.setState({ message: "Nice, you picked up " + amount + " health." });
    this.setState({ health: this.state.health + amount });
  },

  hideBoard: function() {
    var board = this.state.board;
    board.map(function(tile) {
      tile.screenClass = "hide";
    });
    this.setState({ board: board, buttonText: "Show Board" });
  },

  toggleBoard: function() {
    if (this.state.buttonText === "Show Board") {
      var board = this.state.board;
      board.map(function(tile) {
        tile.screenClass = "";
      });

      this.setState({ board: board, buttonText: "Hide Board" });
    } else {
      this.hideBoard();
    }
  },

  addPlayerSurrounds: function() {
    var player;
    var board = this.state.board;
    //GET PLAYER
    board.map(function(tile) {
      if (tile.class === "player") {
        player = tile;
      }
    });

    board.map(function(tile) {
      if (
        tile.x > player.x - 5 &&
        tile.x < player.x + 5 &&
        tile.y > player.y - 5 &&
        tile.y < player.y + 5
      ) {
        tile.screenClass = "show";
      }
      if (tile.x === player.x && tile.y === player.y) {
        tile.screenClass = "";
      }
    });

    this.setState({ board: board });
  },

  showMessage: function(message) {
    this.setState({ message: message });
  },

  movePlayer: function(e) {
    var component = this;
    var board = this.state.board;

    if (e.keyCode === 37) {
      movePlayer("left");
    } else if (e.keyCode === 38) {
      movePlayer("up");
    } else if (e.keyCode === 39) {
      movePlayer("right");
    } else if (e.keyCode === 40) {
      movePlayer("down");
    }

    var component = this;

    function movePlayer(direction) {
      function removePlayer(board) {
        //REMOVE CLASS FROM OLD PLAYER TILE
        board.map(function(tile) {
          if (tile.class === "player") {
            tile.class = "empty";
          }
        });
      }

      function getTileByCoord(x, y) {
        var returnedTile;
        board.forEach(function(tile) {
          if (tile.x === x && tile.y === y) {
            console.log(tile);
            returnedTile = tile;
          }
        });

        return returnedTile;
      }

      var player;
      //GET PLAYER
      board.map(function(tile) {
        if (tile.class === "player") {
          player = tile;
        }
      });

      //IF ON EDGE OF BOARD - RETURN EARLY
      if (player.x === 1 && direction === "left") {
        return;
      } else if (player.x === width && direction === "right") {
        return;
      } else if (player.y === 1 && direction === "down") {
        return;
      } else if (player.y === width && direction === "up") {
        return;
      }

      //GET PLAYER SURROUNDS
      var left = getTileByCoord(player.x - 1, player.y);
      var right = getTileByCoord(player.x + 1, player.y);
      var up = getTileByCoord(player.x, player.y + 1);
      var down = getTileByCoord(player.x, player.y - 1);

      //IF WALLS - RETURN EARLY
      if (left) {
        if (left.class === "wall" && direction === "left") {
          console.log("trying to go too far left");
          return;
        }
      }

      if (right) {
        if (right.class === "wall" && direction === "right") {
          console.log("trying to go too far right");
          return;
        }
      }

      if (up) {
        if (up.class === "wall" && direction === "up") {
          console.log("trying to go too far up");
          return;
        }
      }

      if (down) {
        if (down.class === "wall" && direction === "down") {
          console.log("trying to go too far down");
          return;
        }
      }

      //OTHERWISE CALCULATE PLAYER COORD CHANGE
      var xChange = 0;
      var yChange = 0;
      if (direction === "down") {
        xChange = 0;
        yChange = -1;
      } else if (direction === "up") {
        xChange = 0;
        yChange = 1;
      } else if (direction === "left") {
        xChange = -1;
        yChange = 0;
      } else if (direction === "right") {
        xChange = 1;
        yChange = 0;
      }

      //DECIDE OUTCOME BASED ON TILE CLASS
      board.map(function(tile) {
        if (tile.x === player.x + xChange && tile.y === player.y + yChange) {
          //IF WEAPON, PICK IT UP
          if (tile.class === "weapon") {
            component.addWeapon(tile.weaponName);
          }

          //IF HEALTH, PICK IT UP
          if (tile.class === "life") {
            component.addHealth(tile.amount);
          }
          //IF ENEMY, FIGHT
          if (tile.class === "enemy" || tile.class === "boss") {
            //FUNCTION TO GET RANDOM NUMBER BETWEEN 2 EITHER SIDE OF ATTACK VALUE
            function randomiseAttack(value) {
              var upper = value + 1;
              var lower = value - 1;
              return Math.floor(Math.random() * (upper - lower + 1)) + lower;
              return Math.floor(Math.random() * (upper - lower + 1)) + lower;
            }

            //FIND AND UPDATE WEAPON AMMO

            var stateWeapons = component.state.weapons;
            var currentWeapon = component.state.currentWeapon;
            var ammoLeft = true;

            stateWeapons.forEach(function(weapon) {
              if (weapon.name === currentWeapon) {
                if (weapon.ammo === 0) {
                  component.setState({
                    message:
                      "You have no ammo left for that weapon. You must choose another."
                  });
                  ammoLeft = false;
                } else {
                  weapon.ammo -= 1;
                }
              }
            });

            if (!ammoLeft) {
              return;
            }

            //REDUCE LIFE OF ENEMY

            if (tile.life > 0) {
              var damage =
                randomiseAttack(component.state.attack) + component.state.level;
              tile.life -= damage;

              component.setState({
                health: component.state.health - randomiseAttack(tile.strength)
              });
              component.setState(
                { weapons: stateWeapons, currentWeapon: currentWeapon },
                console.log(component.state)
              );
              component.setState({
                message:
                  "You did " + damage + " damage. Enemy Life: " + tile.life
              });

              if (component.state.health <= 0) {
                component.setState({
                  alertStyle: "alert-danger",
                  message: "Oh no! You died......"
                });
                setTimeout(function() {
                  component.startGame();
                }, 3000);
                return;
              }

              if (tile.life > 0) {
                return;
              }
              //DEAD - ADD XP
              else {
                component.setState({ message: "You killed the thing, nice" });
                if (component.state.nextLevel === 10) {
                  component.setState({
                    level: component.state.level + 1,
                    nextLevel: 20
                  });
                } else {
                  component.setState({
                    nextLevel: component.state.nextLevel - 10
                  });
                }
              }
            }
          }

          //REMOVE CURRENT PLAYER
          removePlayer(board);
          //MAKE THE TILE THE PLAYER
          tile.class = "player";
          component.hideBoard();
          component.addPlayerSurrounds();

          //CHANGE STATE
          component.setState({ board: board });
        }
      });
    }
  },

  render: function() {
    return (
      <div>
        <Title />
        <WeaponsSelect
          weapons={this.state.weapons}
          weapon={this.state.currentWeapon}
          onChange={this.changeWeapon}
        />
        <State board={this.state} />
        <MessageBox
          message={this.state.message}
          alertStyle={this.state.alertStyle}
        />
        <Dungeon tiles={this.state.board} />
        <Button bsStyle="btn btn-primary" onClick={this.toggleBoard}>
          {" "}
          Get a Hint{" "}
        </Button>
        <Key />
      </div>
    );
  }
});

var Title = React.createClass({
  render: function() {
    return (
      <div className="title">
        <h1>Rogue Like? </h1>
        <h2> Built with React.js</h2>
      </div>
    );
  }
});

var Key = React.createClass({
  render: function() {
    return (
      <div className="key">
        <ul>
          <li>
            {" "}
            <div className="boss"></div> <p> Boss </p>{" "}
          </li>
          <li>
            {" "}
            <div className="enemy"></div> <p> Enemy </p>{" "}
          </li>
          <li>
            {" "}
            <div className="weapon"></div> <p> Weapon </p>{" "}
          </li>
          <li>
            {" "}
            <div className="life"></div> <p> Life </p>{" "}
          </li>
        </ul>
      </div>
    );
  }
});

var Tile = React.createClass({
  render: function() {
    var style = {};
    if (this.props.state.screenClass === "hide") {
      style.backgroundColor = "black";
    }

    return <span style={style} className={this.props.state.class}></span>;
  }
});

var WeaponsSelect = React.createClass({
  getInitialState: function() {
    return {
      weapon: this.props.weapon
    };
  },

  componentDidMount: function() {
    console.log(this.state);
  },

  handleSelect: function(e) {
    var selectedWeapon = e.target.value;
    this.setState({ weapon: selectedWeapon }, console.log(this.state));
    this.props.onChange(selectedWeapon);
    document.getElementById("select-box").blur();
  },

  render: function() {
    var component = this;
    var weaponOptions = [];
    this.props.weapons.map(function(weapon) {
      weaponOptions.push(
        <option key={weapon.name} value={weapon.name}>
          {" "}
          {weapon.name}{" "}
        </option>
      );
    });

    return (
      <div className="weapons-select">
        <p className="weapons-select-text"> Change Weapon </p>
        <select
          id="select-box"
          onChange={component.handleSelect}
          value={this.state.weapon}
        >
          {weaponOptions}
        </select>
      </div>
    );
  }
});

var State = React.createClass({
  render: function() {
    var weapons = this.props.board.weapons;
    var currentWeapon = this.props.board.currentWeapon;
    var ammo;
    weapons.map(function(weapon) {
      if (weapon.name === currentWeapon) {
        ammo = weapon.ammo;
      }
    });

    return (
      <div className="state">
        <ul>
          <li> Health: {this.props.board.health} </li>
          <li> Current Level: {this.props.board.level} </li>
          <li> Attack: {this.props.board.attack} </li>
          <li> Weapon: {this.props.board.currentWeapon} </li>
          <li> Ammo: {ammo} </li>
          <li> Next Level: {this.props.board.nextLevel} XP </li>
        </ul>
      </div>
    );
  }
});

var MessageBox = React.createClass({
  render: function() {
    var buttonClass = "alert " + this.props.alertStyle;
    return <div className={buttonClass}>{this.props.message}</div>;
  }
});

var Dungeon = React.createClass({
  render: function() {
    var boardStyle = {
      width: width * 10 + "px",
      margin: "0px auto",
      padding: "0px",
      clear: "both"
    };

    return (
      <div className="board-container">
        <div style={boardStyle} className="board">
          {this.props.tiles.map(function(tile) {
            return <Tile state={tile} />;
          })}
        </div>
      </div>
    );
  }
});

ReactDOM.render(<Board />, document.getElementById("react-holder"));

function generateBoard() {
  function createBoundary(x1, x2, y1, y2) {
    cells.forEach(function(cell) {
      if (cell.x >= x1 && cell.x <= x2 && cell.y >= y1 && cell.y <= y2) {
        cell.class = "wall";
      }
    });
  }

  function createGate(x, y) {
    cells.forEach(function(cell) {
      if (cell.x === x && cell.y === y) {
        cell.class = "empty";
      }
    });
  }

  function getFreeTiles(cells) {
    var freeTiles = [];
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].class === "empty") {
        freeTiles.push(i);
      }
    }
    return freeTiles;
  }

  function randomFreeTile(freeTiles) {
    var random = Math.floor(Math.random() * freeTiles.length);
    return freeTiles[random];
  }

  //BOX WITH HOLE IN BOTTOM AND RIGHT
  function box(x, y, size, gateLeft, gateRight, gateTop, gateBottom) {
    //BOTTOM
    createBoundary(x, x + size, y, y);
    //TOP
    createBoundary(x, x + size, y + size, y + size);
    //RIGHT
    createBoundary(x + size, x + size, y, y + size);
    //LEFT
    createBoundary(x, x, y, y + size);

    if (gateLeft) {
      console.log("left gate");
      createGate(x + size, y + Math.ceil(size / 2));
    }
    if (gateRight) {
      console.log("right gate");
      createGate(x + size, y + Math.ceil(size / 2));
    }
    if (gateTop) {
      console.log("top gate");
      createGate(x + Math.ceil(size / 2), y + size);
    }
    if (gateBottom) {
      console.log("bottom gate");
      createGate(x, y + Math.ceil(size / 2));
    }
  }

  var cells = [];
  var boardSize = width * height;
  var upperLimit = width;
  var lowerLimit = 0;
  var offset = 0;

  for (var i = 1; upperLimit <= boardSize; i++) {
    var coord = {};

    if (i <= upperLimit && i > lowerLimit) {
      coord.x = i - lowerLimit;
      coord.y = width - offset;
      cells.push(coord);

      if (i === upperLimit) {
        upperLimit += width;
        lowerLimit += width;
        offset += 1;
      }
    }
  }
  //CREATE EMPTY CELLS
  cells.forEach(function(cell) {
    cell.class = "empty";
  });

  //CREATE GAME BOXES
  box(1, 1, 10, false, true, true, false);
  box(20, 20, 10, false, false, true, true);
  box(10, 30, 8, false, true, true, false);
  box(25, 5, 10, false, false, true, true);
  box(6, 20, 10, false, false, true, true);
  box(15, 4, 10, false, false, true, true);
  box(30, 30, 6, true, false, false, true);

  //CREATE PLAYER
  cells[500].class = "player";

  //CREAT RANDOM ENEMIES, WEAPONS, AND LIFE

  var enemyNumber = 7;
  var lifeNumber = 3;

  //BADDIES

  for (var i = 0; i < enemyNumber; i++) {
    var freeTiles = getFreeTiles(cells);
    var index = randomFreeTile(freeTiles);

    var randomStrength = Math.floor(Math.random() * 6) + 1;
    var randomLife = Math.floor(Math.random() * 20) + 5;

    cells[index].class = "enemy";
    cells[index].life = randomLife;
    cells[index].strength = randomStrength;
  }

  //THE BOSS
  var freeTiles = getFreeTiles(cells);
  var index = randomFreeTile(freeTiles);

  cells[index].class = "boss";
  cells[index].life = 50;
  cells[index].strength = 20;

  //LIVES

  for (var i = 0; i < lifeNumber; i++) {
    var freeTiles = getFreeTiles(cells);
    var index = randomFreeTile(freeTiles);
    cells[index].class = "life";
    cells[index].amount = 5;
  }

  //WEAPONS

  for (var i = 1; i < weapons.length; i++) {
    var freeTiles = getFreeTiles(cells);
    var index = randomFreeTile(freeTiles);
    cells[index].class = "weapon";
    cells[index].weaponName = weapons[i].name;
  }
  return cells;
}

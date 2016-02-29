"use strict";

//GET REACT BOOTSTRAP COMPONENTS

var ButtonGroup = ReactBootstrap.ButtonGroup;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var Panel = ReactBootstrap.Panel;
var PanelGroup = ReactBootstrap.PanelGroup;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Input = ReactBootstrap.Input;
var Accordion = ReactBootstrap.Accordion;

//STARTING RECIPES ARRAY FOR FIRST USER
var recipesArray = [{ id: 0, name: "Tom Yam Soup",
  ingredients: ["Galangal", "Lemongrass", "Limejuice", "Vegetables"]
}, { id: 1, name: "Pad Thai",
  ingredients: ["Noodles", "Soy Sauce", "Vegetables", "Peanuts", "Bamboo Shoots"]
}];

//SET LOCAL STORAGE AS STRINGIFIED ARRAY
function setLocalStorage() {
  var recipesLocal = JSON.stringify(recipesArray);
  localStorage.setItem("recipes", recipesLocal);
}

//GET LOCAL STORAGE AS JSON OBJECT
function getLocalStorage() {
  var recipesGlobal = localStorage.getItem("recipes");
  recipesGlobal = JSON.parse(recipesGlobal);

  if (recipesGlobal && recipesGlobal.length > 1) {
    recipesArray = recipesGlobal;
  }
}
//GET LOCAL STORAGE TO BEGIN WITH
getLocalStorage();

//CONTAINER TO HOLD ALL RECIPES
var MyContainer = React.createClass({
  displayName: "MyContainer",
  getInitialState: function getInitialState() {
    return {
      showModal: false
    };
  },

  close: function close() {
    this.setState({ showModal: false });
  },

  show: function show() {
    this.setState({ showModal: true });
  },

  update: function update() {
    this.forceUpdate();
  },

  render: function render() {

    return React.createElement(
      "div",
      null,
      React.createElement(
        PanelGroup,
        { accordion: true },
        recipesArray.map(function (recipe) {
          return React.createElement(MyPanel, { key: recipe.id, name: recipe.name, ingredients: recipe.ingredients, update: this.update });
        }.bind(this))
      ),
      React.createElement(AddRecipeModal, { show: this.state.showModal, onHide: this.close }),
      React.createElement(
        Button,
        { onClick: this.show, block: true, bsStyle: "success" },
        " Add Recipe "
      )
    );
  }
});

//PANEL FOR EACH RECIPE
var MyPanel = React.createClass({
  displayName: "MyPanel",
  getInitialState: function getInitialState() {
    return {
      showModal: false
    };
  },

  close: function close() {
    this.setState({ showModal: false });
  },

  show: function show() {
    this.setState({ showModal: true });
  },

  delete: function _delete() {

    var recipeName = this.props.name;
    var counter = 0;
    while (counter < recipesArray.length) {
      if (recipesArray[counter].name === recipeName) {
        recipesArray.splice(counter, counter + 1);
        this.props.update();
        setLocalStorage();
        return;
      }
      counter += 1;
    }
  },

  render: function render() {

    return React.createElement(
      Panel,
      { collapsible: true, defaultCollapsed: true, header: this.props.name },
      React.createElement(MyListGroup, { ingredients: this.props.ingredients }),
      React.createElement(
        Button,
        { onClick: this.delete, bsStyle: "danger" },
        "Delete"
      ),
      React.createElement(
        Button,
        { onClick: this.show, bsStyle: "success smallbuttons" },
        "Edit"
      ),
      React.createElement(EditRecipeModal, { show: this.state.showModal, name: this.props.name, ingredients: this.props.ingredients, onHide: this.close, update: this.props.update })
    );
  }

});

//LIST GROUP FOR EACH PANEL
var MyListGroup = React.createClass({
  displayName: "MyListGroup",

  render: function render() {

    return React.createElement(
      "div",
      null,
      React.createElement(
        ListGroup,
        null,
        this.props.ingredients.map(function (ingredient) {
          return React.createElement(
            ListGroupItem,
            null,
            " ",
            ingredient,
            " "
          );
        })
      )
    );
  }
});

//MODAL TO ADD RECIPE
var AddRecipeModal = React.createClass({
  displayName: "AddRecipeModal",

  getInitialState: function getInitialState() {

    return { name: this.props.name,
      ingredients: this.props.ingredients
    };
  },

  addName: function addName(event) {
    this.setState({ name: event.target.value });
  },

  addIngredients: function addIngredients(event) {
    this.setState({ ingredients: event.target.value });
  },

  addRecipe: function addRecipe() {

    var ingredients = this.state.ingredients;
    ingredients = ingredients.split(",");
    var newRecipe = {
      id: recipesArray.length,
      name: this.state.name,
      ingredients: ingredients
    };

    recipesArray.push(newRecipe);
    this.props.onHide();
    setLocalStorage();
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Modal,
        { show: this.props.show },
        React.createElement(
          Modal.Header,
          null,
          React.createElement(
            Modal.Title,
            null,
            "Add Your Recipe"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(Input, { type: "text", label: "Recipe Name", onChange: this.addName }),
          React.createElement(Input, { type: "text", label: "Ingredients", placeholder: "Enter your ingredients separated by a comma.", onChange: this.addIngredients })
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { onClick: this.props.onHide },
            "Close"
          ),
          React.createElement(
            Button,
            { bsStyle: "primary", onClick: this.addRecipe },
            "Save changes"
          )
        )
      )
    );
  }
});

//MODAL TO EDIT RECIPE
var EditRecipeModal = React.createClass({
  displayName: "EditRecipeModal",

  getInitialState: function getInitialState() {
    return { name: this.props.name,
      ingredients: this.props.ingredients
    };
  },

  addName: function addName(event) {
    this.setState({ name: event.target.value });
  },

  addIngredients: function addIngredients(event) {
    this.setState({ ingredients: event.target.value });
  },

  addRecipe: function addRecipe() {
    var ingredients = this.state.ingredients;
    ingredients = ingredients.split(",");

    var recipeName = this.props.name;
    var counter = 0;
    while (counter < recipesArray.length) {

      if (recipesArray[counter].name === recipeName) {
        recipesArray[counter].name = this.state.name;
        recipesArray[counter].ingredients = ingredients;
        this.props.onHide();
        this.props.update();
        this.props.success();
        setLocalStorage();
        return;
      }
      counter += 1;
    }
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "static-modal" },
      React.createElement(
        Modal,
        { show: this.props.show },
        React.createElement(
          Modal.Header,
          null,
          React.createElement(
            Modal.Title,
            null,
            "Edit Your Recipe"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(Input, { type: "text", label: "Recipe Name", value: this.state.name, onChange: this.addName }),
          React.createElement(Input, { type: "text", label: "Ingredients", value: this.state.ingredients, onChange: this.addIngredients })
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { onClick: this.props.onHide },
            "Close"
          ),
          React.createElement(
            Button,
            { bsStyle: "primary", onClick: this.addRecipe },
            "Save changes"
          )
        )
      )
    );
  }
});

//RENDER CONTAINER

React.render(React.createElement(MyContainer, null), document.getElementById("recipeBox"));
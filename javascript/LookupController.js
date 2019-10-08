
var LookupController = function (model, view) {
  this.model = model;
  this.view = view;

  this.init();
};


LookupController.prototype = {
  
  init: function () {
    console.log("controller init()");
  },
};

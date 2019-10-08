

$(function () {
  var model = new LookupModel(),
      view = new LookupView(model),
      controller = new LookupController(model, view);
});


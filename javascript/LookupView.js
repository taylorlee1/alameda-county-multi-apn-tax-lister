
var LookupView = function (model) {
  this.model = model;
  this.init();
};

LookupView.prototype = {

  init: function () {
    console.log("view init()")

    this.createChildren()
        .setupHandlers()
        .enable();

  },

  createChildren: function () {
    // cache the document object
    this.$container = $('.js-container');
    this.$lookupAPNSButton = this.$container.find('.js-lookup-apns-button');
    this.$apnTextBox = this.$container.find('.js-apn-textbox');

    return this;
  },

  setupHandlers: function () {
    this.lookupAPNSButtonHandler = this.lookupAPNSButton.bind(this);

    this.lookupAPNHandler = this.lookupAPN.bind(this);
    return this;
  },

  enable: function () {
    this.$lookupAPNSButton.click(this.lookupAPNSButtonHandler);


    return this;
  },

  validateAPNS: function () {
    var goodChars = /[0-9-]+/;
    bad_apns = 0;

    this.$apnTextBox.val().split(",").forEach(function (apn) {
      console.log("apn: " + apn);
      if ( !goodChars.test( apn ) ) {
        console.warn("bad apn: " + apn); 
        bad_apns += 1;
      }
    });

    return bad_apns;
  },

  lookupAPNSButton: function () {
    console.log("apns: " + this.$apnTextBox.val());
    
    var count_bad_apns = this.validateAPNS();
    if ( count_bad_apns > 0 ) {
      console.warn("Cannot proceed with bad apns");
      return false;
    } else {
      console.log("OK apns");
    }

    this.model.lookupAPNS(this.$apnTextBox.val());


  },

  lookupAPN: function() {
    console.log("view.lookupAPN()");
  },

};

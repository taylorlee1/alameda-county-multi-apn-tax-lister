
var LookupView = function (model) {
  this.model = model;
  this.init();
  this.total = 0;
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
    this.$container = $('#js-container');
    this.$lookupAPNSButton = this.$container.find('#js-lookup-apns-button');
    this.$apnTextBox = this.$container.find('#js-apn-textbox');
    this.$resultsDiv = this.$container.find('#js-lookup-results-container');

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
    var that = this;
    
    var count_bad_apns = this.validateAPNS();
    if ( count_bad_apns > 0 ) {
      console.warn("Cannot proceed with bad apns");
      return false;
    } else {
      console.log("OK apns");
    }

    this.model.lookupAPNS(this.$apnTextBox.val(), function(err, data, response) {
      if (err) {
        console.error("BLEH");
        return;
      }

     that.show();

    });

  },

  lookupAPN: function() {
    console.log("view.lookupAPN()");
  },

  
  show: function() {
    console.log(JSON.stringify(this.model.apns));

    var table = document.createElement('table');
    table.setAttribute('class', 'table');

    var header = table.createTHead();
    this.generateHeader(header);

    var sorted_keys = Object.keys(this.model.apns).sort();
    var that = this;
    this.total = 0;
    sorted_keys.forEach(function(apn) {
    //for (var apn in this.model.apns) {
      that.showAPN(table, apn);
    });

    this.addTotalFooter(table);

    this.$resultsDiv.html("");
    this.$resultsDiv.append(table);

  },

  addTotalFooter: function(table) {
    var row = table.insertRow();
    var cell = row.insertCell();
    var cell = row.insertCell();
    var cell = row.insertCell();
    var cell = row.insertCell();
    cell.innerHTML = 'TOTAL';
    var cell = row.insertCell();
    cell.innerHTML = numberWithCommas(Math.round(this.total));

    var cell = row.insertCell();
    var cell = row.insertCell();
    var cell = row.insertCell();
    var cell = row.insertCell();
    var cell = row.insertCell();
    var cell = row.insertCell();
  },


  showAPN: function(table, apn) {
    //table.innerHTML = JSON.stringify(this.model.apns[apn]);
    var row = table.insertRow();
    this.generateRow(row, this.model.apns[apn]);
  },

  generateHeader: function(header) {
    var row = header.insertRow();
    var cell = row.insertCell(); cell.innerHTML = 'year';
    var cell = row.insertCell(); cell.innerHTML = 'address';
    var cell = row.insertCell(); cell.innerHTML = 'apn';
    var cell = row.insertCell(); cell.innerHTML = 'tracer';
    var cell = row.insertCell(); cell.innerHTML = 'total';
    var cell = row.insertCell(); cell.innerHTML = 'inst1';
    var cell = row.insertCell(); cell.innerHTML = 'due-date';
    var cell = row.insertCell(); cell.innerHTML = 'status';
    var cell = row.insertCell(); cell.innerHTML = 'inst2';
    var cell = row.insertCell(); cell.innerHTML = 'due-date';
    var cell = row.insertCell(); cell.innerHTML = 'status';
  },

  generateRow: function(row, apn) {
    var cell = row.insertCell(); cell.innerHTML = apn['current_year_totals']['year'];
    var cell = row.insertCell(); cell.innerHTML = apn['address'];
    var cell = row.insertCell(); cell.innerHTML = apn['apn'];
    var cell = row.insertCell(); cell.innerHTML = apn['current_year_totals']['tracer'];
    var cell = row.insertCell(); cell.innerHTML = apn['current_year_totals']['total'];
    var cell = row.insertCell(); cell.innerHTML = apn['installments']['1']['amount'];
    var cell = row.insertCell(); cell.innerHTML = apn['installments']['1']['due_date'];
    var cell = row.insertCell(); cell.innerHTML = apn['installments']['1']['paystatus'];
    var cell = row.insertCell(); cell.innerHTML = apn['installments']['2']['amount'];
    var cell = row.insertCell(); cell.innerHTML = apn['installments']['2']['due_date'];
    var cell = row.insertCell(); cell.innerHTML = apn['installments']['2']['paystatus'];

    this.total += parseFloat(apn['current_year_totals']['total'].replace(/,/g, ''));
  },
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

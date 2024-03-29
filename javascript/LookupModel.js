
var LookupModel = function () {
  this.apns = {};

  this.lookupAPNEvent = new Event(this);
};

LookupModel.prototype = {

  lookupAPNS: function (apns, cb) {
    console.log("model.lookupAPNS() Look these up: " + apns)

    var that = this;
    var count = apns.split(",").length;
    apns.split(",").forEach(function(apn) {
      that.lookupAPN(apn.trim(), count, cb);
    });

  },

  lookupAPN: function (apn, count, cb) {
    console.log("sleepstart");
    rand = getRandomInt(1000,2*count*1000); // do not spam the county servers
    console.log("sleep");
 
    var xhr = new XMLHttpRequest();

    console.log("model.lookupAPN() apn: " + apn);
    var boilerplate = '&situsStreetNumber=&situsStreetName=&situsStreetSuffix=+&situsUnitNumber=&situsCity=+&searchBills=Search&showHistory=N'
    var params = 'displayApn=' + apn + boilerplate;
    var that = this;
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //console.log(this.responseText);
        var html = document.createElement('div');
        html.innerHTML = xhr.responseText;
        that.parse_html(html, apn, cb);
      }
    };
    var acgov_url = "https://www.acgov.org/ptax_pub_app/RealSearch.do" + "?" + params
    xhr.open("POST", "/php/proxy.php", true);
    xhr.setRequestHeader("X-Proxy-URL", acgov_url)

    xhr.send();
  },

  parse_html: function (html, apn, cb) {
    var verify_apn = this.getAPN(html.querySelector('#pplresultcontent3').rows.item(1));

    if ( verify_apn != apn ) {
      console.error("returned apn info does not match user supplied apn! " + apn + ' vs ' + verify_apn);
      cb(true, null, null);
      return;
    } 
    //console.log("apn, verify_apn: " + apn + ' ' + verify_apn);
    var address = this.getAddress(html.querySelector('#pplresultcontent3').rows.item(2));
    //console.log("address: " + address);
    var cytjson = this.currentYearTotals(html.querySelector('#pplresultcontent4').rows.item(3));
    //console.log("this year total: " + JSON.stringify(cytjson))

    var first_installment_json = this.parseInstallmentRow(html.querySelector('#pplresultcontent4').rows.item(4));
    //console.log("first installment: " + JSON.stringify(first_installment_json))
    var second_installment_json = this.parseInstallmentRow(html.querySelector('#pplresultcontent4').rows.item(5));
    //console.log("second installment: " + JSON.stringify(second_installment_json))

    this.apns[cytjson['tracer']] = {
      address: address,
      apn: apn,
      verify_apn: verify_apn,
      current_year_totals: cytjson,
      installments: {
        1: first_installment_json,
        2: second_installment_json,
      }
    },

    //console.log(this.apns);
    cb(false, this.apns, null);
  },

  getAPN: function (html) {
    var apn = html.getElementsByTagName("td")[1].innerHTML.replace(/&nbsp;/gi, '');
    return apn;
  },

  getAddress: function (html) {
    var address = html.getElementsByTagName("td")[1].innerHTML.replace(/&nbsp;/gi, '');
    return address;
  },

  currentYearTotals: function (html) {
    var year = html.getElementsByTagName("td")[2].innerHTML;
    var tracer = html.getElementsByTagName("td")[3].innerHTML;
    var total = html.getElementsByTagName("td")[4].innerHTML.substr(1);
    return {
      year: year,
      tracer: tracer,
      total: total,
    }
  },

  parseInstallmentRow: function (html) {
    var title = html.getElementsByTagName("td")[1].innerHTML;
    var due_date = html.getElementsByTagName("td")[2].innerHTML.replace(/&nbsp;/gi, '');
    var amount = html.getElementsByTagName("td")[4].innerHTML.substr(1);
    var paystatus = html.getElementsByTagName("td")[5].innerHTML.replace(/&nbsp;/gi, '');
    if ( paystatus == '' ) {
      paystatus = 'unpaid';
    }
    return {
      title: title,
      due_date: due_date,
      amount: amount,
      paystatus: paystatus,
    }

  },

};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

async function sleep(ms) {
  await sleep1(ms);
};

function sleep1(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


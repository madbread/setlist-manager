angular.module('Setlists')
.constant('getDateData', {

  oneYearAgo: function() {
    var today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth() + 1,
        day = today.getDate(),
        lastYear = year - 1;
    if (month === 2 && day == 29) {
      day = 28;
    }

    // Force month and day to 2 places
    month = month > 9 ? month : '0' + month;
    day = day > 9 ? day : '0' + day;

    var oneYearAgo = [lastYear, month, day].join('-');

    return oneYearAgo;
  },

  thisYear: function() {
    return moment(new Date()).format().substring(0, 4);
  },

  today: function() {
    return moment(new Date()).format().substring(0, 10);
  },

  datestringToISO: function(datestring) {
    return moment(new Date(datestring)).format().substring(0, 10);
  },

  isDatestringOutOfSequence: function(datestring1, datestring2) {
    return moment(this.datestringToISO(datestring1))
               .isAfter(this.datestringToISO(datestring2));
  },

  inSequence: function(datestring1, datestring2) {
    return moment(this.datestringToISO(datestring2))
               .isAfter(this.datestringToISO(datestring1)) ||
           moment(this.datestringToISO(datestring2))
                      .isSame(this.datestringToISO(datestring1));
  },

  datestringInFuture: function(datestring) {
    return moment(this.datestringToISO(datestring)).isAfter(this.today());
  }

});

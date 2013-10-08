// YOUR CODE HERE:

var getData =  function() {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function (data) {
      render(data.results);
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

var render = function (data) {
  data = _(data).filter(function (datum){
    return (datum.roomname === window.roomname);
  });
  $('.chatList').html('');
  for (var i = Math.max(0,data.length - window.pageSize); i < data.length; i++) {
    var datum = data[i];
    var username = $("<span class='username'></span>");
    username.text(datum.username + ": ");
    var msgtext = $("<span class='msgtext'></span>");
    msgtext.text(datum.text);
    var newMsg = $("<li class='msg'></li>");
    newMsg.append(username);
    newMsg.append(msgtext);
    $('.chatList').append(newMsg);
  }
  setTimeout(getData,100);
};

var sendData = function(data) {
  data = JSON.stringify(data);
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    contentType: 'application/json',
    data: data,
    success: function (data) {
      console.log('chatterbox: Message sent ' + data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message ' + data);
    }
  });
};

$(document).on("ready", function() {

  // Global variables.
  window.pageSize = 15;
  window.roomname = "lobby";

  // Assign all parameters in the URL to global variables.
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    vars[i] = vars[i].split("=");
    window[vars[i][0]] = vars[i][1];
  }


  // JQuery bindings.
  $('input').bind("enterText",function(e){
    if ($(this).val()) {
      var message = {
        username: window.username,
        text: $(this).val(),
        roomname: window.roomname
      };
      sendData(message);
      $(this).val('');
    }
  });

  $('input').keyup(function(e){
      if(e.keyCode == 13)
      {
          $(this).trigger("enterText");
      }
  });


  // Page initialization.
  getData();
});

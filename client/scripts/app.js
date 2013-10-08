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
  window.rooms = {};
  _(data).each(function (datum) {
    if (rooms[datum.roomname] === undefined) {
      window.rooms[datum.roomname] = [datum];
    } else {
      window.rooms[datum.roomname].push(datum);
    }
  });

  var currentRoom = rooms[window.currentRoom];
  $('.chatList').html('');
  for (var i = Math.max(0,currentRoom.length - window.pageSize); i < currentRoom.length; i++) {
    var datum = currentRoom[i];
    var username = $("<span class='username'></span>");
    username.text(datum.username + ": ");
    var msgtext = $("<span class='msgtext'></span>");
    msgtext.text(datum.text);
    var newMsg = $("<li class='msg'></li>");
    newMsg.append(username);
    newMsg.append(msgtext);
    $('.chatList').append(newMsg);
  }

  $('.currentRoom').text(window.currentRoom);
  var sortedRooms =  _(window.rooms).sortBy(function (room) {
    return room.length;
  }).reverse();
  console.log(sortedRooms);
  $('.roomList').html('');
  for (var j = 0; j < sortedRooms.length; j++) {
    var room = $("<li class='room'></li>");
    room.text(sortedRooms[j][0].roomname);
    $('.roomList').append(room);
  }

  //setTimeout(getData,100);
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
  window.roomListSize = 5;
  window.currentRoom = "lobby";

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
        roomname: window.currentRoom
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

// YOUR CODE HERE:

var getData =  function() {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      render(data.results);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

var render = function (data) {
  for (var i = 0; i < data.length; i++) {
    var datum = data[i];
    var newMsg = "<li class='msg'>"+datum.text+"</li>";
    $('.chatList').append(newMsg);
  }
};

$(document).on("ready", function() {

  getData();

  // Input.
  $('input').bind("enterText",function(e){
    var newMsg = "<li class='msg'>"+$(this).val()+"</li>";
    $('.chatList').append(newMsg);
    $(this).val('');
  });

  $('input').keyup(function(e){
      if(e.keyCode == 13)
      {
          $(this).trigger("enterText");
      }
  });
});

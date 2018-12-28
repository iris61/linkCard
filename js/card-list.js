/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var token = localStorage.getItem('token', '');
console.log('token' + token);

var data = null;

var xhr = new XMLHttpRequest();

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    $('#board').empty();
    var boards = JSON.parse(this.responseText);
    for (var i = 0; i < boards.length; i++) {
      var board = boards[i];
      $('#board').append("<option value=" + board["id"] + ">" + board["name"] + "</option>");
    }
  }
});

var API_KEY = '39b6a82d8f1e50354709b1c082e296da';
var user_id = '5b29039b4068b9ce6d53b2de';
xhr.open("GET", "https://api.trello.com/1/members/" + user_id + "/boards?filter=open&fields=all&lists=none&memberships=all&organization=false&organization_fields=all&key=" + API_KEY + "&token=" + token + "");

xhr.send(data);

$('#board').change(function() {
  var boardId = $(this).children('option:selected').val();
  fetchListData(boardId);
});

function fetchListData(boardId) {
  $('#list').empty();
  $('#card').empty();
  var data = null;

  var xhr = new XMLHttpRequest();

  var lists;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      lists = JSON.parse(this.responseText);
      for (var i = 0; i < lists.length; i++) {
        var list = lists[i];
        $('#list').append("<option value=" + list["id"] + ">" + list["name"] + "</option>");
      }
    }
  });

  xhr.open("GET", "https://api.trello.com/1/boards/" + boardId + "/lists?cards=open&card_fields=all&filter=open&fields=all&key=" + API_KEY + "&token=" + token + "");

  xhr.send(data);
  
  $('#list').change(function() {
    var listId = $(this).children('option:selected').val();
    
    $('#card').empty();
    for (var i = 0; i < lists.length; i++) {
        var list = lists[i];
        if (list["id"] == listId) {
          for (var j = 0; j < list["cards"].length; j++) {
            $('#card').append("<option value=" + list["cards"][j]["id"] + " url=" + list["cards"][j]["shortUrl"] + " >" + list["cards"][j]["name"] + "</option>");
          }
        }
      }
  });
}

$('#link').click(function() {
  var cardId = $("#card").val();
  $("#card>option").each(function() {
     if ($(this).val() == cardId) {
       t.attach({ url: $(this).attr("url"), name: $(this).text() });
     }
  });
});

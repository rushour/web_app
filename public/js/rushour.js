$(".ui-helper-hidden-accessibl").click(function(e) {
		console.log("Here");
    if(e.target.className !== "ui-helper-hidden-accessible")
    {
    	console.log("Here2");
      $(".ui-helper-hidden-accessible").hide();
    }
  }
);

// Rotating Card
$().ready(function(){
    $('[rel="tooltip"]').tooltip();
    
});

function rotateCard(btn){
    var $card = $(btn).closest('.card-container');
    if(!$card.hasClass('hover')){
      $card.addClass('hover');
    }
}

function backToSearch(btn) {
	console.log("In here");
	var $card = $(btn).closest('.card-container');
	if ($card.hasClass('hover')) {
		$card.removeClass('hover');
	}
}

function searchButton() {
  console.log("button clicked");
  var searchVal = document.getElementById("inputSearch").value;
  if (searchVal && isValidSearch) {
    fillCardBack(resultID);
    $('#searchResultModal').modal('show');
  }
}

$(function () {
  $("#inputSearch").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "http://localhost:3000/search",
        cache: true,
        type: "GET",
        data: request,  // request is the value of search input
        success: function (data) {
          // Map response values to field label and value
          response($.map(data, function (el) {
            return {
              label: (el.name + " (" + el.address + ", " + el.city + ")"),
              value: el._id
            };
          }));
        }
      });
    },
       
    // The minimum number of characters a user must type before a search is performed.
    minLength: 1, 

    // set an onFocus event to show the result on input field when result is focused
    focus: function (event, ui) { 
      this.value = ui.item.label; 
      // Prevent other event from not being execute
      event.preventDefault();
      // console.log("called focus");
    },
    select: function (event, ui) {
      // Prevent value from being put in the input:
      this.value = ui.item.label;
      // Set the id to the next input hidden field
      $(this).next("input").val(ui.item.value);
      // Prevent other event from not being execute            
      event.preventDefault();
      // // optionnal: submit the form after field has been filled up
      // $('#quicksearch').submit();
      console.log("called");
      // $('#searchResultModal').modal('show');
      rotateCard(this);
      isValidSearch = true;
      resultID = ui.item.value;
      if (document.getElementById('facebook_user_id')) {
        var facebook_user_id = document.getElementById('facebook_user_id').innerHTML;
        fillCardBack(ui.item.value, facebook_user_id);
      } else {
        fillCardBack(ui.item.value, "-1");
      }
    }
  }).keyup(function (e) {
    if(e.which === 13 || e.which === 27) {
        $(".ui-menu-item").hide();
    }
  });
  $('.ui-helper-hidden-accessible').css('list-style-type', 'none').css('text-decoration', 'none').css('cursor', 'default');
});


function success(position) {
  var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  
  var options = {
    zoom: 15,
    center: coords,
    mapTypeControl: false,
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"), options);

  var marker = new google.maps.Marker({
      position: coords,
      map: map,
      title:"You are here!"
  });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success);
} else {
  error('Geo Location is not supported');
}
/* activate scrollspy menu */
$('body').scrollspy({
  target: '#navbar-collapsible',
  offset: 50
});

/* smooth scrolling sections */
$('a[href*=#]:not(a[name=whatshot-tabs])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 50
        }, 1000);
        return false;
      }
    }
});


function fillCardBack(id, fb_id) {
  console.log("...");
  var finalUrl;
  if (fb_id != "-1")
    finalUrl = 'http://goharirfan.me/services/id/'+id+'?user_facebook_id='+fb_id;
  else
    finalUrl = 'http://localhost:3000/restaurants/details/'+id;
  
  $.ajax({
    type: "GET",
    cache: true,
    url: finalUrl,
    dataType: 'json',
    
    success: function(data){
      document.getElementById("restaurantImage").src = data["imageUrl"];
      document.getElementById("restaurantName").innerHTML = data["name"];
      document.getElementById("restaurantAddress").innerHTML = data["address"];
      document.getElementById("restaurantCity").innerHTML = data["city"];
      document.getElementById("restaurantCountry").innerHTML = data["country"];
      // makeChart(id);
      console.log(data);
    }, 
    error: function(e) { 
      console.log(e);
    } 
  }); 
}


// What's hot page tabs
$(document).ready(function() {
    $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });
});
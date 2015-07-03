$(window).bind("load", function() {
  fillCard();
});

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
      if (document.getElementById('userID')) {
        var userID = document.getElementById('userID').innerHTML;
        fillCardBack(ui.item.value, userID);
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


function fillCardBack(id, _userID) {
  console.log("...");
  var finalUrl;
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

  if (_userID != "-1") {
	  $.ajax({
	    type: "POST",
	    cache: true,
	    url: 'http://localhost:3000/search/createSearchHistoryRestaurant',
	    dataType: 'json',
	    data: {userID: _userID, restaurantID: id},
	    
	    success: function(data){
	    	console.log("saved user search");
	      console.log(data);
	    }, 
	    error: function(e) { 
	      console.log(e);
	    } 
	  });
	}
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

// Tooltip 
$(function() {
  $( document ).tooltip();
});

// Browse page carousel
$('#myCarousel').carousel({
  interval:false // remove interval for manual sliding
});

// when the carousel slides, load the ajax content
$('#myCarousel').on('slid', function (e) {
  
	// get index of currently active item
	var idx = $('#myCarousel .item.active').index();
	var url = $('.item.active').data('url');

	// ajax load from data-url
  	$('.item').html("wait...");
	$('.item').load(url,function(result){
	    $('#myCarousel').carousel(idx);  
	});
  
});

// load first slide
$('[data-slide-number=0]').load($('[data-slide-number=0]').data('url'),function(result){    
	$('#myCarousel').carousel(0);
});


function fillCard() {
  var finalUrl;
  finalUrl = 'http://localhost:3000/restaurants';
  
  $.ajax({
    type: "GET",
    cache: true,
    url: finalUrl,
    dataType: 'json',
    

    success: function(data) {
      console.log(data);
      for (var i = 1 ; i <= data.length ; i++) {
        $("#img"+i).attr("src",data[i]["imageUrl"]);
        $("#name"+i).html(data[i]["name"]);
        $("#nameback"+i).html(data[i]["name"]);
        $("#address"+i).html(data[i]["address"]);
        $("#category"+i).html(data[i]["category"]);
        $("#citycountry"+i).html(data[i]["city"] + " , " + data[i]["country"]);
        $("#currentRush"+i).html(data[i]["currentRush"]);
      }
      // makeChart(id);
      console.log(data);
    }, 
    error: function(e) { 
      console.log(e);
    } 
  });
  return;
}
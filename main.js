// **Instructions** **main.js** 
// ------------ 
// In this document you will find instructions on how to adjust different parameters of the paradigm. You can apply the desired changes to the document main.js on your computer or server, using a source code editor. 
// The following parameters are necessary to adjust: number of avatar images, and the redirect link at the end of the study. All other parameters have a default option and adjustments are optional. 

$(function() { 
  // **Parameters** 
  // ------------ 
  function set_settings() { 
    window.settings = []; 
    
    // **Number of Avatar Images** 
    settings.numberofavatars = 21; 
    
    // **Redirection** 
    settings.defaultredirect = 'https://purchasenss.qualtrics.com/jfe/form/SV_6KBLDG85bXswEhU'; 
    
    // **Tasklength** 
    settings.tasklength = 180000; 
    
    // **Number of "likes"** 
    // In condition 4, the participant will receive 1 like 
    settings.condition_4_likes = [12000, 9999999]; 
    
    // In condition 6, user will receive 5 likes 
    settings.condition_6_likes = [10000, 11000, 35000, 100000, 110000, 20000]; 
    
    // **Others' likes** 
    settings.condition_4_adjusted_likes = [12000, 14000, 15000, 35000, 80000, 100000, 110000, 150000, 20000]; 
    settings.condition_6_adjusted_likes = [12000, 9999999]; 
    
    // Usernames by which the participant will receive "likes" 
    settings.likes_by = ['John','AncaD','Sarah','Arjen','Jane','George','Dan','Heather','Ky']; 
  } 
  
  // ------------------- 
  // Above were the basic parameters you can adjust using the instructions. The remaining code is also annotated, but we do not recommend changing it, unless you are comfortable with web programming. 
  // ------------------- 
  
  function init_intro() { 
    $('#intro').show(); 
    $('#submit_intro').on('click',function() { 
      $('#intro').hide(); 
      init_name(); 
    }); 
  } 
  
  function init_name() { 
    $('#name').show(); 
    $('#submit_username').on('click',function() { 
      var error = 0; 
      var uname = $('#username').val(); 
      if(uname == "") { 
        error = 1; 
        errormsg = 'Please enter text'; 
        uname = "undefined"; 
      } 
      if(not_alphanumeric(uname)) { 
        error = 1; 
        errormsg = 'Please only letters (and no spaces)'; 
      } 
      if(error == 0) { 
        $('#name').hide(); 
        window.username = $('#username').val(); 
        init_avatar(); 
      } else { 
        alertify.log(errormsg,"error"); 
      } 
    }); 
  } 
  
  function init_avatar() { 
    $('#avatar').show(); 
    var avatars = window.settings.numberofavatars; 
    for(var i=0; i<avatars; i++) { 
      $('.avatars').append('<img id="avatar_' + i+ '" src="avatars/avatar_' + i + '.png" class="avatar" />'); 
    } 
    $('.avatar').on('click', function() { 
      $('.avatar').removeClass('selected'); 
      $(this).addClass('selected'); 
    }); 
    $('#submit_avatar').on('click',function() { 
      if($('.selected').length == 1) { 
        $('#avatar').hide(); 
        window.avatar = $('.selected').attr('id'); 
        window.avatarexport = /avatar_([^\s]+)/.exec(window.avatar)[1]; 
        init_text(); 
      } else { 
        alertify.log("Please select an avatar","error"); 
      } 
    }); 
  } 
  
  function init_text() { 
    $('#text').show(); 
    $("#description").keyup(function(){ 
      $("#count").text("Characters left: " + (400 - $(this).val().length)); 
    }); 
    $('#submit_text').on('click',function() { 
      var error = 0; 
      if($('#description').val() == "") { 
        error = 1; 
        errormsg = 'Please enter text'; 
      } 
      if($('#description').val() !== "" && $('#description').val().length < 100) { 
        error = 1; 
        errormsg = 'Please write a bit more'; 
      } 
      if($('#description').val().length > 401) { 
        error = 1; 
        errormsg = 'Please enter less text'; 
      } 
      if(error == 0) { 
        $('#text').hide(); 
        window.description = $('#description').val(); 
        init_fb_intro(); 
      } else { 
        alertify.log(errormsg,"error"); 
      } 
    }); 
  } 
  
  function init_fb_intro() { 
    $('#fb_intro').show(); 
    $('#submit_fb_intro').on('click',function() { 
      $('#fb_intro').hide(); 
      init_fb_login(); 
    }); 
  } 
  
  function init_fb_login() { 
    $('#fb_login').show(); 
    setTimeout(function() { 
      $('#msg_all_done').show(); 
      $("#loader").hide(); 
    }, 8000); 
    $('#submit_fb_login').on('click',function() { 
      $('#fb_login').hide(); 
      init_task(); 
    }); 
  } 
  
  function init_task() { 
    $('#task').show(); 
    shortcut.add("Backspace",function() {}); 
    jQuery("#countdown").countDown({ 
      startNumber: window.settings.tasklength/1000, 
      callBack: function() { 
        $('#timer').text('00:00'); 
      } 
    }); 
    users = { 
      "posts" : [ 
        { 
          "avatar": 'avatars/' + window.avatar + '.png', 
          "username": window.username, 
          "text": window.description, 
          "likes": window.settings.condition_likes, 
          "usernames": window.settings.likes_by 
        } 
      ] 
    }; 
    var tpl = $('#usertmp').html(),html = Mustache.to_html(tpl, users); 
    $("#task").append(html); 
    var tpl = $('#otherstmp').html(),html = Mustache.to_html(tpl, others); 
    $("#task").append(html); 
    
    function reorder() { 
      var grp = $("#others").children(); 
      var cnt = grp.length; 
      var temp,x; 
      for (var i = 0; i < cnt; i++) { 
        temp = grp[i]; 
        x = Math.floor(Math.random() * cnt); 
        grp[i] = grp[x]; 
        grp[x] = temp; 
      } 
      $(grp).remove(); 
      $("#others").append($(grp)); 
    } 
    reorder(); 
    
    $('.userslikes').each(function() { 
      var that = $(this); 
      var usernames = $(this).data('usernames').split(","); 
      var times = $(this).data('likes').split(","); 
      for(var i=0; i<times.length; i++) { 
        times[i] = +times[i]; 
        themsg = usernames[i] + " liked your post"; 
        setTimeout(function(themsg) { 
          that.text(parseInt(that.text()) + 1); 
          alertify.success(themsg) 
        }, times[i], themsg); 
      } 
    }); 
    
    $('.otherslikes').each(function() { 
      var that = $(this); 
      var times = $(this).data('likes').split(","); 
      for(var i=0; i<times.length; i++) { 
        times[i] = +times[i]; 
        setTimeout(function () { 
          that.text(parseInt(that.text()) + 1); 
        }, times[i]); 
      } 
    }); 
    
    $('.btn-like').on('click', function() { 
      $(this).prev().text(parseInt($(this).prev().text()) + 1); 
      $(this).attr("disabled", true); 
    }); 
    
    $('#task').masonry({ 
      itemSelector : '.entry', 
      columnWidth : 10 
    }); 
    
    setTimeout(function() { 
      $(window).unbind('beforeunload'); 
      $('#final-continue').show(); 
      $('#timer').text('00:00'); 
      $('#final-continue').on('click', function() { 
        location.href = window.redirect+'&p='+window.participant+'&c='+window.condition+'&u='+encodeURI(window.username)+'&av='+window.avatarexport+'&d='+encodeURI(window.description); 
      }); 
    },window.settings.tasklength); 
  } 
  
  // **FIXED CONDITION HANDLING** 
  function get_params() { 
    if(window.QueryString.c !== undefined && !isNaN(parseInt(window.QueryString.c)) && (parseInt(window.QueryString.c) === 4 || parseInt(window.QueryString.c) === 6)) { 
      window.condition = parseInt(window.QueryString.c); 
    } else { 
      window.condition = 4; 
    } 
    if(window.QueryString.p !== undefined && !isNaN(parseInt(window.QueryString.p))) { 
      window.participant = parseInt(window.QueryString.p); 
    } else { 
      window.participant = 0; 
    } 
    if(window.QueryString.redirect !== undefined && window.QueryString.redirect !== "") { 
      window.redirect = decode(window.QueryString.redirect); 
    } else { 
      window.redirect = window.settings.defaultredirect; 
    } 
    var urlHasQuestionMark = (window.redirect.indexOf("?") > -1); 
    if(!urlHasQuestionMark) { 
      window.redirect = window.redirect+"?redir=1"; 
    } 
  } 
  
  // **FIXED CONDITION MAPPING** 
  function adjust_to_condition() { 
    switch(window.condition) { 
      case 4: 
        window.settings.condition_likes = settings.condition_4_likes; 
        window.others.posts[1].likes = settings.condition_4_adjusted_likes; 
        break; 
      case 6: 
        window.settings.condition_likes = settings.condition_6_likes; 
        window.others.posts[1].likes = settings.condition_6_adjusted_likes; 
        break; 
      default: 
        window.condition = 4; 
        window.settings.condition_likes = settings.condition_4_likes; 
        window.others.posts[1].likes = settings.condition_4_adjusted_likes; 
    } 
  } 
  
  window.QueryString = function () { 
    var query_string = {}; 
    var query = window.location.search.substring(1); 
    var vars = query.split("&"); 
    for (var i=0;i<vars.length;i++) { 
      var pair = vars[i].split("="); 
      if (typeof query_string[pair[0]] === "undefined") { 
        query_string[pair[0]] = pair[1]; 
      } else if (typeof query_string[pair[0]] === "string") { 
        var arr = [ query_string[pair[0]], pair[1] ]; 
        query_string[pair[0]] = arr; 
      } else { 
        query_string[pair[0]].push(pair[1]); 
      } 
    } 
    return query_string; 
  } (); 
  
  function not_alphanumeric(inputtxt) { 
    var letterNumber = /^[0-9a-zA-Z]+$/; 
    return !inputtxt.match(letterNumber); 
  } 
  
  function pad (str, max) { 
    return str.length < max ? pad("0" + str, max) : str; 
  } 
  
  function encode(unencoded) { 
    return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22"); 
  } 
  
  function decode(encoded) { 
    return decodeURIComponent(encoded.replace(/\+/g, " ")); 
  } 
  
  jQuery.fn.countDown = function(settings,to) { 
    settings = jQuery.extend({ 
      duration: 1000, 
      startNumber: 10, 
      endNumber: 0, 
      callBack: function() { } 
    }, settings); 
    return this.each(function() { 
      if(!to && to != settings.endNumber) { 
        to = settings.startNumber; 
      } 
      jQuery(this).children('.secs').text(to); 
      jQuery(this).animate({}, settings.duration, "", function() { 
        if(to > settings.endNumber + 1) { 
          jQuery(this).children('.secs').text(to - 1); 
          jQuery(this).countDown(settings, to - 1); 
          var minutes = Math.floor(to / 60); 
          var seconds = to - minutes * 60; 
          jQuery(this).children('.cntr').text(pad(minutes.toString(),2) + ':' + pad(seconds.toString(),2)); 
        } else { 
          settings.callBack(this); 
        } 
      }); 
    }); 
  }; 
  
  shortcut.add("f5",function() {}); 
  $(window).bind('beforeunload', function(){ 
    return 'Are you sure you want to quit the experiment completely?'; 
  }); 
  
  set_settings(); 
  get_params(); 
  adjust_to_condition(); 
  init_intro(); 
});

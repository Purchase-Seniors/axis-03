$(function() {

  // =========================
  // SETTINGS (FIXED STRUCTURE)
  // =========================
  function set_settings() {
    window.settings = {};

    settings.numberofavatars = 21;

    settings.defaultredirect = 'https://purchasenss.qualtrics.com/jfe/form/SV_6KBLDG85bXswEhU';

    settings.tasklength = 180000;

    settings.condition_4_likes = [12000, 9999999];
    settings.condition_6_likes = [10000, 11000, 35000, 100000, 110000, 20000];

    settings.condition_4_adjusted_likes = [12000, 14000, 15000, 35000, 80000, 100000, 110000, 150000, 20000];
    settings.condition_6_adjusted_likes = [12000, 9999999];

    settings.likes_by = ['John','AncaD','Sarah','Arjen','Jane','George','Dan','Heather','Ky'];
  }


  // =========================
  // INIT FLOW
  // =========================
  function init_intro() {
    $('#intro').show();
    $('#submit_intro').on('click', function() {
      $('#intro').hide();
      init_name();
    });
  }

  function init_name() {
    $('#name').show();
    $('#submit_username').on('click', function() {

      var uname = $('#username').val();

      if (!uname || uname === "") {
        alertify.log("Please enter text", "error");
        return;
      }

      if (not_alphanumeric(uname)) {
        alertify.log("Please only letters (no spaces)", "error");
        return;
      }

      window.username = uname;

      $('#name').hide();
      init_avatar();
    });
  }

  function init_avatar() {
    $('#avatar').show();

    for (var i = 0; i < settings.numberofavatars; i++) {
      $('.avatars').append(
        '<img id="avatar_' + i + '" src="avatars/avatar_' + i + '.png" class="avatar" />'
      );
    }

    $('.avatar').on('click', function() {
      $('.avatar').removeClass('selected');
      $(this).addClass('selected');
    });

    $('#submit_avatar').on('click', function() {

      if ($('.selected').length !== 1) {
        alertify.log("Please select an avatar", "error");
        return;
      }

      window.avatar = $('.selected').attr('id');
      window.avatarexport = /avatar_([^\s]+)/.exec(window.avatar)[1];

      $('#avatar').hide();
      init_text();
    });
  }

  function init_text() {
    $('#text').show();

    $("#description").keyup(function() {
      $("#count").text("Characters left: " + (400 - $(this).val().length));
    });

    $('#submit_text').on('click', function() {

      var txt = $('#description').val();

      if (!txt || txt.length < 100) {
        alertify.log("Please write a bit more (100+ chars)", "error");
        return;
      }

      if (txt.length > 401) {
        alertify.log("Please enter less text", "error");
        return;
      }

      window.description = txt;

      $('#text').hide();
      init_fb_intro();
    });
  }

  function init_fb_intro() {
    $('#fb_intro').show();
    $('#submit_fb_intro').on('click', function() {
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

    $('#submit_fb_login').on('click', function() {
      $('#fb_login').hide();
      init_task();
    });
  }


  // =========================
  // TASK (FIXED CORE)
  // =========================
  function init_task() {

    // safety checks
    if (!window.others || !window.others.posts) {
      console.error("Profiles not loaded");
      return;
    }

    if (!$('#task').length) {
      console.error("Missing #task container in HTML");
      return;
    }

    $('#task').show();

    shortcut.add("Backspace", function() {});

    // countdown FIXED (no #timer bug)
    jQuery("#countdown").countDown({
      startNumber: window.settings.tasklength / 1000,
      callBack: function() {
        $('.cntr').text('00:00');
      }
    });

    // user object
    var users = {
      posts: [
        {
          avatar: 'avatars/' + window.avatar + '.png',
          username: window.username,
          text: window.description,
          likes: window.settings.condition_likes,
          usernames: window.settings.likes_by
        }
      ]
    };

    // render user
    var tpl = $('#usertmp').html();
    $("#task").append(Mustache.to_html(tpl, users));

    // render others
    var tpl2 = $('#otherstmp').html();
    $("#task").append(Mustache.to_html(tpl2, window.others));

    // shuffle
    var grp = $("#task").children();
    grp.sort(() => Math.random() - 0.5);
    $("#task").html(grp);

    // likes animation
    $('.userslikes').each(function() {
      var that = $(this);
      var usernames = $(this).data('usernames').split(",");
      var times = $(this).data('likes').split(",");

      for (let i = 0; i < times.length; i++) {
        setTimeout(function(msg) {
          that.text(parseInt(that.text()) + 1);
          alertify.success(usernames[i] + " liked your post");
        }, parseInt(times[i]), usernames[i]);
      }
    });

    $('.otherslikes').each(function() {
      var that = $(this);
      var times = $(this).data('likes').split(",");

      for (let i = 0; i < times.length; i++) {
        setTimeout(function() {
          that.text(parseInt(that.text()) + 1);
        }, parseInt(times[i]));
      }
    });

    // like button
    $('.btn-like').on('click', function() {
      $(this).prev().text(parseInt($(this).prev().text()) + 1);
      $(this).attr("disabled", true);
    });

    // masonry
    $('#task').masonry({
      itemSelector: '.entry',
      columnWidth: 10
    });

    // end task redirect
    setTimeout(function() {
      $('#final-continue').show();
      $('.cntr').text('00:00');

      $('#final-continue').on('click', function() {
        location.href =
          window.redirect +
          '&p=' + window.participant +
          '&c=' + window.condition +
          '&u=' + encodeURI(window.username) +
          '&av=' + window.avatarexport +
          '&d=' + encodeURI(window.description);
      });

    }, window.settings.tasklength);
  }


  // =========================
  // CONDITION LOGIC
  // =========================
  function get_params() {
    window.condition = 4;
    window.participant = 0;
    window.redirect = window.settings.defaultredirect;

    var q = window.location.search.substring(1);
    var vars = q.split("&");

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] === "c") window.condition = parseInt(pair[1]);
      if (pair[0] === "p") window.participant = parseInt(pair[1]);
      if (pair[0] === "redirect") window.redirect = decodeURIComponent(pair[1]);
    }
  }

  function adjust_to_condition() {
    switch (window.condition) {
      case 4:
        window.settings.condition_likes = settings.condition_4_likes;
        window.others.posts[1].likes = settings.condition_4_adjusted_likes;
        break;

      case 6:
        window.settings.condition_likes = settings.condition_6_likes;
        window.others.posts[1].likes = settings.condition_6_adjusted_likes;
        break;
    }
  }


  // =========================
  // HELPERS
  // =========================
  function not_alphanumeric(input) {
    return !/^[0-9a-zA-Z]+$/.test(input);
  }


  // =========================
  // INIT
  // =========================
  set_settings();
  get_params();
  adjust_to_condition();
  init_intro();

});

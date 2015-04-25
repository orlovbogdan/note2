// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require jquery-ui/draggable
//= require jquery-ui/sortable
//= require jquery.mjs.nestedSortable
//= require best_in_place
//= require best_in_place.jquery-ui
//= require jquery-ui/selectable
//= require jquery-ui/resizable
//= require_tree .

$(function () {

    $('html').dblclick(function(e){
        if (e.target.getAttribute('id') == 'selectable'){
            $.get($('body').data('new_note'), {ypos: e.pageY, xpos: e.pageX}, null, 'script' );
        }
    });


    $(document).on('click','.new-sub-note', function(e){
        var th = this;
        var pos =  2;
        $.get($(this).attr('href'), { parent_id: $(this).attr('data-note-id'), position: pos}, function(data){
            $(th).closest('.note').find('ol').append(data);
        });
        e.preventDefault();
    });




    $(document).on('keydown', 'textarea', function(e) {
        if(e.keyCode == 13 && !e.shiftKey) {
            $(this).closest('form').submit();
            e.preventDefault();
        }
    });

    $(document).on('keydown', 'textarea', function(e){
        if(e.keyCode == 27) {
            $(this).closest('form').remove();
            e.preventDefault();
        }
    });


    $(".best_in_place").best_in_place({
        event: 'dblclick'
    });


    init_notes();



    $('html').click(function(e){
        if (e.target.getAttribute('id') == 'selectable'){
            $("*").removeClass("ui-selected");
        }
    });

})

function init_notes(){
    $('html, body, #selectable').height($(document).height());
    $('html, body, #selectable').width($(document).width());


    offset = {top:0, left:0};

    $("#selectable > .note").draggable({
        stop: function (event, ui) {
            if ($(this).hasClass("ui-selected")) {
                var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
                $(".note.ui-selected").each(function () {
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        url: $(this).data('update-url'),
                        type: 'PATCH',
                        data: JSON.stringify({ypos: $(this).data("offset").top + dt, xpos: $(this).data("offset").left + dl})
                    });
                })
            } else {
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: $(this).data('update-url'),
                    type: 'PATCH',
                    data: JSON.stringify({ypos: ui.position.top, xpos: ui.position.left})
                });
            };
            $('html, body, #selectable').height($(document).height());
        },
        start: function(ev, ui) {
            if ($(this).hasClass("ui-selected")){
                $(".note.ui-selected").each(function() {
                    $(this).data("offset", $(this).offset());
                });
            }
            else {
                $("*").removeClass("ui-selected");
            }
            offset = $(this).offset();
        },
        drag: function(ev, ui) {
            var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
            $(".note.ui-selected").not(this).each(function() {
                $(this).css({top: $(this).data("offset").top + dt, left: $(this).data("offset").left + dl});
            });
        }
    });

    $("#selectable").selectable({
        distance: 1
    });

    $("#selectable > div").click( function(e){
        if (e.metaKey == false) {
            $("*").removeClass("ui-selected");
            $(this).addClass("ui-selecting");
        }
        else {
            if ($(this).hasClass("ui-selected")) {
                $(this).removeClass("ui-selected");
                $(this).find('*').removeClass("ui-selected");
            }
            else {
                $(this).addClass("ui-selecting");
            }
        }

        $("#selectable").data("ui-selectable")._mouseStop(null);
    });


    $('#selectable > .note').resizable({
        handles: "se",
        stop: function (event, ui) {
            $.ajax({
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                url : $(this).data('update-url'),
                type : 'PATCH',
                data : JSON.stringify({width: ui.size.width, height: ui.size.height})
            });
        }
    });




    $('ol.sub_notes').nestedSortable({
        disableNesting: 'no-nest',
        forcePlaceholderSize: true,
        handle: 'div',
        helper: 'clone',
        items: 'li',
        opacity: .6,
        placeholder: 'placeholder',
        revert: 250,
        tabSize: 25,
        tolerance: 'pointer',
        toleranceElement: '> div',

        /* The magic tric: */
        connectWith: '.sub_notes',
        start: function(event, ui){
            ui.item.data('parent_id',ui.item.parent().siblings('.actions').find('.new-sub-note').attr('data-note-id'));
            $(ui.item).parents().css('overflow', 'visible');
        },
        stop: function(event, ui){
            $('.note').css('overflow', 'auto');
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: $(ui.item).find('.note').data('update-url'),
                type: 'PATCH',
                data: JSON.stringify({note: {parent_note_links_attributes: {'0': {note_id: $(ui.item).find('.note').children('.actions').find('.new-sub-note').attr('data-note-id'), parent_id: ui.item.data('parent_id'), new_parent_id: ui.item.parent().siblings('.actions').find('.new-sub-note').attr('data-note-id') }}}})
            });
        },
        sort: function (event, ui) {
            if ($(ui.item).parents('ol').size() == 1) {
              ui.item.parent().parent().css('top',ui.offset.top).css('left',ui.offset.left);
            }
        }
    });


}
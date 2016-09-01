// ==UserScript==
// @name         Bali JS Demo
// @namespace    https://testing.agency/academy/demo/
// @version      0.1
// @description  A/B Testing Technical Implementation
// @author       You
// @match        https://testing.agency/academy/demo/*
// @grant        none
// ==/UserScript==

(function($, window) {
    'use strict';

    var timer = null,
        delay = 100,
        doc = $(document),
        win = $(window),
        variantData = window.localStorage.getItem('variantdata'),
        pageIndex = window.location.href.match(/\d+/)[0],
        counter = parseInt(pageIndex);

    variantData = variantData ? JSON.parse(variantData) : [];

    function variantStyle(){
        var style = '';

        $('head').append('<style>'+style+'</style>');
    }

    function domManipulation(){
        //add experiment class
        $('body').addClass('balijs-demo');

        //get pages
        if(!variantData.length){
            $.when(
                $.ajax("https://testing.agency/academy/demo/page1.html"),
                $.ajax("https://testing.agency/academy/demo/page2.html"),
                $.ajax("https://testing.agency/academy/demo/page3.html")
            ).done(function(){
                if(arguments.length){
                    $.each(arguments, function(i, html){
                        var title = $(html[0]).find('h1').text().trim(),
                            article = $('<div/>').append($(html[0]).find('.single-blog-article').children(':not(.related-posts)')).html();

                        variantData.push({
                            title: title,
                            article: article
                        });

                        window.localStorage.setItem('variantdata', JSON.stringify(variantData));
                    });
                }
            });
        }

    }

    function doScroll(){
        //throttling
        clearTimeout(timer);
        timer = setTimeout(function(){
            if((win.scrollTop() + win.height()) > (doc.height() * 0.75)){
                variantData = JSON.parse(window.localStorage.getItem('variantdata'));
                if(counter === variantData.length) return;
                $('<hr/>' + variantData[counter].article).insertBefore($('.related-posts'));
                console.log('B: User scroll to article #' + (counter + 1));
                //https://developers.google.com/analytics/devguides/collection/analyticsjs/events
                //https://support.google.com/analytics/answer/1033068#NonInteractionEvents
                //ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
                //ga('send', 'event', 'Article', 'Scroll', 'User scroll to article', 'Article index: '+ (counter + 1), {'nonInteraction': 1});
                counter++;
            }
        }, delay);
    }

    function eventListeners(){

        $(window).on("scroll resize", doScroll);
    }

    $(document).ready(function(){
        variantStyle();
        domManipulation();
        eventListeners();
    });
})(jQuery, window);

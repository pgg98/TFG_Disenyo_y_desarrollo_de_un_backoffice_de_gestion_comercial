/*
Template Name: Admin Pro Admin
Author: Wrappixel
Email: niravjoshi87@gmail.com
File: js
*/
$(function() {
    "use strict";

    // Offset x1 a tiny amount so that the straight stroke gets a bounding box
    // Straight lines don't get a bounding box
    // Last remark on -> http://www.w3.org/TR/SVG11/coords.html#ObjectBoundingBox
    chart.on('draw', function(ctx) {
        if (ctx.type === 'area') {
            ctx.element.attr({
                x1: ctx.x1 + 0.001
            });
        }
    });

    // Create the gradient definition on created event (always after chart re-render)
    chart.on('created', function(ctx) {
        var defs = ctx.svg.elem('defs');
        defs.elem('linearGradient', {
            id: 'gradient',
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0
        }).elem('stop', {
            offset: 0,
            'stop-color': 'rgba(255, 255, 255, 1)'
        }).parent().elem('stop', {
            offset: 1,
            'stop-color': 'rgba(64, 196, 255, 1)'
        });
    });


    var chart = [chart];


    // ==============================================================
    // Our Visitor
    // ==============================================================
    var sparklineLogin = function() {
        $('#ravenue').sparkline([6, 10, 9, 11, 9, 10, 12], {
            type: 'bar',
            height: '100',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '11',
            barColor: '#fff'
        });
        $('#views').sparkline([6, 10, 9, 11, 9, 10, 12], {
            type: 'line',
            height: '72',
            lineColor: 'transparent',
            fillColor: 'rgba(255, 255, 255, 0.3)',
            width: '100%',

            resize: true,

        });
    };
    var sparkResize;

    $(window).resize(function(e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineLogin, 500);
    });
    sparklineLogin();



    // This is for the chat messege on enter
    $(function() {
        $(document).on('keypress', "#textarea1", function(e) {
            if (e.keyCode == 13) {
                var id = $(this).attr("data-user-id");
                var msg = $(this).val();
                msg = msg_sent(msg);
                $("#someDiv").append(msg);
                $(this).val("");
                $(this).focus();
            }
        });

    });
});
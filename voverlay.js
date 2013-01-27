(function ($) {
    var methods = {
        show: function (options) {
            return this.each(function () {
                console.log('this is the title' + options.title);
                var uniqueid = methods.getoverlayid();
                $('<div class=\"window\" data-uniqueid=\"' + uniqueid + '\"></div>').appendTo('body').css("z-index", uniqueid + 100);
                $(this).show();
                $(this).appendTo('div.window[data-uniqueid=' + uniqueid + ']');
                methods.centerelement(uniqueid);
                $(window).resize(function () { methods.centerelement(uniqueid); });
                $('<div class=\"mask\" data-uniqueid=\"' + uniqueid + '\"></div>').css("height", $(document).height()).appendTo('body').css("z-index", uniqueid);
            });
        },
        hide: function () {
            return this.each(function () { 
            var uniqueid = $(this).parent('div.window').attr('data-uniqueid');
            $(this).unwrap().hide();
            $('div.mask[data-uniqueid=' + uniqueid + ']').remove();
            });
        },
        update: function (content) { },
        centerelement: function (uniqueid) {
            $('div.window[data-uniqueid=' + uniqueid + ']').css({ 'overflow-y': 'none' });
            $('div.window[data-uniqueid=' + uniqueid + ']').css({ 'overflow-x': 'none' });
            $('div.window[data-uniqueid=' + uniqueid + ']').width('auto');
            $('div.window[data-uniqueid=' + uniqueid + ']').height('auto');
            var elemheight = $('div.window[data-uniqueid=' + uniqueid + ']').height();
            var elemwidth = $('div.window[data-uniqueid=' + uniqueid + ']').width();
            var calculatedwidth = ($(window).width() - elemwidth) / 2;
            var calculatedheight = ($(window).height() - elemheight) / 2;
            console.log(calculatedwidth);
            console.log(calculatedheight);
            if (calculatedwidth > 40) {
                $('div.window[data-uniqueid=' + uniqueid + ']').css("left", ($(window).width() - elemwidth) / 2 + 'px');

            } else {$('div.window[data-uniqueid=' + uniqueid + ']').width($(window).width() - 60)
                $('div.window[data-uniqueid=' + uniqueid + ']').css("left", ($(window).width() - ($(window).width()-40)) / 2 + 'px');
             
                $('div.window[data-uniqueid=' + uniqueid + ']').width($(window).width() - 60);
                $('div.window[data-uniqueid=' + uniqueid + ']').css({ 'overflow-x': 'scroll' });
            }

            if (calculatedheight > 40) {
                $('div.window[data-uniqueid=' + uniqueid + ']').css("top", ($(window).height() - elemheight) / 2 + 'px');

            } else {
                $('div.window[data-uniqueid=' + uniqueid + ']').css("top", ($(window).height() - ($(window).height()-40)) / 2 + 'px');
             
                $('div.window[data-uniqueid=' + uniqueid + ']').height($(window).height() - 60);
                $('div.window[data-uniqueid=' + uniqueid + ']').css({'overflow-y':'scroll'});
            }
 
        },
        getoverlayid: function () {
            var startnum = 1000;
            $('.window').each(function () {
                if ($(this).attr('data-uniqueid') > startnum) {
                    startnum = $(this).attr('data-uniqueid');
                }
            });
            return startnum + 1000;
        }
    };
    $.fn.voverlay = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };

})(jQuery);
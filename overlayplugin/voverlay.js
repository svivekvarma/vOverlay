(function ($) {
    var methods = {
        show: function (options) {
            this.each(function () {
                var $this = $(this);
                var uniqueid = methods.getoverlayid();
                $('<div class=\"window\" data-uniqueid=\"' + uniqueid + '\"></div>').appendTo('body').css("z-index", uniqueid + 100);
                if (options.title) {
                    $('<h2>' + options.title + '</h2>').appendTo('div.window[data-uniqueid=' + uniqueid + ']');
                }
                $(this).show();
                $(this).addClass('voverlaycontent');
                $(this).appendTo('div.window[data-uniqueid=' + uniqueid + ']');
                methods.centerelement(uniqueid);
                $(window).resize(function () { methods.centerelement(uniqueid); });
                $('<div class=\"mask\" data-uniqueid=\"' + uniqueid + '\"></div>').css("height", $(document).height()).appendTo('body').css("z-index", uniqueid);
                $('div.mask[data-uniqueid=' + uniqueid + ']').click(function () {
                    $($this).voverlay('hide');
                });
                
                $('div.window[data-uniqueid=' + uniqueid + ']').attr("tabindex", -1).mouseover(function () { $(this).focus(); });
                $('div.window[data-uniqueid=' + uniqueid + ']').mouseleave(function () { $(this).blur(); });

                $('div.window[data-uniqueid=' + uniqueid + ']').keyup(function (e) {
                    if (e.keyCode == 27) {
                        var topoverlayid = methods.gettopmostoverlayid();
                        if (topoverlayid > -1) {
                            $('div.window[data-uniqueid=' + topoverlayid + '] > .voverlaycontent').voverlay('hide');
                            e.preventDefault();
                        }
                    }
                });
            });
            options.onOpen();
            return this;
        },
        hide: function () {
            return this.each(function () {
                var uniqueid = $(this).parent('div.window').attr('data-uniqueid');
                $(this).siblings('h2').remove();
                $(this).unwrap().hide();
                $(this).removeClass('voverlaycontent');
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

            } else {
                $('div.window[data-uniqueid=' + uniqueid + ']').width($(window).width() - 60)
                $('div.window[data-uniqueid=' + uniqueid + ']').css("left", ($(window).width() - ($(window).width() - 40)) / 2 + 'px');

                $('div.window[data-uniqueid=' + uniqueid + ']').width($(window).width() - 60);
                $('div.window[data-uniqueid=' + uniqueid + ']').css({ 'overflow-x': 'scroll' });
            }

            if (calculatedheight > 40) {
                $('div.window[data-uniqueid=' + uniqueid + ']').css("top", ($(window).height() - elemheight) / 2 + 'px');

            } else {
                $('div.window[data-uniqueid=' + uniqueid + ']').css("top", ($(window).height() - ($(window).height() - 40)) / 2 + 'px');

                $('div.window[data-uniqueid=' + uniqueid + ']').height($(window).height() - 60);
                $('div.window[data-uniqueid=' + uniqueid + ']').css({ 'overflow-y': 'scroll' });
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
        },
        gettopmostoverlayid: function () {
            var startnum = -1;
            $('.window').each(function () {
                if ($(this).attr('data-uniqueid') > startnum) {
                    startnum = $(this).attr('data-uniqueid');
                }
            });
            return startnum;
        },
    };
    $.fn.voverlay = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.voverlay');
        }
    };

})(jQuery);
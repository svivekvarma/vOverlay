/*
==================================================================================================
Author : Vivek Siruvuri
 
Plugin Name : voverlay

License : Creative Commons Attribution 3.0 Unported License

GitHub Repository: https://github.com/svivekvarma/voverlay

Contact Url : https://github.com/svivekvarma
==================================================================================================
*/


(function ($) {

    var defaults = {
        opacity: '0.25',
        onOpen: function () { },
        onClose: function () { },
        minSpacing: 40,
        contextMode: false,
        inlinehtml: false,
        html: "",
        clientX :"",
        clientY:"",
        privateconfigs: {}
    };
    var settings = {};

    var voverlay = {
        gettopmostoverlayid: function () {
            var startnum = -1;
            $('.window').each(function () {
                if (parseInt($(this).attr('data-uniqueid'), 10) > startnum) {
                    startnum = parseInt($(this).attr('data-uniqueid'), 10);
                }
            });
            return startnum;
        },
        getnewoverlayid: function () {
            var startnum = 1000;
            $('.window').each(function () {
                if (parseInt($(this).attr('data-uniqueid'), 10) > startnum) {
                    startnum = parseInt($(this).attr('data-uniqueid'), 10);
                }
            });
            return startnum + 1000;
        },
        hideTopMost: function () {
            var topmostid = voverlay.gettopmostoverlayid();
            $('div.window[data-uniqueid=' + topmostid + ']').voverlay('hide');
            //console.log('called hide');
        },
        centerelement: function (uniqueid) {
            $('div.window[data-uniqueid=' + uniqueid + ']').css({ 'overflow-y': 'none' });
            $('div.window[data-uniqueid=' + uniqueid + ']').css({ 'overflow-x': 'none' });
            $('div.window[data-uniqueid=' + uniqueid + ']').width('auto');
            $('div.window[data-uniqueid=' + uniqueid + ']').height('auto');
            var elemheight = $('div.window[data-uniqueid=' + uniqueid + ']').outerHeight(true);
            var elemwidth = $('div.window[data-uniqueid=' + uniqueid + ']').outerWidth(true);
            var calculatedwidth = ($(window).width() - elemwidth) / 2;
            var calculatedheight = ($(window).height() - elemheight) / 2;
            if (calculatedwidth > settings.minSpacing) {
                $('div.window[data-uniqueid=' + uniqueid + ']').css("left", ($(window).width() - elemwidth) / 2 + 'px');

            } else {
                var totalpaddingspacing = settings.minSpacing + $('div.window[data-uniqueid=' + uniqueid + ']').innerWidth() - $('div.window[data-uniqueid=' + uniqueid + ']').width();
                $('div.window[data-uniqueid=' + uniqueid + ']').width($(window).width() - totalpaddingspacing);
                $('div.window[data-uniqueid=' + uniqueid + ']').css("left", ($(window).width() - ($(window).width() - settings.minSpacing)) / 2 + 'px');
                //$('div.window[data-uniqueid=' + uniqueid + ']').width($(window).width() - 60);
                $('div.window[data-uniqueid=' + uniqueid + ']').css({ 'overflow-x': 'scroll' });
            }
            if (calculatedheight > settings.minSpacing) {
                $('div.window[data-uniqueid=' + uniqueid + ']').css("top", ($(window).height() - elemheight) / 2 + 'px');

            } else {
                var totalpaddingspacing = settings.minSpacing + $('div.window[data-uniqueid=' + uniqueid + ']').innerHeight() - $('div.window[data-uniqueid=' + uniqueid + ']').height();
                $('div.window[data-uniqueid=' + uniqueid + ']').css("top", ($(window).height() - ($(window).height() - settings.minSpacing)) / 2 + 'px');

                $('div.window[data-uniqueid=' + uniqueid + ']').height($(window).height() - totalpaddingspacing);
                $('div.window[data-uniqueid=' + uniqueid + ']').css({ 'overflow-y': 'scroll' });
            }

        }
    };

    var methods = {
        show: function () {
            this.each(function () {
                var $this = $(this), data = settings;

                var uniqueid = voverlay.getnewoverlayid();

                settings.privateconfigs.uniqueid = uniqueid;

                $('<div class=\"window\" data-uniqueid=\"' + uniqueid + '\"></div>').appendTo('body').css("z-index", uniqueid + 100);
                if (data.title) {
                    $('<h2>' + data.title + '</h2>').appendTo('div.window[data-uniqueid=' + uniqueid + ']');
                }

                $this = $this.clone(true);
                

                if (!settings.contextMode) {
                    $this.show().addClass('voverlaycontent').appendTo('div.window[data-uniqueid=' + uniqueid + ']');
                    voverlay.centerelement(uniqueid);
                    $(window).resize(function () { voverlay.centerelement(uniqueid); });
                   
                } else {
                    settings.opacity = 0;
                    $this.show().addClass('voverlaycontent').appendTo('div.window[data-uniqueid=' + uniqueid + ']');
                    $('div.window[data-uniqueid=' + uniqueid + ']').css({ position: "absolute", top: settings.clientY, left: settings.clientX });
                    $('div.window[data-uniqueid=' + uniqueid + ']').click(function (e) {
                        e.stopPropagation();
                    });
                }
                
                $('<div class=\"mask\" data-uniqueid=\"' + uniqueid + '\"></div>').css("height", $(document).height()).appendTo('body').css("z-index", uniqueid).css("opacity", settings.opacity);

                $('div.mask[data-uniqueid=' + uniqueid + ']').click(function () {
                    //$('div.window[data-uniqueid=' + uniqueid + ']').voverlay('hide');
                    $this.voverlay('hide');
                });

                $('div.window[data-uniqueid=' + uniqueid + ']').attr("tabindex", -1).focus();

                $('div.window[data-uniqueid=' + uniqueid + ']').keyup(function (e) {
                    if (e.keyCode == 27) {
                        var topoverlayid = voverlay.gettopmostoverlayid();
                        if (topoverlayid > -1) {
                            $('div.window[data-uniqueid=' + topoverlayid + '] > .voverlaycontent').voverlay('hide');
                            //$('div.window[data-uniqueid=' + topoverlayid + ']').voverlay('hide');

                            // Now set focus on new topmost overlay if there is one

                            var newtopmostid = voverlay.gettopmostoverlayid();
                            if (newtopmostid > -1) {
                                $('div.window[data-uniqueid=' + newtopmostid + ']').focus();
                            }
                            e.preventDefault();
                        }
                    }
                });

                settings.privateconfigs.initialized = true;
                settings.onOpen();
                $this.data('voverlay', settings);

            });
            return this;
        },
        hide: function () {
            return this.each(function () {
                if ($(this).parent('.window').length > 0) {
                    var $this = $(this), data = $this.data('voverlay');
                    $('div.mask[data-uniqueid=' + $this.parent('.window').attr('data-uniqueid') + ']').remove();
                    $this.parent('.window').remove();
                    data.onClose();
                    $this.removeData();
                }
            });
        },
        resize: function () {
            return this.each(function () {
                if ($(this).parent('.window').length > 0) {
                    var $this = $(this), data = $this.data('voverlay');
                    uniqueid = $this.parent('.window').attr('data-uniqueid');
                    voverlay.centerelement(uniqueid);
                }
            });
        }
    };
    $.fn.voverlay = function (method, options) {
        settings = $.extend({}, defaults, options);
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.voverlay');
        }
    };

    $.voverlay = {};
    $.voverlay.popOverlay = function () {
        voverlay.hideTopMost();
    }

    $.voverlay.show = function (options) {
        //voverlay.hideTopMost();
        settings = $.extend({}, defaults, options);
        console.log(settings);
        var $this = $('<div class="voverlaycontent"></div>').html(settings.html);
        $this.voverlay('show', settings);
        return settings.privateconfigs.uniqueid;
    }

})(jQuery);

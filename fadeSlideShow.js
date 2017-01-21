/*
 * fadeSlideShow
 * v.2.2.1
 *
 * Copyright (c) 2016 Pascal Bajorat (http://www.pascal-bajorat.com)
 * Dual licensed under the MIT (below)
 * and GPL (http://www.gnu.org/licenses/gpl.txt) licenses.
 *
 *
 * http://plugins.jquery.com/project/fadeslideshow
 * http://www.pascal-bajorat.com

MIT License

Copyright (c) 2013 Pascal Bajorat

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function($) {
    $.fn.fadeSlideShow = function(options) {
        return this.each(function(){
            settings = $.extend({
                width: 640, // default width of the slideshow
                height: 480, // default height of the slideshow
                speed: 'slow', // default animation transition speed
                interval: 3000, // default interval between image change
                Active: 'fssActive', // default class for active stat
                PlayPauseElement: 'fssPlayPause', // default css id for the play / pause element
                PlayText: 'Play', // default play text
                PauseText: 'Pause', // default pause text
                NextElement: 'fssNext', // default id for next button
                NextElementText: 'Next >', // default text for next button
                PrevElement: 'fssPrev', // default id for prev button
                PrevElementText: '< Prev', // default text for prev button
                ListElement: 'fssList', // default id for image / content controll list
                ListLi: 'fssLi', // default class for li's in the image / content controll
                ListLiActive: 'fssActive', // default class for active state in the controll list
                addListToId: false, // add the controll list to special id in your code - default false
                allowKeyboardCtrl: true, // allow keyboard controlls left / right / space
                autoplay: true, // autoplay the slideshow
                beforeSlide: function(){}, // function to call before going to the next slide
                afterSlide: function(){}, // function to call after going to the next slide
                noCSS: false // don't add CSS to slider (you need to manually add the correct style!)
            }, options);

            if (!settings.noCSS) {
                // set style for wrapper element
                $(this).css({
                    width: settings.width,
                    height: settings.height,
                    position: 'relative',
                    overflow: 'hidden'
                });

                // set styles for child element
                $(this).children().css({
                    position: 'absolute',
                    width: settings.width,
                    height: settings.height
                });
            }

            // count number of slides
            var Slides = $(this).children().length;
            Slides = Slides - 1;
            var ActSlide = Slides;
            // Set jQuery Slide short var
            var jQslide = $(this).children();
            // save this
            var fssThis = this;
            var intval = false;
            // Set active class to current active slide.
            jQslide.removeClass(settings.Active);
            jQslide.eq(ActSlide).addClass(settings.Active);
            var autoplay = function(){
                intval = setInterval(function(){
                    settings.beforeSlide();
                    jQslide.eq(ActSlide).velocity("fadeOut", {duration: settings.speed});

                    // if list is on change the active class
                    if(settings.ListElement){
                        var setActLi = (Slides - ActSlide) + 1;
                        if(setActLi > Slides){setActLi=0;}
                        $('#'+settings.ListElement+' li').removeClass(settings.ListLiActive);
                        $('#'+settings.ListElement+' li').eq(setActLi).addClass(settings.ListLiActive);
                    }

                    if(ActSlide <= 0){
                        jQslide.velocity("fadeIn", {duration: settings.speed});
                        ActSlide = Slides;
                    }else{
                        ActSlide = ActSlide - 1;
                    }

                    // Set active class to current active slide.
                    jQslide.removeClass(settings.Active);
                    jQslide.eq(ActSlide).addClass(settings.Active);

                    settings.afterSlide();

                }, settings.interval);

                if(settings.PlayPauseElement){
                    $('#'+settings.PlayPauseElement).html(settings.PauseText);
                }
            };

            var stopAutoplay = function(){
                clearInterval(intval);
                intval = false;
                if(settings.PlayPauseElement){
                    $('#'+settings.PlayPauseElement).html(settings.PlayText);
                }
            };

            var jumpTo = function(newIndex){
                if(newIndex < 0){newIndex = Slides;}
                else if(newIndex > Slides){newIndex = 0;}
                settings.beforeSlide();
                if( newIndex >= ActSlide ){
                    $('> *:lt('+(newIndex+1)+')', fssThis).fadeIn(settings.speed);
                }else if(newIndex <= ActSlide){
                    $('> *:gt('+newIndex+')', fssThis).fadeOut(settings.speed);
                }

                // set the active slide
                ActSlide = newIndex;

                // Set active class to current active slide.
                jQslide.removeClass(settings.Active);
                jQslide.eq(ActSlide).addClass(settings.Active);

                if(settings.ListElement){
                    // set active
                    $('#'+settings.ListElement+' li').removeClass(settings.ListLiActive);
                    $('#'+settings.ListElement+' li').eq((Slides-newIndex)).addClass(settings.ListLiActive);
                }
                settings.afterSlide();
            };

            // if list is on render it
            if(settings.ListElement){
                var i=0;
                var li = '';
                while(i<=Slides){
                    if(i===0){
                        li = li+'<li class="'+settings.ListLi+i+' '+settings.ListLiActive+'"><a href="#">'+(i+1)+'<\/a><\/li>';
                    }else{
                        li = li+'<li class="'+settings.ListLi+i+'"><a href="#">'+(i+1)+'<\/a><\/li>';
                    }
                    i++;
                }
                var List = '<ul id="'+settings.ListElement+'">'+li+'<\/ul>';

                // add list to a special id or append after the slideshow
                if(settings.addListToId){
                    $('#'+settings.addListToId).append(List);
                }else{
                    $(this).after(List);
                }

                $('#'+settings.ListElement+' a').bind('click', function(){
                    var index = $('#'+settings.ListElement+' a').index(this);
                    stopAutoplay();
                    var ReverseIndex = Slides-index;

                    jumpTo(ReverseIndex);

                    return false;
                });
            }

            if(settings.PlayPauseElement){
                if(!$('#'+settings.PlayPauseElement).css('display')){
                    $(this).after('<a href="#" id="'+settings.PlayPauseElement+'"><\/a>');
                }

                if(settings.autoplay){
                    $('#'+settings.PlayPauseElement).html(settings.PauseText);
                }else{
                    $('#'+settings.PlayPauseElement).html(settings.PlayText);
                }

                $('#'+settings.PlayPauseElement).bind('click', function(){
                    if(intval){
                        stopAutoplay();
                    }else{
                        autoplay();
                    }
                    return false;
                });
            }

            if(settings.NextElement){
                if(!$('#'+settings.NextElement).css('display')){
                    $(this).after('<a href="#" id="'+settings.NextElement+'">'+settings.NextElementText+'<\/a>');
                }

                $('#'+settings.NextElement).bind('click', function(){
                    nextSlide = ActSlide-1;
                    stopAutoplay();
                    jumpTo(nextSlide);
                    return false;
                });
            }

            if(settings.PrevElement){
                if(!$('#'+settings.PrevElement).css('display')){
                    $(this).after('<a href="#" id="'+settings.PrevElement+'">'+settings.PrevElementText+'<\/a>');
                }

                $('#'+settings.PrevElement).bind('click', function(){
                    prevSlide = ActSlide+1;
                    stopAutoplay();
                    jumpTo(prevSlide);
                    return false;
                });
            }

            if(settings.allowKeyboardCtrl){
                $(document).bind('keydown', function(e){
                    if(e.which==39){
                        var nextSlide = ActSlide-1;
                        stopAutoplay();
                        jumpTo(nextSlide);
                    }else if(e.which==37){
                        var prevSlide = ActSlide+1;
                        stopAutoplay();
                        jumpTo(prevSlide);
                    }else if(e.which==32){
                        if(intval){stopAutoplay();}
                        else{autoplay();}
                        //return false;
                    }
                });
            }

            // start autoplay or set it to false
            if(settings.autoplay){autoplay();}else{intval=false;}
        });
    };
})(window.jQuery)


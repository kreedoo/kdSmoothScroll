;(function(window, $, undefined){
    'use strict';

    uniqueIDs.smoothScroll = 0;

    var isScrolling = false;

    var SmoothScroll = Class({
        init: function(element, options){
            this.element = $(element);

            this.dest = $(this.element.attr('href'));
            if(this.dest.length === 0) return false;

            this._setOptions(options);

            this.uniqueID = uniqueIDs.smoothScroll++;
            this.prefixed = 'smoothScroll' + this.uniqueID;
            this.eventNamespace = '.' + this.prefixed;
            if(this.element[0].id === ''){
                this.element[0].id = this.prefixed;
                this.idIsGenerated = true;
            }

            this._triggerFunction();
        },
        _setOptions: function(options){
            this.options = $.extend({
                root: false, // scroll object, if false root is $('html'), default false
                speed: 500,
                easing: 'linear',// linear, swing, jquery.easing.js
                scrollBefore: function(root, destElement, destinationPosition){
                    return destinationPosition;
                },
                scrollAfter: function(root, destElement, destinationPosition){
                    //
                }
            }, options, (function(element){
                var datas = {},
                    root = element.data('smoothScrollRoot'),
                    speed = element.data('smoothScrollSpeed'),
                    easing = element.data('smoothScrollEasing');
                if(root !== undefined){
                    datas.root = root;
                }
                if(speed !== undefined){
                    datas.speed = speed;
                }
                if(easing !== undefined){
                    datas.easing = easing;
                }
                return datas;
            }(this.element)));
        },
        _triggerFunction: function(){
            var self = this, destElement, root, position, destinationPosition;

            this.element
                .off('click' + this.eventNamespace)
                .on('click' + this.eventNamespace, function(e){
                    e.preventDefault();

                    if(isScrolling) return false;

                    destElement = $($(this).attr('href'));

                    if(destElement.length === 0) return false;

                    if(self.options.root === false){
                        root = $('html');
                    }else{
                        root = destElement.closest(self.options.root);
                    }

                    destinationPosition = destElement.offsetOfElement(self.options.root).top;

                    position = self.options.scrollBefore.apply(self, [root, destElement, destinationPosition]);
                    if(position === false){
                        return false;
                    }else{
                        destinationPosition = position;
                    }

                    isScrolling = true;

                    root.animate({
                        scrollTop: destinationPosition
                    }, self.options.speed, self.options.easing, function(){
                        isScrolling = false;

                        self.options.scrollAfter.apply(self, [root, destElement, destinationPosition]);
                    });
                });
        },
        scroll: function(scrollObject, destElement, destinationPosition){
            var self = this;

            scrollObject.animate({
                scrollTop: destinationPosition
            }, this.options.speed, this.options.easing, function(){
                isScrolling = false;
                self.options.scrollAfter.apply(self, [scrollObject, destElement, destinationPosition]);
            });
        },
        destroy: function(){
            if(this.idISGenrated){
                this.element[0].id = '';
                this.element.removeAttr('id');
            }
            this.element.removeData('kdSmoothScroll');
        }
    });

    $.fn.smoothScroll = function(options){
        return this.each(function(){
            var ss = new SmoothScroll(this, options);

            $(this).data('kdSmoothScroll', ss);
        });
    };
}(window, jQuery));

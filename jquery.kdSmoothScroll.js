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

            if(this.options.root === false){
                this.root = $('html');
            }else{
                this.root = this.dest.closest(this.options.root);
            }

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
            var self = this, position, destinationPosition;

            this.element
                .off('click' + this.eventNamespace)
                .on('click' + this.eventNamespace, function(e){
                    e.preventDefault();

                    if(isScrolling) return false;

                    destinationPosition = self.dest.offsetOfElement(self.options.root).top;

                    position = self.options.scrollBefore.apply(self, [self.root, self.dest, destinationPosition]);
                    if(position === false){
                        return false;
                    }else{
                        destinationPosition = position;
                    }

                    isScrolling = true;

                    self.scroll(destinationPosition);
                });
        },
        scroll: function(destinationPosition){
            var self = this;

            this.root.animate({
                scrollTop: destinationPosition
            }, this.options.speed, this.options.easing, function(){
                isScrolling = false;
                self.options.scrollAfter.apply(self, [self.root, self.dest, destinationPosition]);
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

    $.fn.kdSmoothScroll = function(options){
        return this.each(function(){
            var ss = new SmoothScroll(this, options);

            $(this).data('kdSmoothScroll', ss);
        });
    };
}(window, jQuery));

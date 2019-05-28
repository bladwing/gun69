;(function($) {
  'use strict';
  var cartData,
    itemData,
    orderPreview = '',
    totalCnt = 0,
    visibleLabel = false,
    label = $('<div class="jqcart-cart-label"><span class="jqcart-title"></span><span class="jqcart-total-cnt">0</span></div>'),
    modal = '<div class="jqcart-layout"><div class="jqcart-checkout">123</div></div>',
    orderform = '<p class="jqcart-cart-title">საკონტაქტო ინფორმაცია:</p><form class="jqcart-orderform"><p><label>სახელი:</label><input type="text" name="user_name"></p><p><label>ტელეფონი:</label><input type="text" name="user_phone"></p><p><label>ელ.ფოსტა:</label><input type="text" name="user_mail"></p><p><label>მისამართი:</label><input type="text" name="user_address"></p><p><label>კომენტარი:</label><textarea name="user_comment"></textarea></p><p><input type="submit" class="productOpt" value="გაგზვნა"><input type="reset" class="productOpt" value="დაბრუნება"></p></form>';
  var opts = {
		buttons: '.add_item',
		cartLabel: 'body',
		visibleLabel: false,
		openByAdding: true,
    handler: '/product',
		currency: '₾'
  };
  var actions = {
    init: function(o) {
      opts = $.extend(opts, o);
      cartData = actions.getStorage();
      if (cartData !== null && Object.keys(cartData).length) {
        for (var key in cartData) {
          if (cartData.hasOwnProperty(key)) {
            totalCnt += cartData[key].count;
          }
        }
        visibleLabel = true;
      }
      label.prependTo(opts.cartLabel)[visibleLabel || opts.visibleLabel ? 'show' : 'hide']()
        .on('click', actions.openCart)
        .find('.jqcart-total-cnt').text(totalCnt);
      $(document)
        .on('click', opts.buttons, actions.addToCart)
        .on('click', '.jqcart-layout', function(e) {
          if (e.target === this) {
            actions.hideCart();
          }
        })
        .on('click', '.jqcart-incr', actions.changeAmount)
				.on('input keyup', '.jqcart-amount', actions.changeAmount)
        .on('click', '.jqcart-del-item', actions.delFromCart)
        .on('submit', '.jqcart-orderform', actions.sendOrder)
        .on('reset', '.jqcart-orderform', actions.hideCart)
				.on('click', '.jqcart-print-order', actions.printOrder);
      return false;
    },
    addToCart: function(e) {
      e.preventDefault();
      itemData = $(this).data();
			if(typeof itemData.id === 'undefined') {
				console.log('no ID');
				return false;
			}
      cartData = actions.getStorage() || {};
      if (cartData.hasOwnProperty(itemData.id)) {
        cartData[itemData.id].count++;
      } else {
        itemData.count = 1;
        cartData[itemData.id] = itemData;
      }
      actions.setStorage(cartData);
      actions.changeTotalCnt(1);
      label.show();
			if(opts.openByAdding) {
				actions.openCart();
			}
      return false;
    },
    delFromCart: function() {
      var $that = $(this),
        line = $that.closest('.jqcart-tr'),
        itemId = line.data('id');
      cartData = actions.getStorage();
      actions.changeTotalCnt(-cartData[itemId].count);
      delete cartData[itemId];
      actions.setStorage(cartData);
      line.remove();
      actions.recalcSum();
      return false;
    },
    changeAmount: function() {
      var $that = $(this),
				manually = $that.hasClass('jqcart-amount'),
        amount = +(manually ? $that.val() : $that.data('incr')),
        itemId = $that.closest('.jqcart-tr').data('id');
      cartData = actions.getStorage();
			if(manually) {
      	cartData[itemId].count = isNaN(amount) || amount < 1 ? 1 : amount;
			} else {
				cartData[itemId].count += amount;
			}
      if (cartData[itemId].count < 1) {
        cartData[itemId].count = 1;
      }
			if(manually) {
				$that.val(cartData[itemId].count);
			} else {
      	$that.siblings('input').val(cartData[itemId].count);
			}
      actions.setStorage(cartData);
      actions.recalcSum();
      return false;
    },
    recalcSum: function() {
      var subtotal = 0,
        amount,
        sum = 0,
        totalCnt = 0;
      $('.jqcart-tr').each(function() {
        amount = +$('.jqcart-amount', this).val();
        sum = Math.ceil((amount * $('.jqcart-price', this).text()) * 100) / 100;
        $('.jqcart-sum', this).html(sum + ' ' + opts.currency);
				subtotal = Math.ceil((subtotal + sum) * 100) / 100;
        totalCnt += amount;
      });
      $('.jqcart-subtotal strong').text(subtotal);
      $('.jqcart-total-cnt').text(totalCnt);
      if (totalCnt <= 0) {
				actions.hideCart();
				if(!opts.visibleLabel) {
        	label.hide();
				}
      }
      return false;
    },
    changeTotalCnt: function(n) {
      var cntOutput = $('.jqcart-total-cnt');
      cntOutput.text((+cntOutput.text() + n));
      return false;
    },
    openCart: function() {
      var subtotal = 0,
			cartHtml = '';
      cartData = actions.getStorage();
      orderPreview = '<p class="jqcart-cart-title">ჩემი შეკვეტა <span class="jqcart-print-order"></span></p><div class="jqcart-table-wrapper"><div class="jqcart-manage-order"><div class="jqcart-thead"><div>კოდი</div><div></div><div>დასახელება</div><div>ერთეულის ფასი</div><div>რაოდენობა</div><div>ჯამი</div><div></div></div>';
      var key, sum = 0;
      for (key in cartData) {
        if (cartData.hasOwnProperty(key)) {
					sum = Math.ceil((cartData[key].count * cartData[key].price) * 100) / 100;
					subtotal = Math.ceil((subtotal + sum) * 100) / 100;
					
          orderPreview += '<div class="jqcart-tr" data-id="' + cartData[key].id + '">';
					orderPreview += '<div class="jqcart-small-td">' + cartData[key].id + '</div>';
					orderPreview += '<div class="jqcart-small-td jqcart-item-img"><img src="' + cartData[key].img + '" alt=""></div>';
          orderPreview += '<div>' + cartData[key].title + '</div>';
          orderPreview += '<div class="jqcart-price">' + cartData[key].price + '</div>';
          orderPreview += '<div><span class="jqcart-incr" data-incr="-1">&#8211;</span><input type="text" class="jqcart-amount" value="' + cartData[key].count + '"><span class="jqcart-incr" data-incr="1">+</span></div>';
          orderPreview += '<div class="jqcart-sum">' + sum + ' ' + opts.currency + '</div>';
					orderPreview += '<div class="jqcart-small-td"><span class="jqcart-del-item"></span></div>';
          orderPreview += '</div>';
        }
      }
      orderPreview += '</div></div>';
      orderPreview += '<div class="jqcart-subtotal">ჯამი: <strong>' + subtotal + '</strong> ' + opts.currency + '</div>';
			
			cartHtml = subtotal ? (orderPreview + orderform) : '<h2 class="jqcart-empty-cart">კალათა ცარიელია</h2>';
      $(modal).appendTo('body').find('.jqcart-checkout').html(cartHtml);
    },

    hideCart: function() {
      $('.jqcart-layout').fadeOut('fast', function() {
        $(this).remove();
      });
      return false;
    },
    sendOrder: function(e) {
      e.preventDefault();
      var $that = $(this);
      if ($.trim($('[name=user_name]', $that).val()) === '' || $.trim($('[name=user_phone]', $that).val()) === '') {
        $('<p class="jqcart-error">შეიყვანეთ თქვენი სახელი და ტელეფონის ნოემერი!</p>').insertBefore($that).delay(3000).fadeOut();
        return false;
      }

      $.ajax({
        url: opts.handler,
        type: 'POST',
				dataType: 'json',
        data: {
          orderlist: $.param(actions.getStorage()),
          userdata:  $that.serialize()
        },

        error: function() {},
        success: function(resp) {
          $('.jqcart-checkout').html('<p>' + resp.message + '</p>');
					if(!resp.errors) {
						setTimeout(methods.clearCart, 2000);
					}

        }

      });
    },
		printOrder: function (){
			var data = $(this).closest('.jqcart-checkout').prop('outerHTML');
			if(!data) {
				return false;
			}
			var win = window.open('', 'ბეჯდვა', 'width='+screen.width+',height='+screen.height),
			cssHref = $(win.opener.document).find('link[href$="style.css"]').attr('href'),
			d = new Date(),
			curDate = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
			
			
			win.document.write('<html><head><title>შეკვეტა ' + curDate + '</title>');
			win.document.write('<link rel="stylesheet" href="' + cssHref + '" type="text/css" />');
			win.document.write('</head><body >');
			win.document.write(data);
			win.document.write('</body></html>');
			
			setTimeout(function(){
				win.document.close(); // нужно для IE >= 10
				win.focus(); // нужно для IE >= 10			
				win.print();
				win.close();
			}, 100);
			
			return true;
		},
    setStorage: function(o) {
      localStorage.setItem('oncart', JSON.stringify(o));
      return false;
    },
    getStorage: function() {
      return JSON.parse(localStorage.getItem('oncart'));
    }
  };
  var methods = {
		clearCart: function(){
			localStorage.removeItem('oncart');
			label[opts.visibleLabel ? 'show' : 'hide']().find('.jqcart-total-cnt').text(0);
			actions.hideCart();
		},
		openCart: actions.openCart,
		printOrder: actions.printOrder,
		test: function(){
			actions.getStorage();
		}
	};
  $.jqCart = function(opts) {
    if (methods[opts]) {
      return methods[opts].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof opts === 'object' || !opts) {
      return actions.init.apply(this, arguments);
    } else {
      $.error('Метод с именем "' + opts + '" не существует!');
    }
  };
})(jQuery);


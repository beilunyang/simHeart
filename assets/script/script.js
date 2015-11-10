$(function(){
	var $ajax_load = $('.ajax_load');
	$(document).ajaxStart(function(){
		$ajax_load.css('display','block');
	});
	$(document).ajaxStop(function(){
		$ajax_load.css('display','none');
	});
	var pages = $('#pages').text();

	/*多说评论*/
	function showDuoshuo(container,pid,url){
		 var el = document.createElement('div');
	    el.setAttribute('data-thread-key', pid);
	    el.setAttribute('data-url', url);
	    DUOSHUO.EmbedThread(el);
	    jQuery(container).append(el);
	}
	

	/*内容详情页*/
	(function(){
		var $container = $('.container');
		var $post = $('.post_main');
		var $close = $('.close');
		var $wrap = $('.wrap');
		var container = document.getElementsByClassName('post_main')[0];
		$('.content').on('click','a',function(e){
			e.preventDefault();
			$container.css('display','none');
			$.get(this.href,function(data){
				$wrap.slideDown();
				$close.css('display','block');
				var $main = $('.main',data);
				$post.append($main.html());
				var pid = $('#pid',data).text();
				var url = $('#url',data).text();			
	            showDuoshuo(container,pid,url);
			});
		});
		$close.click(function(){
			$post.html('');
			$('head>script').filter(':last').remove();
			$wrap.slideUp(function(){
				$close.css('display','none');
				$container.css('display','block');
			});
		});
	})();

	/*加载更多文章,由于需要依靠滚动条，初始化时要确保滚动条*/
	var loadMore = function(){
		var i = 1;
		$html = $('html');
		$content = $('.content');
		$(window).scroll(function(){
			if(i>pages || pages<=1){
				$(window).off('scroll');
				return;
			}
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(document).height();
			var clientHeight = $(this).height();
			if(scrollTop + clientHeight == scrollHeight){
				i+=1;
				if(i<pages){
					$html.css('overflow','hidden');
					$.get('page/'+i+'/',function(data){
						$html.css('overflow','auto');
						$content.append($('article',data));
					});
				}else if(i==pages){
					$html.css('overflow','hidden');
					$.get('page/'+i+'/',function(data){
						$html.css('overflow','auto');
						$content.append($('article',data)).append($('<article style="text-align:center;"><span>加载完了(～﹃～)~zZ</span></article'));
					});
				}
			}
		});
	};
	loadMore();

	/*导航栏*/
	(function(){
		var $content = $('.content');
		var $pages = $('#pages');
		$('nav').on('click','a',function(e){
			e.preventDefault();
			$(window).off('scroll');
			loadMore();
			$.get(this.href,function(data){
				pages = $('#pages',data).text();
				$content.html($('.content',data).html());
			});
		});
	})();

	/*返回顶部*/
	(function(){
		$('#backTop').click(
			function(){
				$('body').animate({scrollTop:0},500);
			}
		);
	})();

})
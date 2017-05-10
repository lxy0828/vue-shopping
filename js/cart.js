var vm = new Vue({
	el:"#app",
	//data就是模型
	//对于全选是可以去定义的，而在每个选择的时候因为是一个循环所以不能再data中去定义
	data:{
		totalMoney:0,
		productList:[],
		checkAllFlag:false
	},
	//局部的过滤器 ,value参数就是调用该过滤器的时候传过来的参数
	filters:{
		formatMoney:function(value){
			return '$'+value.toFixed(2);
		}
	},
	//类似于1.0版本的ready,默认进来执行的方法,是一个函数，官方文档给出mounted函数并不能保证实例已经插入文档，所以还应该在钩子函数中包含VUe.nextTick
	mounted:function(){
		this.cartView()
	},
	//每个事件的绑定都会调用里面的方法
	methods:{
		cartView:function(){
			//通过this去调用vue实例去请求
			//因为在vue实例中所有的this都指向了已经创建的vm实例，但是在一个函数内部不能直接使用this了
			var _this = this
			this.$http.get('data/cart.json',{"id":123}).then(function(res){
				//resource插件封装了一层，把所有的信息都给封装进去了
//				console.log(res.body.result.list[0])
				_this.productList = res.body.result.list;
				_this.totalMoney = res.body.result.totalMoney;
			})
		},
		changeMoney:function(product,way){
			if(way>0){
				product.productQuentity++;
			}else{
				product.productQuentity--;
				if(product.productQuentity<1){
					product.productQuentity = 1;
				}
			}
		},
		selectedProduct:function(item){
			if(typeof item.checked == 'undefined'){
				//全局注册
				Vue.set(item,'checked',true);
				//局部注册,注册一个checked属性
				//this.$set(item,'checked',true)
			}else{
				item.checked = !item.checked;
			}
		},
		checkAll:function(flag){
			this.checkAllFlag = flag;
			var _this = this;
			this.productList.forEach(function(item,index){
				if(typeof item.checked == 'undefined'){
					_this.$set(item,'checked',_this.checkAllFlag);
				}else{
					item.checked = _this.checkAllFlag;
				}
			})
		}
	}
})
//全局过滤器，第一个参数是value值，第二个是传入参数
Vue.filter('money',function(value,m){
	return '$'+value.toFixed(2)+m;
})

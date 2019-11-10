// 创建地图实例
var map = new BMap.Map("container", {enableMapClick:false});

// 创建点坐标
var point = new BMap.Point(116.404, 39.915);

// 初始化地图，设置中心点坐标和地图级别
map.centerAndZoom(point, 18);

//启用滚动
map.enableScrollWheelZoom();

//浏览器定位
var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
			map.addOverlay(mk);
			map.panTo(r.point);
			//alert('您的位置：'+r.point.lng+','+r.point.lat);
			var infoWindow = new BMap.InfoWindow(r.point.lng + '<br>' + r.point.lat, {
				width : 200,     // 信息窗口宽度
				height: 100,     // 信息窗口高度
				title : "您的位置" , // 信息窗口标题
			});  // 创建信息窗口对象 
			mk.addEventListener("click", function(e){          
				map.openInfoWindow(infoWindow,r.point); //开启信息窗口
				map.panTo(r.point);
				//这里位置不准，极速刷新一次
			});
		}
		else {
			alert('Location acquisition failed!');
		}
	},{enableHighAccuracy: true})

//地区检索
var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
	{"input" : "suggestId","location" : map
});

ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	document.getElementById('weather').style.display = 'none';
	var _value = e.item.value;
	var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	suggestId.value = _value.business;
	console.log(_value);
	map.clearOverlays();    //清除地图上所有覆盖物
	
	//进行搜索，调用天气API，显示信息窗口三位一体
	function myFun(){
		var searchpoint = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
		if(_value.city === ""){
			map.centerAndZoom(searchpoint, 6);		//省级聚焦
		} else if(_value.business == _value.city){
			map.centerAndZoom(searchpoint, 10);		//市级聚焦
		} else if(_value.business == _value.district || _value.city ==  _value.district){
			map.centerAndZoom(searchpoint, 12);		//区级、外国城市聚焦
		} else{
		map.centerAndZoom(searchpoint, 18);}	//地方聚焦

		var marker = new BMap.Marker(searchpoint)
		map.addOverlay(marker);    //添加标注
		
		var city = _value.district;		//获取城市信息
		if(_value.city ==  _value.district){
		position.value = city;		//改写当前位置
		} else {
			position.value = _value.city + _value.district;}
		if(city!=""){
			weather(city);	//调用天气API
			marker.addEventListener("click", function(e){
				if(document.getElementById('weather').style.display == 'none'){
					document.getElementById('weather').style.display = 'block';
				} else {
					document.getElementById('weather').style.display = 'none';
				}
			});
		}
	}
	
	//调用myFun
	var local = new BMap.LocalSearch(map, {
		onSearchComplete: myFun
	})
	local.search(myValue);
	//检索功能
});
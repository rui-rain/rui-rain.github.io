var div = document.querySelector("#weather");
var thisDate = new Date();
function weather(city){
	div.innerHTML = "";
	ajax.get({
		url: "http://wthrcdn.etouch.cn/weather_mini?city=" + encodeURIComponent(city),
		onSuccess: function(result) {
			var obj = JSON.parse(result);
			var smg = obj.data.forecast;
			for(var s of smg) {
				var date = s.date;
				var type = s.type;
				var high = s.high.replace(/[^0-9]/ig,"");
				var low = s.low.replace(/[^0-9]/ig,"");
				var fengxiang = s.fengxiang;
				var fengli = s.fengli.replace(/[^0-9]/ig,"");
				var p = document.createElement("p");
				p.innerHTML = date 
				+ "<br>天气：" + type
				+ "<br>最高气温：<br>" + high
				+ "℃<br>最低气温：<br>" + low
				+ "℃<br>" + fengxiang + " " + fengli + "级" ;
				div.appendChild(p);
			}
		}
	})
}
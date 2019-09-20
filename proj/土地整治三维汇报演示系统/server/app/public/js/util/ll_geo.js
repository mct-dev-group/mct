function LL2Geo(lon, lat){
	let lon0 = 114.13756945, lat0 = 30.64532470, lon1 = 114.11858981, lat1 = 30.63211116;
	let x0 = 513186.850, y0 = 3391660.810, x1= 511369.083, y1 = 3390193.840;
	
	let tx = (lon - lon0) / (lon1 - lon0);
	let ty = (lat - lat0) / (lat1 - lat0);
	
	return {x:(x1 - x0) * tx + x0, y:(y1 - y0) * ty + y0};
}

function Geo2LL(x, y){
	let lon0 = 114.13756945, lat0 = 30.64532470, lon1 = 114.11858981, lat1 = 30.63211116;
	let x0 = 513186.850, y0 = 3391660.810, x1= 511369.083, y1 = 3390193.840;

	let tx = (x - x0) / (x1 - x0);
	let ty = (y - y0) / (y1 - y0);
	
	return {lon:(lon1 - lon0) * tx + lon0, lat:(lat1 - lat0) * ty + lat0};
}
import {get} from '@/utils/fetch';

export function getCurrentAreaInfo (parmas) {
  const { id, table } = parmas;
  return get(`/geom/getCurrentAreaInfo/${id}/${table}`);
}

export function setStatus (parmas) {
  const { id, status } = parmas;
  return get(`/geom/setStatus/${id}/${status}`);
}
export function getLeafNodeList(data){
	let result=[];
	getNode(data,result);
	return result;
}
function getNode(data,arr){
	const children=data.children;
	if(children){
		for (const child of children) {
			getNode(child,arr);
		}
	}else{
		arr.push(data);
	}
}
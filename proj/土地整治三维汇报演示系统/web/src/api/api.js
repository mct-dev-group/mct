import {get} from '@/utils/fetch';

export function getCurrentAreaInfo (parmas) {
  const { id, table, DB } = parmas;
  return get(`/geom/getCurrentAreaInfo/${id}/${table}/${DB}`);
}

export function setStatus (parmas) {
  const { id, status, DB } = parmas;
  return get(`/geom/setStatus/${id}/${status}/${DB}`);
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
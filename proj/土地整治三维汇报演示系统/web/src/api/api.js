import {get} from '@/utils/fetch';

export function getCurrentAreaInfo (parmas) {
  const { id, table } = parmas;
  return get(`/geom/getCurrentAreaInfo/${id}/${table}`);
}

export function setStatus (parmas) {
  const { id, status } = parmas;
  return get(`/geom/setStatus/${id}/${status}`);
}

import {get} from '@/utils/fetch';

export function getCurrentAreaInfo (parmas) {
  const { id, table } = parmas;
  return get(`/geom/getCurrentAreaInfo/${id}/${table}`);
} 
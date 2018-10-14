import universal from 'react-universal-component';
import { Loader } from '@common/components';
import config from '@config';

export default function loadComponent(page) {
  const toLoadPage = () =>
    typeof page === 'function' ? page() : import(`./${page}/index`);

  return universal(toLoadPage, {
    minDelay: config['MIN_DELAY'],
    loading: Loader
  });
}

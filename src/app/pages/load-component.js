import universal from 'react-universal-component';
import { Loader } from 'semantic-ui-react';
import config from '@config';

export default function loadComponent(page) {
  const toLoadPage = () =>
    typeof page === 'function' ? page() : import(`./${page}/index`);

  return universal(toLoadPage, {
    minDelay: config['MIN_DELAY'],
    loading: Loader
  });
}

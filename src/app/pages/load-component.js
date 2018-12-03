import universal from 'react-universal-component';
import { ENV } from '@config';
import { ErrorBoundary, Loader } from '@common/components';

export default function loadComponent(page) {
  const toLoadPage = () =>
    typeof page === 'function' ? page() : import(`./${page}/index`);

  return universal(toLoadPage, {
    minDelay: ENV['MIN_DELAY'],
    error: ErrorBoundary,
    loading: Loader
  });
}

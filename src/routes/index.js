import welcome from './welcome';
import test from './test';

const controllers = [welcome, test];

export default (router, container) => controllers.forEach(f => f(router, container));

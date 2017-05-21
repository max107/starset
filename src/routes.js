import Root from './container/Root';
import Homepage from './page/Homepage';
import About from './page/About';

if (module.hot) {
    module.hot.accept();
}

export default {
    Homepage: {
        path: '/',
        component: Homepage,
        wrapper: Root
    },
    About: {
        path: '/about',
        component: About,
        wrapper: Root
    },
};

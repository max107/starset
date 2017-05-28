# Экспериментальная версия сборки статических сайтов с react, react-easy-router, webpack 2

[![Build Status](https://travis-ci.org/max107/starset.svg?branch=master)](https://travis-ci.org/max107/starset)

[Пример](http://starset.studio107.ru) с доступными страницами /index.html и /about.html (см ниже)

---

Подходит для:
Создания "лендингов" или "посадочных страниц", где в качестве backend выступает CRM, к примеру. Для небольших личных блогов и так далее.

Проект собирается в html вместе с данными переданными пользователем, что позволяет сайту нормально индексироваться.

С помощью static-site-webpack-plugin (форк static-site-generator-plugin) происходит обход URL адресов указанных
в файле urls.js который имеет следующую структуру:

```js
module.exports = [
    {
        url: '/',
        target: 'index.html',
        props: { foo: 'bar' }
    },
    {
        url: '/about',
        target: '/about.html',
        props: { foo: 'baz' }
    },
];
```

Где `url` - путь который нужно передать в react-easy-router, `target` - куда сохранять сгенерированный файл и
`props` - параметры которые нужно передать в react компонент.

**Пример установки и подключения в webpack плагина**

```
yarn add static-site-webpack-plugin --dev
# или
npm i --save-dev static-site-webpack-plugin
```

Конфиг webpack:

```js
// ...
plugins: [
    new SiteGeneratorPlugin({
        entry: 'app.bundle.js',
        urls: require('./urls.js'),
    }),
    // ...
]
// ...
```

## Известные проблемы

* webpack плагин в данный момент не умеет принимать `entry` с hash. Если вы указали в
`output: { filename: '[name].[hash].bundle.js' }`, то плагин в данный момент не сможет определить и найти entry.
Нужно указывать точное название, например `[name].bundle.js` и точный entry - `app.bundle.js`
* отсутствует возможность указания PUBLIC_URL для нестандартных url адресов (отличных от /)
* **ТРЕБУЕТСЯ ПОМОЩЬ** с настройкой и динамической перегрузкой роутов
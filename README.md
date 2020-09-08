# Стартовый шаблон "Maffin" для сборки проектов [![Dependency status][dependency-image]][dependency-url]

<h2>Что входит</h2>
  
  <ul>
    <li>Gulp</li>
    <li>SCSS</li>
    <li>Stylelint</li>
  </ul>

<h2>Структура</h2>

<pre>

  source/
    fonts/                    - папка с шрифтами
    img/                      - папка с изображениями
    js/                       - папка со скриптами
    scss/                     - папка со стилями
      blocks/                   - папка для блоков стилей
      global/                   - папка для глобальных стилей стилей
        fonts.scss                - подключение шрифтов
        global.scss               - глобальные стили
        variables.scss            - SCSS переменные (размеры, цвета)
        mixin.scss                - SCSS миксины
      style.scss                - подключение стилей
    index.html                - дефолтная главная страница
</pre>

<h2>Установка</h2>

<pre>

  npm i
</pre>

<h2>Запуск</h2>

<pre>

  npm start
</pre>  


[dependency-image]: https://david-dm.org/VafinArtem/Starter-build-Maffin/dev-status.svg?style=flat-square
[dependency-url]: https://david-dm.org/VafinArtem/Starter-build-Maffin?type=dev

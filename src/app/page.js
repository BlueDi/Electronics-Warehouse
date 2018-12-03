export default ({ styles, js, appString, helmet } = {}) => `
<!doctype html>
  <html ${helmet.htmlAttributes.toString()}>
  <head>
    <meta charset="utf-8">
    ${helmet.meta.toString()}
    ${helmet.title.toString()}
    ${helmet.link.toString()}
    ${styles}
  </head>
  <body>
    <div id="root">${appString}</div>
    ${js}
  </body>
</html>`;

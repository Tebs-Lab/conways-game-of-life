document.addEventListener("DOMContentLoaded", function(event) {
  let embedStyle = "overflow:hidden;width: 250px;height: 250px;display: block;margin: auto;padding: 0 10px 6px 0;background: black;";
  let iframe = document.querySelector('.conways-iframe');
  iframe.setAttribute("style", embedStyle);

  document.querySelector('#embed-btn').addEventListener('click', (e) => {
    e.preventDefault();
    let form = document.querySelector('form');
    let data = new FormData(form);

    let strBuilder = [];
    for(let [key, value] of data) {
        strBuilder.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }

    let iframe = document.querySelector('.conways-iframe');
    iframe.setAttribute("style", embedStyle);
    let src = strBuilder.join('&')
    iframe.src = `${window.location.protocol}//${window.location.host}/grid-maker/grid.html?${src}`;

    let txtArea = document.querySelector('textarea').value = iframe.outerHTML;
  });
});

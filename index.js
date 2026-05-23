const menu = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');
const items = document.querySelectorAll('.nav-item');

menu.addEventListener('click', () => {

  sidebar.classList.toggle('hide');
  style = getComputedStyle(sidebar);
  if (style.width === '250px') {
    menu.textContent = 'Menu';
  } else {
    menu.textContent = 'Close';
  }
});
items.forEach(item => {
  item.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});
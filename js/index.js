// Сортировка и период выборки
const optionBtnOrder = document.querySelector('.option__btn_order');
const optionListOrder = document.querySelector('.option__list_order');
const optionBtnPeriod = document.querySelector('.option__btn_period');
const optionListPeriod = document.querySelector('.option__list_period');

// Кнопка "По дате"
optionBtnOrder.addEventListener('click', () => {
  optionListOrder.classList.toggle('option__list_active');
  optionListPeriod.classList.remove('option__list_active');
});

// Кнопка "За всё время"
optionBtnPeriod.addEventListener('click', () => {
  optionListPeriod.classList.toggle('option__list_active');
  optionListOrder.classList.remove('option__list_active');
});

// Список "По дате..."
optionListOrder.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('option__item')) {
    optionBtnOrder.textContent = target.textContent;
    optionListOrder.classList.remove('option__list_active');
    for (const elem of optionListOrder.querySelectorAll('.option__item')) {
      if (elem === target) {
        elem.classList.add('option__item_active');
      } else {
        elem.classList.remove('option__item_active');
      }
    }
  }
});

// Список "За всё время..."
optionListPeriod.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('option__item')) {
    optionBtnPeriod.textContent = target.textContent;
    optionListPeriod.classList.remove('option__list_active');
    for (const elem of optionListPeriod.querySelectorAll('.option__item')) {
      if (elem === target) {
        elem.classList.add('option__item_active');
      } else {
        elem.classList.remove('option__item_active');
      }
    }
  }
});

// Выбор города
const topCityBtn = document.querySelector('.top__city');
const city = document.querySelector('.city');
const cityClose = document.querySelector('.city__close');
const cityRegionList = document.querySelector('.city__region-list');

// Показываем большой список городов
topCityBtn.addEventListener('click', () => {
  city.classList.toggle('city_active');
});

// Выбираем город
cityRegionList.addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('city__link')) {
    topCityBtn.textContent = target.textContent;
    city.classList.remove('city_active');
  }
});
// Закрываем окно с городами по крестику
cityClose.addEventListener('click', () => {
  city.classList.remove('city_active');
});

// Модальное окно
const overlayVacancy = document.querySelector('.overlay_vacancy');
const resultList = document.querySelector('.result__list');

resultList.addEventListener('click', (e) => {
  const target = e.target;

  if (target.dataset.vacancy) {
    e.preventDefault();
    overlayVacancy.classList.add('overlay_active');
  }
});

overlayVacancy.addEventListener('click', (e) => {
  if (e.target === overlayVacancy || e.target.classList.contains('modal__close')) {
    overlayVacancy.classList.remove('overlay_active');
  }
});

// Вывод карточек
const createCard = (vacancy) => {
  //Деструктуризация
  const {
    title,
    id,
    compensation,
    workSchedule,
    employer,
    address,
    description,
    date
  } = vacancy;
  const card = document.createElement('li');
  card.classList.add('result__item');

  card.insertAdjacentHTML('afterbegin', `
    <article class="vacancy">
      <h2 class="vacancy__title">
        <a class="vacancy__open-modal" href="#" data-vacancy="${id}">${title}</a>
      </h2>
      <p class="vacancy__compensation">${compensation}</p>
      <p class="vacancy__work-schedule">${workSchedule}</p>
      <div class="vacancy__employer">
        <p class="vacancy__employer-title">${employer}</p>
        <p class="vacancy__employer-address">${address}</p>
      </div>
      <p class="vacancy__description">${description}</p>
      <p class="vacancy__date">
        <time datetime="${date.split("/").reverse().join("-")}">${date.split("/").join(".")}</time>
      </p>
      <div class="vacancy__wrapper-btn">
        <a class="vacancy__response vacancy__open-modal" href="#" data-vacancy="${id}">Откликнуться</a>
        <button class="vacancy__contacts">Показать контакты</button>
      </div>
    </article>
  `);
  return card;
};

// Карточки выводятся на страницу на каждой итерации цикла по одной
// const renderCards = (data) => {
//   resultList.textContent = '';
//   for (let i = 0; i < data.length; i += 1) {
//     resultList.append(createCard(data[i]))
//   }
// };

// Карточки выводятся на страницу все сразу, после перебора всего массива
const renderCards = (data) => {
  resultList.textContent = '';
  const cards = data.map(createCard);
  resultList.append(...cards);
};


const getData = ({ search } = {}) => {
  if (search) {
    return fetch(`http://localhost:3000/api/vacancy?search=${search}`).then(response => response.json());
  }
  return fetch('http://localhost:3000/api/vacancy').then(response => response.json());
};

const formSearch = document.querySelector('.bottom__search');
formSearch.addEventListener('submit', async (e) => {
  e.preventDefault();
  const textSearch = formSearch.search.value; // .search. - атрибут name инпута
  if (textSearch.length > 2) {
    formSearch.search.style.borderColor = '';
    const data = await getData({ search: textSearch });
    console.log('data: ', data.length);
    renderCards(data);
    formSearch.reset();
  } else {
    formSearch.search.style.borderColor = 'red';
    setTimeout(() => { formSearch.search.style.borderColor = '' }, 2000);
  }
});

const init = async () => {
  const data = await getData();
  console.log('data: ', data);
  renderCards(data);
};
init();
const optionBtnOrder = document.querySelector('.option__btn_order');
const optionListOrder = document.querySelector('.option__list_order');
const optionBtnPeriod = document.querySelector('.option__btn_period');
const optionListPeriod = document.querySelector('.option__list_period');

const found = document.querySelector('.found');

const topCityBtn = document.querySelector('.top__city');
const city = document.querySelector('.city');
const cityClose = document.querySelector('.city__close');
const cityRegionList = document.querySelector('.city__region-list');

const overlayVacancy = document.querySelector('.overlay_vacancy');
const resultList = document.querySelector('.result__list');

const formSearch = document.querySelector('.bottom__search');

//* Функции

const getData = ({ search, id } = {}) => {
  if (search) {
    return fetch(`https://hidden-tor-24992.herokuapp.com/api/vacancy?search=${search}`).then(response => response.json());
  }
  return fetch(`https://hidden-tor-24992.herokuapp.com/api/vacancy/${id ? id : ''}`).then(response => response.json());
};


// Склонение числительных
const declOfNum = (n, titles) => {
  return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
};


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


const init = async () => {
  const data = await getData();
  renderCards(data);


  //* Обработчики событий

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

  // Создание модального окна
  const createModal = (data) => {
    console.log('data: ', data);
    const {
      address,
      compensation,
      description,
      employer,
      employment,
      experience,
      skills,
      title
    } = data;

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const closeButtonElem = document.createElement('button');
    closeButtonElem.classList.add('modal__close');
    closeButtonElem.textContent = '✕';

    const titleElem = document.createElement('h2');
    titleElem.classList.add('modal__title');
    titleElem.textContent = title;

    const compensationElem = document.createElement('p');
    compensationElem.classList.add('modal__compensation');
    compensationElem.textContent = compensation;

    const employerElem = document.createElement('p');
    employerElem.classList.add('modal__employer');
    employerElem.textContent = employer;

    const addressElem = document.createElement('p');
    addressElem.classList.add('modal__address');
    addressElem.textContent = address;

    const experienceElem = document.createElement('p');
    experienceElem.classList.add('modal__experience');
    experienceElem.textContent = experience;

    const employmentElem = document.createElement('p');
    employmentElem.classList.add('modal__employment');
    employmentElem.textContent = employment;

    const descriptionElem = document.createElement('p');
    descriptionElem.classList.add('modal__description');
    descriptionElem.textContent = description;

    const skillsElem = document.createElement('div');
    skillsElem.classList.add('modal__skills', 'skills');

    const skillsTitleElem = document.createElement('h3');
    skillsTitleElem.classList.add('skills__title');
    skillsTitleElem.textContent = 'Подробнее:';

    const skillsListElem = document.createElement('ul');
    skillsListElem.classList.add('skills__list');
    for (const skill of skills) {
      const skillsItemElem = document.createElement('li');
      skillsItemElem.classList.add('skills__item');
      skillsItemElem.textContent = skill;
      skillsListElem.append(skillsItemElem);
    }

    const submitButtonElem = document.createElement('button');
    submitButtonElem.classList.add('modal__response');
    submitButtonElem.textContent = 'Отправить резюме';

    skillsElem.append(skillsTitleElem, skillsListElem);

    modal.append(
      closeButtonElem,
      titleElem,
      compensationElem,
      employerElem,
      addressElem,
      experienceElem,
      employmentElem,
      descriptionElem,
      skillsElem,
      submitButtonElem
    );

    return modal;
  };

  // Модальное окно
  let modal = null;

  // Открытие модального окна
  resultList.addEventListener('click', async (e) => {
    const target = e.target;

    if (target.dataset.vacancy) {
      e.preventDefault();
      overlayVacancy.classList.add('overlay_active');
      const data = await getData({ id: target.dataset.vacancy });
      modal = createModal(data);
      overlayVacancy.append(modal);
    }
  });

  // Закрытие модального окна
  overlayVacancy.addEventListener('click', (e) => {
    if (e.target === overlayVacancy || e.target.classList.contains('modal__close')) {
      overlayVacancy.classList.remove('overlay_active');
      modal.remove();
    }
  });

  // Поиск
  formSearch.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textSearch = formSearch.search.value; // .search. - атрибут name инпута
    if (textSearch.length > 2) {
      formSearch.search.style.borderColor = '';
      const data = await getData({ search: textSearch });
      renderCards(data);
      found.innerHTML = `${declOfNum(data.length, ['вакансия', 'вакансии', 'вакансий'])} &laquo;${textSearch}&raquo;`;
      formSearch.reset();
    } else {
      formSearch.search.style.borderColor = 'red';
      setTimeout(() => { formSearch.search.style.borderColor = '' }, 2000);
    }
  });

  //* --- end of Обработчики событий ---
};

//* --- end of Функции ---

init();
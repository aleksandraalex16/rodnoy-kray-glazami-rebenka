const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-nav]');

const setHeaderState = () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

document.querySelectorAll('[data-accordion] button').forEach((button) => {
  button.addEventListener('click', () => {
    const content = button.nextElementSibling;
    const isOpen = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', String(!isOpen));
    content.hidden = isOpen;
  });
});

const applicationForm = document.querySelector('[data-application-form]');
const formStatus = document.querySelector('[data-form-status]');

applicationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(applicationForm);
  const rows = [
    ['Муниципальное образование', data.get('municipality')],
    ['Учреждение', data.get('institution')],
    ['Участник', data.get('participant')],
    ['Дата рождения', data.get('birthdate')],
    ['Номинация', data.get('nomination')],
    ['Возрастная категория', data.get('age')],
    ['Название работы', data.get('work')],
    ['Техника, материалы', data.get('technique')],
    ['Руководитель', data.get('leader')],
    ['Контакт', data.get('contact')],
    ['Описание', data.get('description') || 'Не указано'],
  ];
  const text = [
    'ЗАЯВКА на участие в конкурсе «Родной край — глазами ребенка»',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'С условиями конкурса и обработкой персональных данных согласен(на).',
  ].join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Заявка_${data.get('participant') || 'участник'}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
  formStatus.textContent = 'Заявка сформирована и скачана. Передайте файл руководителю клубного формирования.';
  applicationForm.reset();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

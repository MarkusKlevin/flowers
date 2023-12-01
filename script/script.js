('use strict');

let animItems = document.querySelectorAll('._anim_items');

if (animItems.length > 0) {
  window.addEventListener('scroll', animOnScroll);

  function animOnScroll() {
    for (let index = 0; index < animItems.length; index++) {
      const animItem = animItems[index];
      const animItemHeight = animItem.offsetHeight;
      const animItemOffset = offset(animItem).top;
      const animStart = 5;

      let animItemPoint = window.innerHeight - animItemHeight / animStart;

      if (animItemHeight > window.innerHeight) {
        animItemPoint = window.innerHeight - window.innerHeight / animStart;
      }

      if (
        pageYOffset > animItemOffset - animItemPoint &&
        pageYOffset < animItemOffset + animItemHeight
      ) {
        animItem.classList.add('active');
      } else if (!animItem.classList.contains('_anim_no_hide')) {
        animItem.classList.remove('active');
      }
    }
  }

  function offset(el) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  animOnScroll();
}

const TELEGRAM_BOT_TOKEN = '6553072837:AAG7eEf8nHBfowOByJjrfx2B8X6TJeazj3U';
const TELEGRAM_CHAT_ID = '@NailsZakaziBrend';
const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

async function sendEmailTelegram(event) {
  event.preventDefault();

  const form = event.target;
  const formBtn = document.querySelector('.form__submit-button button');
  const formSendResult = document.querySelector('.form__send-result');
  formSendResult.textContent = '';

  const { name, comment, phone, pass } = Object.fromEntries(
    new FormData(form).entries()
  );

  const text = `Заявка от ${name}\nТелефон: ${phone}\nКомментарий: ${comment}`;

  try {
    formBtn.textContent = 'Loading...';

    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
      }),
    });

    if (response.ok) {
      formSendResult.textContent =
        'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.';
      formSendResult.style.color = '#ffff';

      form.reset();
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
    formSendResult.textContent = 'Анкета не отправлена! Попробуйте позже.';
    formSendResult.style.color = 'red';
  } finally {
    formBtn.textContent = 'Отправить';
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Wallet, 
  Lightbulb, 
  Car, 
  ShoppingBag, 
  Trash2, 
  Droplets, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  Home,
  Tv,
  Award,
  Shirt,
  Gift,
  Sparkles,
  Smartphone,
  Utensils,
  PartyPopper,
  Zap,
  BookOpen,
  Coffee
} from 'lucide-react';

// --- Types ---

interface Choice {
  text: string;
  eco: number;
  money: number;
  awareness: number;
  feedback: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  choices: Choice[];
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// --- Data ---

const SCENARIOS: Scenario[] = [
  {
    id: 'transport',
    title: 'Ранок: Дорога до навчання',
    description: 'Твій день починається! Як ти плануєш дістатися до місця навчання сьогодні?',
    icon: <Car className="w-8 h-8 text-blue-500" />,
    choices: [
      {
        text: 'Пішки або на велосипеді',
        eco: 15,
        money: 10,
        awareness: 20,
        feedback: 'Чудовий вибір! Нульові викиди CO2 та економія коштів на проїзд. Фізична активність бадьорить зранку!'
      },
      {
        text: 'Громадський транспорт (автобус/трамвай)',
        eco: 5,
        money: -5,
        awareness: 10,
        feedback: 'Відповідальне рішення. Громадський транспорт значно зменшує вуглецевий слід на одного пасажира порівняно з авто.'
      },
      {
        text: 'Таксі або приватне авто',
        eco: -15,
        money: -20,
        awareness: -10,
        feedback: 'Це зручно, але створює найбільший вуглецевий слід через викиди палива та вимагає найбільших витрат.'
      }
    ]
  },
  {
    id: 'shopping',
    title: 'Перерва: Вибір перекусу',
    description: 'З`явилося відчуття голоду. Що обереш для швидкого перекусу в магазині?',
    icon: <ShoppingBag className="w-8 h-8 text-green-500" />,
    choices: [
      {
        text: 'Локальне яблуко та булочка без упаковки',
        eco: 20,
        money: 10,
        awareness: 20,
        feedback: 'Локальні продукти не потребують тривалого транспортування (фуд-майлз). Відсутність пластику — ще один плюс!'
      },
      {
        text: 'Екзотичний фрукт (напр. манго) в плівці',
        eco: -10,
        money: -10,
        awareness: 5,
        feedback: 'Транспортування літаком створює величезний вуглецевий слід. Пластикова упаковка розкладатиметься сотні років.'
      },
      {
        text: 'Чіпси та газировка в бляшанці',
        eco: -15,
        money: -15,
        awareness: -15,
        feedback: 'Це ультра-оброблена їжа з великою кількістю відходів виробництва та упаковки. Шкідливо і для тебе, і для природи.'
      }
    ]
  },
  {
    id: 'fashion',
    title: 'Оновлення гардеробу',
    description: 'Тобі сподобалася нова футболка в популярному магазині "швидкої моди". Як ти вчиниш?',
    icon: <Shirt className="w-8 h-8 text-pink-500" />,
    choices: [
      {
        text: 'Зайти в секонд-хенд або купити якісну річ на роки',
        eco: 20,
        money: 5,
        awareness: 20,
        feedback: 'Чудово! Використання вживаних речей або купівля якісного одягу (slow fashion) значно зменшує викиди та використання води.'
      },
      {
        text: 'Купити дешеву футболку, бо вона в тренді',
        eco: -15,
        money: -10,
        awareness: -10,
        feedback: 'Швидка мода — один з найбільших забруднювачів планети через перевиробництво та дешеві синтетичні тканини.'
      },
      {
        text: 'Влаштувати "своп" (обмін одягом) з друзями',
        eco: 25,
        money: 20,
        awareness: 25,
        feedback: 'Найбільш екологічний варіант! Речі отримують друге життя без залучення нових ресурсів та грошей.'
      }
    ]
  },
  {
    id: 'advertising',
    title: 'Вплив реклами: Новий гаджет',
    description: 'Ти бачиш рекламу: "Тільки сьогодні! Супер-стильні навушники з 50% знижкою!". У тебе вже є навушники, але ці дуже гарні.',
    icon: <Tv className="w-8 h-8 text-purple-500" />,
    choices: [
      {
        text: 'Проігнорувати і продовжити справи',
        eco: 10,
        money: 20,
        awareness: 25,
        feedback: 'Раціональне рішення! Відмова від непотрібних покупок (Reduce) — найкращий спосіб зменшити навантаження на довкілля.'
      },
      {
        text: 'Купити, бо "така знижка буває раз на рік"',
        eco: -10,
        money: -20,
        awareness: -15,
        feedback: 'Класичне емоційне споживання. Створення нових товарів потребує енергії та ресурсів, а старі часто стають сміттям.'
      },
      {
        text: 'Застосувати "правило 30 днів" (зачекати місяць)',
        eco: 15,
        money: 20,
        awareness: 30,
        feedback: 'Психологічний прийом: за 30 днів емоційний порив зникне, і ти зрозумієш, чи справді тобі потрібна ця річ.'
      }
    ]
  },
  {
    id: 'gift',
    title: 'На вечірку: Подарунок другу',
    description: 'Сьогодні день народження у друга. Що ти підготуєш як подарунок?',
    icon: <Gift className="w-8 h-8 text-red-400" />,
    choices: [
      {
        text: 'Квиток на концерт або сертифікат на враження',
        eco: 20,
        money: -10,
        awareness: 25,
        feedback: 'Подарунки-враження не створюють фізичного сміття та набагато довше запам`ятовуються!'
      },
      {
        text: 'Пластикова іграшка у блискучій упаковці',
        eco: -15,
        money: -15,
        awareness: -15,
        feedback: 'Пластик та металізована упаковка не переробляються і часто стають сміттям вже за кілька днів.'
      },
      {
        text: 'Зробити подарунок власноруч (Upcycling)',
        eco: 25,
        money: 15,
        awareness: 20,
        feedback: 'Унікальний подарунок! Творчий перерозподіл старих речей у нові корисні об`єкти — це вищий рівень еко-культури.'
      }
    ]
  },
  {
    id: 'waste',
    title: 'Завершення обіду: Відходи',
    description: 'У тебе залишилася порожня пластикова пляшка та обгортка від батончика. Що з ними робити?',
    icon: <Trash2 className="w-8 h-8 text-orange-500" />,
    choices: [
      {
        text: 'Відсортувати (пляшку в спецконтейнер)',
        eco: 15,
        money: 0,
        awareness: 20,
        feedback: 'Правильно! Переробка (Recycle) повертає ресурси в цикл виробництва, зменшуючи потребу у видобутку нових.'
      },
      {
        text: 'Викинути все в загальний смітник',
        eco: -10,
        money: 0,
        awareness: -10,
        feedback: 'Так сміття потрапить на звалище, де пляшка лежатиме 450 років, виділяючи мікропластик.'
      },
      {
        text: 'Використати пляшку повторно для води',
        eco: 20,
        money: 5,
        awareness: 15,
        feedback: 'Повторне використання (Reuse) — ще краще за переробку, бо економить енергію на саму переробку!'
      }
    ]
  },
  {
    id: 'cleaning',
    title: 'Прибирання: Засоби для дому',
    description: 'Час трохи прибрати у кімнаті. Які засоби обереш?',
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    choices: [
      {
        text: 'Натуральні засоби (оцет, сода) або еко-сертифіковані продукти',
        eco: 15,
        money: 15,
        awareness: 20,
        feedback: 'Натуральні засоби безпечні для тебе та не забруднюють стічні води небезпечною хімією.'
      },
      {
        text: 'Сильнодіючі засоби з хлором та агресивними ПАР',
        eco: -15,
        money: -10,
        awareness: -5,
        feedback: 'Агресивна побутова хімія шкодить мікрофлорі водойм та може викликати алергію.'
      },
      {
        text: 'Скористатися станцією розливу (Zero Waste Refill)',
        eco: 20,
        money: 10,
        awareness: 25,
        feedback: 'Використання старої тари для нового засобу рятує планету від ще одного пластикового флакона!'
      }
    ]
  },
  {
    id: 'resources',
    title: 'Вечір: Ресурси вдома',
    description: 'Ти повернувся додому. Потрібно зробити домашнє завдання та прийняти душ.',
    icon: <Droplets className="w-8 h-8 text-cyan-500" />,
    choices: [
      {
        text: 'Швидкий душ та вимкнення світла в інших кімнатах',
        eco: 15,
        money: 10,
        awareness: 15,
        feedback: 'Чудова звичка! Економія води та електроенергії безпосередньо зменшує навантаження на екосистеми.'
      },
      {
        text: 'Довга ванна з піною та увімкнений комп`ютер весь вечір',
        eco: -15,
        money: -15,
        awareness: -10,
        feedback: 'Це призводить до великих витрат прісної води та енергії, що збільшує твій особистий вуглецевий слід.'
      },
      {
        text: 'Встановити аератори на крани та еко-режим на гаджетах',
        eco: 25,
        money: 20,
        awareness: 25,
        feedback: 'Системний підхід! Аератори зменшують витрати води до 50% без втрати комфорту, а еко-режим суттєво береже енергію.'
      }
    ]
  },
  {
    id: 'repair',
    title: 'Поломка: Екран смартфона',
    description: 'Екран твого телефону розбився. Батьки пропонують обрати рішення.',
    icon: <Smartphone className="w-8 h-8 text-slate-500" />,
    choices: [
      {
        text: 'Віддати в ремонт та замінити лише скло',
        eco: 25,
        money: 10,
        awareness: 20,
        feedback: 'Найкраще рішення! Ремонт (Repair) економить величезну кількість енергії та дорогоцінних металів, необхідних для нового гаджета.'
      },
      {
        text: 'Купити нову модель, бо вона потужніша',
        eco: -25,
        money: -30,
        awareness: -15,
        feedback: 'Виробництво одного смартфона створює близько 80 кг CO2. Краще ремонтувати старе, поки воно виконує свої функції.'
      },
      {
        text: 'Передати зламаний телефон на переробку та взяти вживаний',
        eco: 20,
        money: 20,
        awareness: 25,
        feedback: 'Чудово! Використання вживаної техніки (Certified Pre-owned) — це потужний внесок у циркулярну економіку.'
      }
    ]
  },
  {
    id: 'lunch',
    title: 'Шкільний обід',
    description: 'Час обіду! У тебе є кілька варіантів, як поїсти у школі.',
    icon: <Utensils className="w-8 h-8 text-orange-400" />,
    choices: [
      {
        text: 'Взяти обід з дому в багаторазовому ланч-боксі',
        eco: 20,
        money: 15,
        awareness: 20,
        feedback: 'Ти контролюєш інгредієнти та уникаєш одноразової упаковки. Це найздоровіший та найекономніший вибір.'
      },
      {
        text: 'Купити готовий ланч у пластиковому контейнері',
        eco: -15,
        money: -10,
        awareness: -5,
        feedback: 'Пластикові бокси часто не переробляються через забруднення їжею та стають сміттям одразу після використання.'
      },
      {
        text: 'Обідати в шкільній їдальні, де використовують багаторазовий посуд',
        eco: 15,
        money: 5,
        awareness: 15,
        feedback: 'Централізоване готування та багаторазовий посуд — це гарний приклад колективної відповідальності.'
      }
    ]
  },
  {
    id: 'celebration',
    title: 'Планування свята',
    description: 'Ти організовуєш свою вечірку. Який підхід до декору обереш?',
    icon: <PartyPopper className="w-8 h-8 text-pink-400" />,
    choices: [
      {
        text: 'Прикрасити кімнату живими рослинами та гірляндами з паперу',
        eco: 20,
        money: 10,
        awareness: 20,
        feedback: 'Стильно та екологічно! Після свята папір можна здати на макулатуру, а рослини продовжать радувати око.'
      },
      {
        text: 'Купити багато повітряних кульок та конфеті',
        eco: -20,
        money: -15,
        awareness: -15,
        feedback: 'Кульки часто лопаються і стають небезпечним сміттям для птахів, а мікропластик з конфеті неможливо прибрати повністю.'
      },
      {
        text: 'Орендувати фотозону з багаторазових конструкцій',
        eco: 15,
        money: 0,
        awareness: 20,
        feedback: 'Економіка спільного споживання в дії! Оренда речей значно раціональніша за купівлю нових одноразових декорацій.'
      }
    ]
  },
  {
    id: 'appliances',
    title: 'Енергозбереження: Гаджети',
    description: 'Ти помітив, що вдома багато пристроїв постійно увімкнені в розетки.',
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    choices: [
      {
        text: 'Вимикати все з розеток перед сном (або через подовжувач з кнопкою)',
        eco: 20,
        money: 15,
        awareness: 20,
        feedback: 'Чудово! Фантомне споживання енергії складає до 10% твого рахунку за світло. Маленький крок — велика економія.'
      },
      {
        text: 'Завжди залишати гаджети в режимі очікування (Standby)',
        eco: -10,
        money: -10,
        awareness: -5,
        feedback: 'Режим очікування продовжує споживати енергію. У масштабах планети це гігантські обсяги даремно спаленого вугілля.'
      },
      {
        text: 'Налаштувати автоматичне вимкнення та еко-режими на всіх пристроях',
        eco: 15,
        money: 10,
        awareness: 20,
        feedback: 'Розумний підхід! Сучасні технології допомагають бути енергоефективними без зайвих зусиль.'
      }
    ]
  },
  {
    id: 'donations',
    title: 'Старі речі та книги',
    description: 'Під час прибирання ти знайшов багато книг та іграшок, якими вже не користуєшся.',
    icon: <BookOpen className="w-8 h-8 text-emerald-500" />,
    choices: [
      {
        text: 'Віддати в місцеву бібліотеку або дитячий будинок',
        eco: 20,
        money: 0,
        awareness: 25,
        feedback: 'Соціальна відповідальність! Твої речі принесуть радість іншим, а планета уникне нових відходів.'
      },
      {
        text: 'Просто викинути в контейнер біля дому',
        eco: -15,
        money: 0,
        awareness: -10,
        feedback: 'Так корисні ресурси просто гнитимуть на звалищі. Намагайся завжди давати речам шанс на друге життя.'
      },
      {
        text: 'Влаштувати гаражний розпродаж або виставити на OLX',
        eco: 20,
        money: 20,
        awareness: 20,
        feedback: 'Циркулярна економіка в дії! Ти заробляєш гроші та допомагаєш комусь придбати потрібне дешевше.'
      }
    ]
  },
  {
    id: 'cafe',
    title: 'У кафе: Культура споживання',
    description: 'Ти замовив напій. Офіціант хоче дати тобі пластикову соломинку.',
    icon: <Coffee className="w-8 h-8 text-amber-600" />,
    choices: [
      {
        text: 'Відмовитися від соломинки взагалі (Refuse)',
        eco: 20,
        money: 0,
        awareness: 25,
        feedback: 'Найвищий рівень свідомості! Відмова від непотрібного пластику — найпростіший спосіб боротьби із забрудненням.'
      },
      {
        text: 'Використати свою власну металеву соломинку',
        eco: 15,
        money: 0,
        awareness: 20,
        feedback: 'Стильно та відповідально. Твій власний набір багаторазових речей робить тебе справжнім еко-героєм.'
      },
      {
        text: 'Взяти пластикову, бо так зручніше пити',
        eco: -15,
        money: 0,
        awareness: -15,
        feedback: 'Соломинки майже не переробляються через малий розмір і часто потрапляють у носи морських черепах та птахів. Обережно!'
      }
    ]
  },
  {
    id: 'digital',
    title: 'Вечір: Цифровий слід',
    description: 'Перед сном ти перевіряєш пошту. Там сотні рекламних листів та старих розсилок. Що зробиш?',
    icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
    choices: [
      {
        text: 'Відписатися від спаму та видалити старі листи',
        eco: 15,
        money: 0,
        awareness: 20,
        feedback: 'Чудово! Зберігання непотрібних даних у хмарі потребує величезної кількості енергії для охолодження дата-центрів.'
      },
      {
        text: 'Залишити все як є, це ж просто байти',
        eco: -5,
        money: 0,
        awareness: -10,
        feedback: 'Кожен лист у поштовій скриньці має свій вуглецевий слід (близько 4г CO2). Мільярди таких листів — це проблема.'
      },
      {
        text: 'Очистити кошик та кеш браузера, встановити еко-пошуковик',
        eco: 20,
        money: 0,
        awareness: 25,
        feedback: 'Просунутий рівень! Еко-пошуковці витрачають частину доходу на висадку дерев, компенсуючи твій цифровий слід.'
      }
    ]
  }
];

const QUIZZES: Quiz[] = [
  {
    id: 'q1',
    question: 'Що означає принцип "3R" в екології?',
    options: [
      'Reduce, Reuse, Recycle (Зменшуй, використовуй повторно, переробляй)',
      'Run, Read, Rest (Бігай, читай, відпочивай)',
      'React, Remove, Replace (Реагуй, видаляй, замінюй)'
    ],
    correctIndex: 0,
    explanation: 'Це фундамент відповідального споживання: спочатку зменшуємо (відходи), потім використовуємо речі повторно, і лише в кінці — здаємо на переробку. Це ієрархія пріоритетів.'
  },
  {
    id: 'q2',
    question: 'Що таке "Вуглецевий слід" (Carbon Footprint)?',
    options: [
      'Відбиток ноги на чорній землі',
      'Загальна сума викидів парникових газів від діяльності людини чи організації',
      'Кількість кисню, яку поглинає одна людина'
    ],
    correctIndex: 1,
    explanation: 'Вимірюється в еквіваленті CO2. Ваш слід включає все: від їжі, яку ви їсте, до енергії, що живить ваш смартфон.'
  },
  {
    id: 'q3',
    question: 'Що таке "фуд-майлз" (харчові милі)?',
    options: [
      'Швидкість доставки їжі додому',
      'Відстань, яку продукт долає від місця виробництва до споживача',
      'Глибина занурення коріння рослин у ґрунт'
    ],
    correctIndex: 1,
    explanation: 'Чим більші фуд-майлз, тим більше пального спалено для доставки і тим вищий вуглецевий слід продукту. Обирайте локальне!'
  },
  {
    id: 'q4',
    question: 'Чим небезпечний "Грінвошинг"?',
    options: [
      'Він робить упаковку занадто яскраво-зеленою',
      'Він вводить в оману, видаючи шкідливі товари за екологічні через маркетинг',
      'Це назва хвороби рослин від надлишку води'
    ],
    correctIndex: 1,
    explanation: 'Коли компанія витрачає більше грошей на рекламу своєї "екологічності", ніж на реальні зміни для довкілля — це грінвошинг. Шукайте перевірені еко-маркування.'
  },
  {
    id: 'q5',
    question: 'Що таке "День екологічного боргу"?',
    options: [
      'День оплати рахунків за воду та світло',
      'Дата, коли людство вичерпує запас відновлюваних ресурсів Землі за рік',
      'День, коли заборонено користуватися пластиком'
    ],
    correctIndex: 1,
    explanation: 'Після цієї дати ми живемо в борг у майбутніх поколінь. Останні роки цей день наступає вже у липні або серпні.'
  },
  {
    id: 'q6',
    question: 'Скільки води в середньому потрібно для виготовлення однієї бавовняної футболки?',
    options: ['100 літрів', '2700 літрів', '50 літрів'],
    correctIndex: 1,
    explanation: 'Це 2700 літрів! Така кількість води могла б забезпечити питні потреби однієї людини протягом 2.5 - 3 років. Бавовна — дуже вологолюбна культура.'
  },
  {
    id: 'q7',
    question: 'Який відсоток мікропластику в океані потрапляє туди через прання синтетичного одягу?',
    options: ['Близько 35%', 'Менше 1%', 'Тільки 10%'],
    correctIndex: 0,
    explanation: 'Близько 35% первинного мікропластику в океані — це мікроволокна від пральних машин. Використовуйте фільтри для прання або обирайте натуральні тканини.'
  },
  {
    id: 'q8',
    question: 'Що таке "Циркулярна економіка"?',
    options: [
      'Економіка, де гроші ходять по колу',
      'Модель виробництва та споживання, що базується на мінімізації відходів та повторному використанні ресурсів',
      'Продаж товарів тільки на круглих ринках'
    ],
    correctIndex: 1,
    explanation: 'Вона замінює лінійну модель "взяв-зробив-викинув". У природі немає сміття — відходи одного процесу є ресурсом для іншого. Це і є циркулярність.'
  },
  {
    id: 'q9',
    question: 'Що таке "Заплановане старіння"?',
    options: [
      'Процес виходу людей на пенсію',
      'Стратегія виробника, коли товар навмисно роблять менш довговічним для стимуляції нових покупок',
      'Автоматичне оновлення програмного забезпечення'
    ],
    correctIndex: 1,
    explanation: 'Це неетична практика, яка стимулює надмірне споживання та створює гори електронних відходів (е-відходів).'
  },
  {
    id: 'q10',
    question: 'Який з цих газів має у 28 разів сильніший парниковий ефект, ніж CO2?',
    options: ['Кисень', 'Аргон', 'Метан'],
    correctIndex: 2,
    explanation: 'Метан (CH4) значно агресивніший парниковий газ. Основні джерела: видобуток копалин, сміттєзвалища та тваринництво.'
  },
  {
    id: 'q11',
    question: 'Що таке "Віртуальна вода"?',
    options: [
      'Вода, яку ми бачимо у відеоіграх',
      'Обсяг води, що використаний для виробництва будь-якого товару',
      'Пара у хмарах'
    ],
    correctIndex: 1,
    explanation: "Наприклад, з'ївши стейк, ви споживаєте 15,000 літрів віртуальної води, витрачених на вирощування кормів та утримання корови."
  },
  {
    id: 'q12',
    question: 'Який тип пластику (PET 1) є найбільш придатним для вторинної переробки?',
    options: ['Прозорі пляшки з-під напоїв', 'Чорні лотки для їжі', 'Кольорові кришечки'],
    correctIndex: 0,
    explanation: 'Прозорий ПЕТ (PET) — "золотий стандарт" переробки. Його легко очистити та перетворити на нові пляшки або текстиль.'
  },
  {
    id: 'q13',
    question: 'Що означає термін "Upcycling" (Апсайклінг)?',
    options: [
      'Підйом на велосипеді вгору',
      'Творче повторне використання речей зі створенням вищої цінності або якості',
      'Заміна старих деталей новими'
    ],
    correctIndex: 1,
    explanation: 'На відміну від ресайклінгу, де матеріал подрібнюється, апсайклінг зберігає оригінальну форму, але дає нову функцію (напр. сумка зі старого банера).'
  },
  {
    id: 'q14',
    question: 'Як називається концепція безвідходного виробництва, де всі складники є безпечними чи поживними для екосистем?',
    options: ['Cradle to Grave (Від колиски до могили)', 'Cradle to Cradle (Від колиски до колиски)', 'Back to Basics'],
    correctIndex: 1,
    explanation: 'Це філософія дизайну "C2C". Біологічні ресурси повертаються у землю (компост), а технічні — нескінченно циркулюють у виробництві.'
  },
  {
    id: 'q15',
    question: 'Яку дію слід зробити ПЕРШОЮ згідно з пірамідою Zero Waste (Нуль відходів)?',
    options: ['Переробити (Recycle)', 'Зменшити (Reduce)', 'Відмовитися (Refuse)'],
    correctIndex: 2,
    explanation: 'Найкращі відходи — ті, що не були створені. Відмова від зайвого (пакети, соломинки, флаєри) — найефективніший крок.'
  },
  {
    id: 'q16',
    question: 'Який відсоток викидів CO2 у світі припадає на сектор IT та дата-центри?',
    options: ['Близько 2-4%', 'Понад 50%', 'Менше 0.1%'],
    correctIndex: 0,
    explanation: 'IT-сектор генерує стільки ж викидів, скільки вся авіаційна галузь. Ваш цифровий комфорт має ціну для планети.'
  },
  {
    id: 'q17',
    question: 'Що таке "Океанічна деоксигенація"?',
    options: [
      'Збільшення вмісту кисню у воді',
      'Зменшення рівня кисню в океані через потепління води',
      'Очищення океану від солі'
    ],
    correctIndex: 1,
    explanation: 'Тепліша вода утримує менше кисню. Це створює "мертві зони", де риби та морські істоти не можуть дихати.'
  },
  {
    id: 'q18',
    question: 'Скільки років потрібно звичайному пластиковому пакету для повного розкладання у природі?',
    options: ['10 років', 'До 20 років', 'До 500 років'],
    correctIndex: 2,
    explanation: 'Пластик не розкладається біологічно, він просто розпадається на мікропластик протягом сотень років, назавжди лишаючись у ґрунті та воді.'
  },
  {
    id: 'q19',
    question: 'Що таке "Біодиверсифікація" та чому вона важлива?',
    options: [
      'Різноманіття видів життя, що забезпечує стійкість екосистем',
      'Процес клонування рідкісних тварин',
      'Вивчення тільки одного виду рослин'
    ],
    correctIndex: 0,
    explanation: 'Чим більше видів у екосистемі, тим вона стабільніша. Втрата одного виду може зруйнувати весь ланцюг живлення.'
  },
  {
    id: 'q20',
    question: 'Яка з цих звичок найбільше допомагає зберегти ресурси прісної води?',
    options: [
      'Вимкнення води під час чищення зубів',
      'Перехід на рослинну дієту (або зменшення споживання м`яса)',
      'Користування паперовими рушниками'
    ],
    correctIndex: 1,
    explanation: 'Хоча вимкнення крана важливе, скорочення споживання яловичини економить десятки тисяч літрів "віртуальної води" за раз.'
  },
  {
    id: 'q21',
    question: 'Що таке "ПФАС" (PFAS), які часто називають "вічними хімікатами"?',
    options: [
      'Харчові добавки для росту м`язів',
      'Група синтетичних сполук, що не розкладаються в природі та накопичуються в організмі',
      'Назва нового виду еко-пластику'
    ],
    correctIndex: 1,
    explanation: 'ПФАС використовуються у антипригарному посуді та водовідштовхувальному одязі. Вони токсичні та зберігаються у довкіллі тисячі років.'
  },
  {
    id: 'q22',
    question: 'Що таке "Ефект міського теплового острова" (Urban Heat Island)?',
    options: [
      'Курортні зони в центрі міста',
      'Явище, коли в містах значно тепліше, ніж у сільській місцевості через бетон та асфальт',
      'Спеціальні обігрівачі на зупинках'
    ],
    correctIndex: 1,
    explanation: 'Бетон поглинає тепло вдень і віддає вночі. Озеленення дахів та вулиць — найкращий спосіб боротьби з цим ефектом.'
  },
  {
    id: 'q23',
    question: 'Що таке "Евтрофікація" водойм?',
    options: [
      'Збільшення кількості риби у ставу',
      'Надмірне збагачення води поживними речовинами (напр. добривами), що веде до "цвітіння" та мору риби',
      'Процес очищення річок від мулу'
    ],
    correctIndex: 1,
    explanation: 'Фосфати з пральних порошків та азот з полів стимулюють вибуховий ріст водоростей, які забирають весь кисень у води.'
  },
  {
    id: 'q24',
    question: 'Яка головна мета "Оцінки життєвого циклу" (LCA) продукту?',
    options: [
      'Визначити ціну товару в магазині',
      'Аналіз екологічного впливу продукту від видобутку сировини до утилізації',
      'Перевірка терміну придатності їжі'
    ],
    correctIndex: 1,
    explanation: 'LCA допомагає зрозуміти "приховану" ціну речі: скільки енергії витрачено на видобуток, пакування, доставку та що з нею буде після викидання.'
  },
  {
    id: 'q25',
    question: 'Що означає термін "Регенеративне землеробство"?',
    options: [
      'Вирощування овочів у теплицях під лампами',
      'Методи господарювання, що відновлюють здоров`я ґрунту та поглинають вуглець з атмосфери',
      'Використання роботів для збору врожаю'
    ],
    correctIndex: 1,
    explanation: 'Замість виснаження землі, воно покращує її, роблячи ґрунт губкою, яка утримує воду та CO2. Це майбутнє сталого харчування.'
  }
];

// --- Components ---

const ProgressBar = ({ value, icon, label, color, max = 100 }: { value: number, icon: React.ReactNode, label: string, color: string, max?: number }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-natural-muted">
        <div className="flex items-center gap-1">
          {icon}
          <span>{label}</span>
        </div>
        <span>{value} / {max}</span>
      </div>
      <div className="h-2 w-full bg-natural-surface rounded-[4px] overflow-hidden">
        <motion.div 
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<'intro' | 'scenario' | 'quiz' | 'feedback' | 'result'>('intro');
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  
  const [stats, setStats] = useState({
    eco: 50,
    money: 50,
    awareness: 20
  });

  const [lastFeedback, setLastFeedback] = useState<Choice | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswerFeedback, setQuizAnswerFeedback] = useState<{isCorrect: boolean, explanation: string} | null>(null);

  const handleChoice = (choice: Choice) => {
    setStats(prev => ({
      eco: Math.min(Math.max(prev.eco + choice.eco, 0), 100),
      money: Math.min(Math.max(prev.money + choice.money, 0), 100),
      awareness: Math.min(Math.max(prev.awareness + choice.awareness, 0), 100)
    }));
    setLastFeedback(choice);
    setGameState('feedback');
  };

  const handleNext = () => {
    if (gameState === 'feedback') {
      // Show 5 quizzes after specific scenarios
      const quizTriggers = [2, 5, 8, 11, 14];
      if (quizTriggers.includes(currentScenarioIdx)) {
        setGameState('quiz');
      } else if (currentScenarioIdx < SCENARIOS.length - 1) {
        setCurrentScenarioIdx(prev => prev + 1);
        setGameState('scenario');
      } else {
        setGameState('result');
      }
    } else if (gameState === 'quiz') {
      if (quizAnswerFeedback) {
        setQuizAnswerFeedback(null);
        
        // Logical blocks of 5 questions per trigger
        const quizzesPerBlock = 5;
        const currentBlockEndIdx = (Math.floor(currentQuizIdx / quizzesPerBlock) + 1) * quizzesPerBlock - 1;

        if (currentQuizIdx < currentBlockEndIdx && currentQuizIdx < QUIZZES.length - 1) {
          setCurrentQuizIdx(prev => prev + 1);
        } else {
          // Finished this block of quizzes
          if (currentScenarioIdx < SCENARIOS.length - 1) {
            setCurrentScenarioIdx(prev => prev + 1);
            setGameState('scenario');
          } else {
            setGameState('result');
          }
        }
      }
    }
  };

  const handleQuizAnswer = (idx: number) => {
    const quiz = QUIZZES[currentQuizIdx];
    const isCorrect = idx === quiz.correctIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setStats(prev => ({ ...prev, awareness: Math.min(prev.awareness + 10, 100) }));
    }
    setQuizAnswerFeedback({ isCorrect, explanation: quiz.explanation });
  };

  const resetGame = () => {
    setStats({ eco: 50, money: 50, awareness: 20 });
    setCurrentScenarioIdx(0);
    setCurrentQuizIdx(0);
    setQuizScore(0);
    setGameState('intro');
  };

  const getResultType = () => {
    if (stats.eco >= 75 && stats.awareness >= 60) return 'eco';
    if (stats.eco <= 30) return 'excessive';
    return 'average';
  };

  const currentScenario = SCENARIOS[currentScenarioIdx];
  const currentQuiz = QUIZZES[currentQuizIdx];

  return (
    <div className="min-h-screen bg-natural-bg font-sans text-natural-ink selection:bg-natural-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Stats Bar */}
        {gameState !== 'intro' && gameState !== 'result' && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row items-center gap-8 bg-natural-white p-6 rounded-[24px] shadow-sm border border-natural-line"
          >
            <div className="text-xl font-black text-natural-eco tracking-tighter shrink-0">ECO-MIND</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <ProgressBar 
                label="Еко-слід" 
                value={stats.eco} 
                icon={<Leaf className="w-4 h-4" />} 
                color="bg-natural-eco" 
              />
              <ProgressBar 
                label="Фінанси" 
                value={stats.money} 
                icon={<Wallet className="w-4 h-4" />} 
                color="bg-natural-money" 
              />
              <ProgressBar 
                label="Свідомість" 
                value={stats.awareness} 
                icon={<Lightbulb className="w-4 h-4" />} 
                color="bg-natural-awareness" 
              />
            </div>
            <button 
              onClick={() => setGameState('result')}
              className="px-4 py-2 bg-natural-eco text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Рефлексія
            </button>
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6 align-start">
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              
              {/* Intro Screen */}
              {gameState === 'intro' && (
                <motion.div 
                  key="intro"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="bg-natural-white p-8 md:p-12 rounded-[24px] shadow-sm border border-natural-line text-center space-y-8"
                >
                  <div className="inline-flex p-5 bg-natural-surface rounded-full">
                    <Leaf className="w-12 h-12 text-natural-eco" />
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-natural-ink-dark">
                      Еко-Свідомість
                    </h1>
                    <p className="text-lg text-natural-text-desc leading-relaxed max-w-xl mx-auto">
                      Проживи один день, приймаючи рішення, що впливають на планету, твої фінанси та рівень відповідальності. Чи зможеш ти стати еко-героєм?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    <div className="p-4 bg-natural-bg rounded-[16px] border border-natural-line">
                      <h3 className="font-bold text-[10px] uppercase tracking-widest text-natural-eco mb-1 flex items-center gap-2">
                        <Leaf className="w-3 h-3" /> Еко
                      </h3>
                      <p className="text-[11px] text-natural-text-desc font-medium">Твій вплив на природу та середовище.</p>
                    </div>
                    <div className="p-4 bg-natural-bg rounded-[16px] border border-natural-line">
                      <h3 className="font-bold text-[10px] uppercase tracking-widest text-natural-money mb-1 flex items-center gap-2">
                        <Wallet className="w-3 h-3" /> Гроші
                      </h3>
                      <p className="text-[11px] text-natural-text-desc font-medium">Твій бюджет та розумні витрати.</p>
                    </div>
                    <div className="p-4 bg-natural-bg rounded-[16px] border border-natural-line">
                      <h3 className="font-bold text-[10px] uppercase tracking-widest text-natural-awareness mb-1 flex items-center gap-2">
                        <Lightbulb className="w-3 h-3" /> Свідомість
                      </h3>
                      <p className="text-[11px] text-natural-text-desc font-medium">Знання про сталий розвиток та 3R.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setGameState('scenario')}
                    className="w-full sm:w-auto px-10 py-4 bg-natural-eco hover:opacity-90 text-white font-bold rounded-[16px] transition-all shadow-md flex items-center justify-center gap-3 mx-auto"
                  >
                    Почати день <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Scenario Screen */}
              {gameState === 'scenario' && (
                <motion.div 
                  key={`scenario-${currentScenario.id}`}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="bg-natural-white p-8 md:p-10 rounded-[24px] shadow-sm border border-natural-line space-y-8 min-h-[480px] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-natural-surface text-natural-eco rounded-[100px] text-xs font-bold mb-4">
                        Ситуація {currentScenarioIdx + 1} з {SCENARIOS.length}
                      </span>
                      <h2 className="text-3xl font-extrabold text-natural-ink-dark leading-tight">{currentScenario.title}</h2>
                      <p className="text-base text-natural-text-desc leading-relaxed mt-4">
                        {currentScenario.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-6">
                    {currentScenario.choices.map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => handleChoice(choice)}
                        className="p-5 text-left border-2 border-natural-surface rounded-[16px] bg-transparent hover:border-natural-eco hover:bg-natural-bg transition-all group flex items-center gap-4"
                      >
                        <div className="w-10 h-10 bg-natural-surface rounded-lg flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">
                          {i === 0 ? '🌱' : i === 1 ? '📦' : '🏷️'}
                        </div>
                        <span className="text-sm font-bold text-natural-ink">{choice.text}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Feedback Screen */}
              {gameState === 'feedback' && lastFeedback && (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-natural-white p-8 md:p-10 rounded-[24px] shadow-sm border border-natural-line space-y-8"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${lastFeedback.eco > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {lastFeedback.eco > 0 ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <h3 className="text-xl font-extrabold text-natural-ink-dark">Наслідки твоєї дії</h3>
                  </div>
                  
                  <div className="p-6 bg-natural-bg rounded-[20px] border border-natural-line leading-relaxed text-base text-natural-text-desc font-medium">
                    {lastFeedback.feedback}
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-y border-natural-line py-6">
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-natural-muted uppercase mb-1">Еко</div>
                      <div className={`text-lg font-black ${lastFeedback.eco >= 0 ? 'text-natural-eco' : 'text-red-500'}`}>
                        {lastFeedback.eco >= 0 ? '+' : ''}{lastFeedback.eco}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-natural-muted uppercase mb-1">Гроші</div>
                      <div className={`text-lg font-black ${lastFeedback.money >= 0 ? 'text-natural-money' : 'text-red-500'}`}>
                        {lastFeedback.money >= 0 ? '+' : ''}{lastFeedback.money}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-natural-muted uppercase mb-1">Свідомість</div>
                      <div className={`text-lg font-black ${lastFeedback.awareness >= 0 ? 'text-natural-awareness' : 'text-red-500'}`}>
                        {lastFeedback.awareness >= 0 ? '+' : ''}{lastFeedback.awareness}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleNext}
                    className="w-full py-4 bg-natural-ink-dark text-white font-bold rounded-[16px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Наступний крок <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Quiz Screen */}
              {gameState === 'quiz' && (
                <motion.div 
                  key={`quiz-${currentQuiz.id}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-natural-white p-8 md:p-10 rounded-[24px] shadow-sm border border-natural-line space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-natural-surface rounded-[16px] border border-natural-line">
                      <Lightbulb className="w-8 h-8 text-natural-awareness" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-natural-awareness uppercase tracking-widest">Перевірка еко-знань</span>
                      <h2 className="text-2xl font-extrabold text-natural-ink-dark">{currentQuiz.question}</h2>
                    </div>
                  </div>

                  {!quizAnswerFeedback ? (
                    <div className="grid grid-cols-1 gap-3">
                      {currentQuiz.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuizAnswer(i)}
                          className="p-5 text-left border border-natural-surface rounded-[16px] bg-transparent hover:bg-natural-bg hover:border-natural-awareness transition-all font-bold text-sm"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-[24px] border ${quizAnswerFeedback.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                        <div className="flex items-center gap-3 mb-2 font-bold text-lg">
                          {quizAnswerFeedback.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                              <span className="text-green-700">Вірно! +10 свідомості</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-6 h-6 text-red-600" />
                              <span className="text-red-700">Майже вгадав...</span>
                            </>
                          )}
                        </div>
                        <p className="text-natural-text-desc leading-relaxed font-medium italic">
                          {quizAnswerFeedback.explanation}
                        </p>
                      </div>
                      <button 
                        onClick={handleNext}
                        className="w-full py-4 bg-natural-ink-dark text-white font-bold rounded-[16px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        Йдемо далі <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Results Screen */}
              {gameState === 'result' && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-natural-white p-8 md:p-12 rounded-[24px] shadow-sm border border-natural-line text-center space-y-8"
                >
                  <div className="inline-flex p-5 bg-natural-bg rounded-full border border-natural-line">
                    <Award className="w-12 h-12 text-natural-eco" />
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-4xl font-black text-natural-ink-dark">Твій еко-баланс</h2>
                    <div className="flex justify-center flex-wrap gap-3 mt-6">
                      <div className="px-5 py-2 bg-natural-surface text-natural-eco rounded-full font-black text-xs uppercase tracking-tight border border-natural-line">
                        Еко: {stats.eco}%
                      </div>
                      <div className="px-5 py-2 bg-natural-surface text-natural-money rounded-full font-black text-xs uppercase tracking-tight border border-natural-line">
                        Гроші: {stats.money}%
                      </div>
                      <div className="px-5 py-2 bg-natural-surface text-natural-awareness rounded-full font-black text-xs uppercase tracking-tight border border-natural-line">
                        Свідомість: {stats.awareness}%
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-[24px] bg-natural-bg border-2 border-dashed border-natural-line">
                    {getResultType() === 'eco' && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black text-natural-eco">Еко-Герой 🌱</h3>
                        <p className="text-natural-text-desc leading-relaxed font-medium">
                          Вітаємо! Ти — відповідальний споживач. Твої рішення допомогли зберегти ресурси та значно зменшили вуглецевий слід. Твій приклад надихає!
                        </p>
                      </div>
                    )}
                    {getResultType() === 'average' && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black text-natural-muted">Раціональний споживач ⚖️</h3>
                        <p className="text-natural-text-desc leading-relaxed font-medium">
                          Ти намагаєшся балансувати між комфортом та екологією. Є успіхи, але деякі звички все ще потребують перегляду для сталого майбутнього.
                        </p>
                      </div>
                    )}
                    {getResultType() === 'excessive' && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black text-red-600">Надмірний споживач ⚠️</h3>
                        <p className="text-natural-text-desc leading-relaxed font-medium">
                          Твій стиль життя створює велике навантаження на довкілля. Пам`ятай, що природні ресурси обмежені. Спробуй впровадити хоча б один принцип 3R завтра!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Fact Block */}
                  <div className="bg-[#E9EDC9] p-6 rounded-[24px] border border-[#CCD5AE] text-left space-y-4">
                    <h4 className="text-[10px] font-black text-natural-eco uppercase mb-1 tracking-[0.2em]">Неймовірні Еко-Факти:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-white/50 rounded-xl">
                          <p className="text-[11px] font-bold text-natural-text-desc leading-snug">
                            <span className="text-lg mr-2">📧</span> Один спам-лист генерує 0.3г CO2. Стовідсоткова очистка пошти світу зекономила б енергію, якої вистачило б на живлення 2 млн домівок.
                          </p>
                        </div>
                        <div className="p-3 bg-white/50 rounded-xl">
                          <p className="text-[11px] font-bold text-natural-text-desc leading-snug">
                            <span className="text-lg mr-2">🧴</span> Скляна пляшка розкладається 1 мільйон років. Але скло — єдиний матеріал, який можна переробляти нескінченно без втрати якості.
                          </p>
                        </div>
                        <div className="p-3 bg-white/50 rounded-xl">
                          <p className="text-[11px] font-bold text-natural-text-desc leading-snug">
                            <span className="text-lg mr-2">👖</span> Для пари джинсів потрібно 8,000 літрів води. Це стільки, скільки ти вип`єш за 10 років життя.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-white/50 rounded-xl">
                          <p className="text-[11px] font-bold text-natural-text-desc leading-snug">
                            <span className="text-lg mr-2">🥑</span> Виготовлення паперу з вторинної сировини (макулатури) потребує на 60% менше енергії та на 80% менше води, ніж з деревини.
                          </p>
                        </div>
                        <div className="p-3 bg-white/50 rounded-xl">
                          <p className="text-[11px] font-bold text-natural-text-desc leading-snug">
                            <span className="text-lg mr-2">📱</span> У тоні старих телефонів у 100 разів більше золота, ніж у тоні золотої руди. Е-відходи — це справжнє родовище у нас під ногами.
                          </p>
                        </div>
                        <div className="p-3 bg-white/50 rounded-xl">
                          <p className="text-[11px] font-bold text-natural-text-desc leading-snug">
                            <span className="text-lg mr-2">🌳</span> Одне дерево за рік поглинає близько 22 кг CO2. Це нейтралізує викиди від поїздки на авто на відстань близько 160 км.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reflection Block */}
                  <div className="text-left space-y-4 bg-natural-surface p-6 rounded-[20px]">
                    <h4 className="font-black text-xs uppercase tracking-widest text-natural-ink-dark border-b border-natural-line pb-2">Рефлексія:</h4>
                    <ul className="space-y-2 text-xs text-natural-text-desc font-bold italic">
                      <li>Яке рішення було прийняти найважче?</li>
                      <li>Чи здивував тебе вплив реклами на твій бюджет?</li>
                      <li>Яку одну зміну ти готовий зробити вже завтра?</li>
                    </ul>
                  </div>

                  <button 
                    onClick={resetGame}
                    className="w-full py-4 bg-natural-eco text-white font-bold rounded-[16px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
                  >
                    <RotateCcw className="w-5 h-5" /> Спробувати ще раз
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Visual Panel / Sidebar */}
          <div className="order-1 lg:order-2">
            <div className="h-full min-h-[300px] bg-natural-line rounded-[24px] relative overflow-hidden flex flex-col items-center justify-center bg-[radial-gradient(#BDC79E_1px,transparent_1px)] bg-[size:20px_20px] p-8 border border-natural-surface">
              <div className="w-48 h-48 bg-natural-white rounded-full shadow-lg flex items-center justify-center text-[80px] mb-8">
                {gameState === 'intro' ? '🌱' : 
                 gameState === 'result' ? '🏆' : 
                 gameState === 'quiz' ? '🧠' : 
                 currentScenario?.id === 'transport' ? '🚲' : 
                 currentScenario?.id === 'shopping' ? '🛒' : 
                 currentScenario?.id === 'fashion' ? '👕' : 
                 currentScenario?.id === 'advertising' ? '📺' : 
                 currentScenario?.id === 'gift' ? '🎁' : 
                 currentScenario?.id === 'waste' ? '♻️' : 
                 currentScenario?.id === 'cleaning' ? '✨' : 
                 currentScenario?.id === 'repair' ? '📱' : 
                 currentScenario?.id === 'lunch' ? '🍱' : 
                 currentScenario?.id === 'celebration' ? '🎉' : 
                 currentScenario?.id === 'appliances' ? '⚡' : 
                 currentScenario?.id === 'donations' ? '📚' : 
                 currentScenario?.id === 'cafe' ? '🥤' : 
                 currentScenario?.id === 'digital' ? '📧' : '🚿'}
              </div>

              {/* Feedback Overlay inside visual panel */}
              {gameState === 'feedback' && lastFeedback && (
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-natural-ink-dark text-white p-6 rounded-[16px] shadow-2xl text-xs leading-relaxed"
                >
                  <div className="text-[10px] font-black text-green-300 uppercase mb-2 tracking-widest border-b border-white/20 pb-1">Миттєвий фідбек</div>
                  {lastFeedback.feedback}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Nav / Progress Dots */}
        {gameState !== 'intro' && gameState !== 'result' && (
          <div className="flex items-center justify-center py-4 bg-natural-white rounded-full border border-natural-line">
            <div className="flex gap-2">
              {SCENARIOS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentScenarioIdx ? 'w-6 bg-natural-eco' : 'w-2 bg-natural-line'}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <footer className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-natural-muted pb-8 flex items-center justify-center gap-6">
          <span className="flex items-center gap-1.5"><Info className="w-3 h-3" /> Переробка: 450р для пластику</span>
          <span className="opacity-20 flex hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> Принцип 3R: REDUCE, REUSE, RECYCLE</span>
        </footer>

      </div>
    </div>
  );
}

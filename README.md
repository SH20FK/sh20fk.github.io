# SH20FK Portfolio - Modular Edition v5.0

## 🎨 Модульная структура с динамичной компоновкой

Полностью переработанная структура сайта с модульным подходом, асимметричными блоками и гибкой сеткой.

---

## ✨ Модульная структура:

### 🏠 Hero Module (Split)
**Левая колонка:**
- Приветственный badge
- Полное имя: Alexander Salamatin
- Typing effect с ролями
- Метаданные: локация + статус

**Правая колонка:**
- Code card с Python классом
- Терминальный стиль оформления
- Синтаксическая подсветка

### 📊 Stats Module (3 Columns)
- Анимированные счетчики
- Emoji иконки
- Projects / Technologies / Motivation
- Градиентные значения

### 👤 About Module (2 Columns)
**Левая (большая):**
- Текстовое описание
- 3 параграфа
- Highlights с галочками

**Правая:**
- Skills card
- 4 прогресс-бара
- Процентные показатели

### 💼 Work Module (Asymmetric)
- **Большая карточка** (проект 1) - 1.5x ширины
- **Малая карточка** (проект 2) - 1x ширины
- Огромные номера на фоне
- Теги технологий
- External links

### ℹ️ Info Module (3 Columns)
1. **Music Card** - Last.fm с кнопкой refresh
2. **Quote Card** - Цитата о коде
3. **Setup Card** - Железо PC

### 📬 Contact Module
- **Header Card** - призыв к действию
- **Grid 4x1** - все контакты
- Telegram, Channel, Last.fm, Steam

---

## 🎯 Ключевые особенности:

### Модульный подход:
- ✅ Каждая секция = отдельный модуль
- ✅ Независимые блоки контента
- ✅ Асимметричная компоновка
- ✅ Гибкая сетка
- ✅ Разная высота модулей

### Визуальные эффекты:
- ✅ Typing эффект в Hero
- ✅ Анимированные счетчики Stats
- ✅ Прогресс-бары навыков
- ✅ Shine эффект на карточках
- ✅ Smooth scroll animations

### Дизайн:
- ✅ Монохромная палитра
- ✅ Glassmorphism стиль
- ✅ Animated background blobs
- ✅ Space Grotesk + Inter шрифты
- ✅ Минималистичный navbar

### Типографика:
- **Space Grotesk** - заголовки (900 weight)
- **Inter** - основной текст
- **JetBrains Mono** - код и цифры
- Четкая иерархия размеров

---

## 📐 Layout структура:

```
Hero:     [50% | 50%]           Split
Stats:    [33% | 33% | 33%]    Equal
About:    [60% | 40%]           Asymmetric
Work:     [60% | 40%]           Asymmetric
Info:     [33% | 33% | 33%]    Equal
Contact:  [Header full width]
          [25% | 25% | 25% | 25%] Grid
```

---

## 🎨 Цветовая схема:

### Dark Theme:
```css
Background: #0a0a0a
Secondary:  #151515
Text:       #ffffff
Muted:      #a0a0a0
Accent:     #ffffff
```

### Light Theme:
```css
Background: #f5f5f5
Secondary:  #e8e8e8
Text:       #1a1a1a
Muted:      #666666
Accent:     #1a1a1a
```

---

## 🚀 Интерактивность:

### Анимации:
- Hero fade in на загрузке
- Stats counters при появлении
- Skills bars заполнение
- AOS для всех модулей
- Hover effects на карточках

### Функционал:
- Theme switcher (Dark/Light)
- Last.fm real-time integration
- Typing effect (3 слова)
- Smooth scroll to top
- Responsive на всех устройствах

---

## 📱 Адаптивность:

### Desktop (>1200px):
- Все модули в своей сетке
- Асимметричные layouts
- Полная ширина контента

### Tablet (768px - 1200px):
- Hero становится вертикальным
- About/Work в 1 колонку
- Stats остается 3 колонки

### Mobile (<768px):
- Все в 1 колонку
- Stats вертикально
- Contact cards вертикально
- Уменьшенные отступы

---

## 🛠️ Технологии:

- **HTML5** - семантическая разметка
- **CSS3** - Grid, Flexbox, Glassmorphism
- **Vanilla JS** - без зависимостей
- **CSS Variables** - темы
- **Intersection Observer** - анимации
- **Fetch API** - Last.fm
- **LocalStorage** - сохранение темы

---

## 📦 Что включено:

- ✅ Модульная структура
- ✅ Асимметричные layouts
- ✅ Typing effect
- ✅ Animated counters
- ✅ Skills progress bars
- ✅ Last.fm integration
- ✅ Light/Dark themes
- ✅ Полная адаптивность
- ✅ AOS animations
- ✅ Smooth scrolling

---

## 🔥 Особенности версии 5.0:

### Изменено:
- ❌ Убран sidebar (был неудобен)
- ✅ Минималистичный top navbar
- ✅ Полное имя: Alexander Salamatin
- ✅ Модульная структура
- ✅ Асимметричные блоки
- ✅ Улучшенная типографика
- ✅ Больше пространства

### Новое:
- 🆕 Code card в Hero
- 🆕 Asymmetric Work grid
- 🆕 Contact header card
- 🆕 Space Grotesk шрифт
- 🆕 Highlights в About

---

## 🚀 Запуск:

```bash
# Просто откройте index.html
open index.html

# Или разверните на GitHub Pages
```

---

**Создано с 🔥 для Alexander Salamatin (SH20FK)**

*v5.0 - Modular Edition*

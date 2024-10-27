# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

Архитектура проекта состоит из основных частей (представлены ниже),
которые взаимодействуют между собой на уровне данных.

UML схема - https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=UML.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D18mJfsY2SUvgDV4zw3vv1QJVyFf4SARNn%26export%3Ddownload

## Базовый код

### 1. enum paymentMethod

Отвечает за выбор статуса оплаты пользователя.
Взаимодействует с Interfase IOrder ( с его параметром payment).

Enum принимает такие аргументы:

1. Online:string - оплата онлайн
2. Offline:string - оплата при получении

### 2. Interfase IOrder

Отвечает за данные пользователя.
itemsIds взаимодействует с id у Interfase IProduct. Собирает, выбранные пользователем,
уникальные идентификаторы продуктов в itemsIds

Interfase принимает такие аргументы:

1. payment:PaymentMethod - способ оплаты товара
2. email:string - почта
3. phone:string - телефон
4. address:string - адрес
5. total:number - итоговая цена (за все товары)
6. itemsIds:string[] - id всех выбранных товаров (добавленных в корзину)

### 3. Interfase IProduct

Отвечает за данные продукта.
Передает необходимые данные остальных элементам приложения.

Interfase принимает такие аргументы:

1. id:string- идентификатор товара
2. description:string- описание товара
3. image:string - фотография товара
4. title:string - заголовок товара
5. category:string - категория товара
6. price:string - цена товара

### 4. Class ProductСatalog

Отвечает за каталог продуктов.
items взаимодействует с Interfase IProduct, принимая массив продуктов.

Класс принимает такие аргументы:

1. items: IProduct[] - принимает массив продуктов

Класс имеет такие методы:

1. fillCatalog(IProduct): string[] - заполнение каталога
2. getCatalog(IProduct): string[] - получение каталога

### 5. Class Cart

Отвечает за взаимодействие с корзиной корзину.

1. items взаимодействует с Interfase IProduct, принимая массив продуктов.

Класс принимает такие аргументы:

1. items: IProduct[] - принимает массив продуктов

Класс имеет такие методы:

1. Cart - корзина
2. addProduct(IProduct): void- добавить в корзину
3. deleteProduct(IProduct): void - удаление из корзины
4. clearCart(): void - очистить корзину
5. getAllProducts(): IProduct[] - получить все продукты

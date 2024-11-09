import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppData, Product } from './components/AppData';
import { Page } from './components/Page';
import { Card, CardBasket, CardPreview } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Order, Contacts } from './components/Order';
import { IOrderForm } from './types';
import { Success } from './components/Success';

const emitter = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const templateCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const templateCardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const appData = new AppData({}, emitter);

const page = new Page(document.body, emitter);
const modal = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	emitter
);

const basket = new Basket(cloneTemplate(basketTemplate), emitter);
const order = new Order(cloneTemplate(orderTemplate), emitter);
const contacts = new Contacts(cloneTemplate(contactsTemplate), emitter);

emitter.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) =>
		new Card(cloneTemplate(templateCardCatalog), {
			onClick: () => emitter.emit('card:select', item),
		}).render({
			title: item.title,
			category: item.category,
			image: `${api.cdn}${item.image}`,
			price: item.price,
		})
	);
});

emitter.on('card:select', (item: Product) => appData.setPreview(item));

emitter.on('preview:changed', (item: Product) => {
	const card = new CardPreview(cloneTemplate(templateCardPreview), {
		onClick: () => emitter.emit('card:add', item),
	});

	modal.render({
		content: card.render({
			title: item.title,
			image: `${api.cdn}${item.image}`,
			text: item.description,
			price: item.price,
			category: item.category,
		}),
	});
});

emitter.on('card:add', (item: Product) => {
	appData.addToOrder(item);
	appData.setProductBasket(item);
	page.counter = appData.basketItems.length;
	modal.close();
});

emitter.on('basket:open', () => {
	basket.setDisabled(basket.button, appData.isBasketEmpty);
	basket.total = appData.getTotal();
	let i = 1;
	basket.items = appData.basketItems.map((item) =>
		new CardBasket(cloneTemplate(templateCardBasket), {
			onClick: () => emitter.emit('card:remove', item),
		}).render({
			title: item.title,
			price: item.price,
			index: i++,
		})
	);
	modal.render({ content: basket.render() });
});

emitter.on('card:remove', (item: Product) => {
	appData.removeProductBasket(item);
	appData.removeFromOrder(item);
	page.counter = appData.basketItems.length;
	basket.setDisabled(basket.button, appData.isBasketEmpty);
	basket.total = appData.getTotal();
	let i = 1;
	basket.items = appData.basketItems.map((item) =>
		new CardBasket(cloneTemplate(templateCardBasket), {
			onClick: () => emitter.emit('card:remove', item),
		}).render({
			title: item.title,
			price: item.price,
			index: i++,
		})
	);
	modal.render({ content: basket.render() });
});

emitter.on(
	'formErrors:change',
	({ email, phone, address, payment }: Partial<IOrderForm>) => {
		order.valid = !address && !payment;
		contacts.valid = !email && !phone;
		order.errors = [address, payment].filter(Boolean).join('; ');
		contacts.errors = [phone, email].filter(Boolean).join('; ');
	}
);

emitter.on(
	/^contacts\..*:change/,
	({ field, value }: { field: keyof IOrderForm; value: string }) =>
		appData.setContactsField(field, value)
);

emitter.on(
	/^order\..*:change/,
	({ field, value }: { field: keyof IOrderForm; value: string }) =>
		appData.setOrderField(field, value)
);

emitter.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
});

emitter.on('order:open', () =>
	modal.render({
		content: order.render({
			address: '',
			payment: 'card',
			valid: false,
			errors: [],
		}),
	})
);

emitter.on('order:submit', () => {
	appData.order.total = appData.getTotal();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

emitter.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					page.counter = appData.basketItems.length;
				},
			});

			modal.render({
				content: success.render({
					total: appData.getTotal(),
				}),
			});
		})
		.catch(console.error);
});

emitter.on('modal:open', () => {
	page.locked = true;
});

emitter.on('modal:close', () => {
	page.locked = false;
});

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch(console.error);

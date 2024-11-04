import {
	FormErrors,
	IAppState,
	IOrder,
	IOrderForm,
	IProductItem,
} from '../types';
import { Model } from './base/Model';

export class AppData extends Model<IAppState> {
	catalog: Product[];
	preview: string;
	basket: Product[] = [];
	order: IOrder = {
		address: '',
		payment: 'card',
		email: '',
		total: 0,
		phone: '',
		items: [],
	};
	formErrors: FormErrors = {};

	clearBasket() {
		this.basket.length = 0;
		this.order.items.length = 0;
	}

	addToOrder(item: Product) {
		if (!this.order.items.includes(item.id)) {
			this.order.items.push(item.id);
		}
	}

	removeFromOrder(item: Product) {
		this.order.items = this.order.items.filter((id) => id !== item.id);
	}

	setCatalog(items: IProductItem[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: Product) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setProductBasket(item: Product) {
		if (!this.basket.includes(item)) {
			this.basket.push(item);
		}
	}

	removeProductBasket(item: Product) {
		this.basket = this.basket.filter((basketItem) => basketItem !== item);
	}

	get isBasketEmpty(): boolean {
		return this.basket.length === 0;
	}

	get basketItems(): Product[] {
		return [...this.basket];
	}

	set total(value: number) {
		this.order.total = value;
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.isOrderValid()) {
			this.events.emit('order:ready', this.order);
		}
	}
	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.areContactsValid()) {
			this.events.emit('order:ready', this.order);
		}
	}

	isOrderValid() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адресс';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	areContactsValid() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}

export class Product extends Model<IProductItem> {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}

import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IPage {
	catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement = ensureElement<HTMLElement>(
		'.header__basket-counter'
	);
	protected _catalog: HTMLElement = ensureElement<HTMLElement>('.gallery');
	protected _wrapper: HTMLElement =
		ensureElement<HTMLElement>('.page__wrapper');
	protected _basket: HTMLElement =
		ensureElement<HTMLElement>('.header__basket');

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._basket.addEventListener('click', () =>
			this.events.emit('basket:open')
		);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', value);
	}
}

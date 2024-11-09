import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	private _total: HTMLElement;
	private _close: HTMLElement;

	constructor(container: HTMLElement, { onClick }: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this._close.addEventListener('click', onClick);
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}

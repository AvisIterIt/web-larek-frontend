import { IOrder, IOrderResult, IProductItem } from '../types';
import { Api, ApiListResponse } from './base/api';

export class LarekApi extends Api {
	cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	getProductList = async (): Promise<IProductItem[]> =>
		((await this.get('/product')) as ApiListResponse<IProductItem>).items;

	orderProducts = (order: IOrder): Promise<IOrderResult> => {
		return this.post('/order', order) as Promise<IOrderResult>;
	};
}

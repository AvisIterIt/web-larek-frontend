enum PaymentMethod {
	Online = 'online',
	Offline = 'offline',
}

interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: string;
}

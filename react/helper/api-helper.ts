import { ucwpWPAPI } from "./ucwpapi";


// v1 of my api
export const ucwpAPIV1 = new ucwpWPAPI("ultimate-crypto-widget", "v1")
	.addPath('coins', 'GET', '/coins.json')
	.addPath('coin-info' , 'GET', '/coin-info.json', ['coin_id'])
	.addPath('coin-chart-data' , 'GET', '/coin-chart-data.json', ['coin_id', 'days'])

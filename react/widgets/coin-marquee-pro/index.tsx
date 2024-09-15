import React,{useState} from "react";
import '@/styles/sass/coin-marquee-pro.scss'
import {UCWPWidgetSetting, CoinData} from "../../types";
import ReactRender from "../../helper-components/react-wrapper";
import Card002 from "./cards/card-002";
import Card003 from "./cards/card-003";
import Marquee from "react-fast-marquee";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import useBinanceStreamTickerWebSocket from "../../helper-components/WebHooks/BinanceStreamTicker";


Chart.register(CategoryScale);
const getCard = (card: string) => {
	switch (card) {
		case 'card-002':
			return Card002;
		case 'card-003':
			return Card003
		default:
			return Card002;
	}
}

ReactRender(({ coins, settings }: { coins: CoinData[], settings: UCWPWidgetSetting }) => {
	const [coinList, _] = useState<CoinData[]>(coins ?? []); // Initialize with props
	const Card = getCard(settings.card ?? 'card-001');
	const parentWidth = typeof settings.parent_width === 'number' ? `${settings.parent_width}px` : settings.parent_width;
	const cardWidth = typeof settings.card_width === 'number' ? `${settings.card_width}px` : settings.card_width;
	const animationDuration = (settings.speed || 3000) / (coinList?.length ?? 10)
	const { connected, data, error } = useBinanceStreamTickerWebSocket(
		coinList?.map((coin) => coin.symbol).slice(0, settings.count),
		settings?.usd_conversion_rate ?? 1
	);
	return (
		<Marquee className="ucwp-coin-marquee-main-marquee-element" style={{ width: parentWidth, display:'flex', gap: '10px' }} pauseOnHover={true} speed={animationDuration} >
			<div className={`ucwp-coin-marquee-main`}>
				{coinList?.slice(0, settings.count).map((_coin) => {
					const coin = { ..._coin, ...data[_coin.symbol.toUpperCase()] };
					return (
						<Card key={coin.id} coinData={coin} style={{ width: cardWidth }} currency_symbol={settings.currency_symbol} />
				)})}
			</div>
		</Marquee>
	);
})


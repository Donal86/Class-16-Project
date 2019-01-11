import React, { Component } from 'react';
import Select from 'react-select';
import SelectList from './SelectList';
import DrawChart from './DrawChart';

import './chart.css';
import moment from 'moment';
moment().format();

class CityChart extends Component {
	state = {
		sqrmChartData: {
			labels: [],
			datasets: [
				{
					label: '',
					data: [],
					fill: false,
					lineTension: 0.1,
					backgroundColor: 'rgba(110, 180, 0,0.4)',
					borderColor: 'rgba(8, 231, 0,0.8)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(75,192,192,1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(110, 180, 0,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10
				}
			]
		},
		priceChartData: {
			labels: [],
			datasets: [
				{
					label: '',
					data: [],
					fill: false,
					lineTension: 0.1,
					backgroundColor: 'rgba(255, 104, 0,0.4)',
					borderColor: 'rgba(153, 41, 0,0.8)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(75,192,192,1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(255, 104, 0,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10
				}
			]
		},
		priceChartTitle: 'Average price ',
		sqrChartTitle: 'Average  square meter',
		options: [
			{ value: 'AVG-PRICE-M2-CHART', label: 'AVG-PRICE-M2-CHART' },
			{ value: 'AVG-PRICE-CHART', label: 'AVG-PRICE-CHART' }
		],
		toggleChart: false,
		selectedOption: 'Athens-Center',
		clickedOption: 'AVG-PRICE-CHART',
		noDataError: false
	};

	componentDidMount() {
		this.handleSelectChange({ value: 'Athens-Center' });
	}

	updateState = (sourceData) => {
		const allAveragesArray = [];
		const avgPriceSqrArray = [];
		const avgPriceDataArray = [];

		if (sourceData.message) {
			this.setState({ noDataError: true });
			return;
		}

		const averagesObjByDate = sourceData.map((entry) => {
			const { avgSqr, market_date, averagePrice } = entry;
			const date = moment(market_date).format('YYYY-MM-DD');

			const avgSqrNum = parseFloat(avgSqr.replace(/,/g, ''));
			const avgPriceNum = parseFloat(averagePrice.replace(/,/g, ''));

			return { avgPriceNum, avgSqrNum, date };
		});

		allAveragesArray.push(averagesObjByDate);
		const currentDay = new Date();

		let daysRangeDisplayed = moment(currentDay).subtract(10, 'd').format('YYYY-MM-DD');

		const days = [];
		while (moment(daysRangeDisplayed).isBefore(currentDay)) {
			days.push(daysRangeDisplayed);
			daysRangeDisplayed = moment(daysRangeDisplayed).add(1, 'days').format('YYYY-MM-DD');
		}

		allAveragesArray.forEach((eachAvgObj) => {
			let lastAvgSqr = null;
			let lastAvgPrice = null;
			let currentIndex = 0;
			const min = days[0];
			const max = days[days.length - 1];

			for (let day = min; day <= max; day = moment(day).add(1, 'days').format('YYYY-MM-DD')) {
				if (day >= eachAvgObj[currentIndex].date) {
					lastAvgSqr = eachAvgObj[currentIndex].avgSqrNum;
					lastAvgPrice = eachAvgObj[currentIndex].avgPriceNum;

					if (currentIndex < eachAvgObj.length - 1) currentIndex++;
				}
				avgPriceSqrArray.push(lastAvgSqr);
				avgPriceDataArray.push(lastAvgPrice);
			}
		});

		const { sqrmChartData, priceChartData } = this.state;
		this.setState({
			sqrmChartData: {
				...sqrmChartData,
				labels: days,
				datasets: [ { ...sqrmChartData.datasets[0], label: 'Per-Sqrm', data: avgPriceSqrArray } ]
			},
			priceChartData: {
				...priceChartData,
				labels: days,
				datasets: [ { ...priceChartData.datasets[0], label: 'price', data: avgPriceDataArray } ]
			}
		});
	};

	handleSelectChange = async (selectedOption) => {
		await this.setState({ selectedOption });

		fetch(`http://localhost:3123/api/stats?city=${selectedOption.value}`, {})
			.then((res) => res.json())
			.then((data) => this.updateState(data))
			.catch((err) => console.log(err));
	};

	handelChartSelectChange = async (clickedOption) => {
		if (clickedOption.value === 'AVG-PRICE-CHART') {
			await this.setState({ toggleChart: true });
		}
		if (clickedOption.value === 'AVG-PRICE-M2-CHART') {
			await this.setState({ toggleChart: false });
		}
		this.setState({ toggleChart: !this.state.toggleChart });
	};

	render() {
		const {
			selectedOption,
			priceChartData,
			sqrmChartData,
			priceChartTitle,
			sqrChartTitle,
			noDataError,
			toggleChart
		} = this.state;

		const renderContent = noDataError ? (
			<p className="no-data "> Sorry, There are no data available now ...</p>
		) : !toggleChart ? (
			<DrawChart data={priceChartData} text={priceChartTitle} />
		) : (
			<DrawChart data={sqrmChartData} text={sqrChartTitle} />
		);

		return (
			<div className="container">
				<SelectList className="select" changeHandler={this.handleSelectChange} />
				<h2 className="price-heading">{`Price trend in ${selectedOption.value} for the last 10 days ...`}</h2>
				<Select
					className="chart-select"
					options={this.state.options}
					value={this.state.clickedOption}
					onChange={this.handelChartSelectChange}
					placeholder="Select Chart... "
				/>

				{renderContent}
			</div>
		);
	}
}
export default CityChart;

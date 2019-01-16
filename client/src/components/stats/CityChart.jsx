import React, { Component } from 'react';
import Select from 'react-select';
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
		options: [],
		selectedOption: null,
		priceChartTitle: 'Average price per property',
		sqrChartTitle: 'Average price per square meter ',
	};

	componentDidMount() {
		this.getCitiesName();

		const cityQuery = this.props.location.search.replace(/(\?city=)(\S)/i, '$2');
		if (this.props.location.search) {
			if (!(/city/i).test(cityQuery)) {
				this.setState({ selectedOption: { value: cityQuery, label: cityQuery } })
				this.linkQuerySelect(cityQuery);
			}
		} else {
			this.linkQuerySelect(cityQuery);
		}
	}

	getCitiesName = async () => {
		return await fetch(` http://localhost:3123/api/city-name`)
			.then((res) => res.json())
			.then((cities) => {
				this.groupCitiesForSelect(cities);
			})
			.catch((err) => console.log(err));
	};

	groupCitiesForSelect = (citiesList) => {
		const optionsObj = citiesList.map((option) => ({ value: option.city, label: option.city }));
		this.setState({
			options: [...optionsObj],
		})
	};

	updateState = (sourceData) => {
		const allAveragesArray = [];
		const avgPriceSqrArray = [];
		const avgPriceDataArray = [];
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
				...sqrmChartData, labels: days, datasets: [{ ...sqrmChartData.datasets[0], label: 'Per-Sqrm', data: avgPriceSqrArray }]
			},
			priceChartData: {
				...priceChartData, labels: days, datasets: [{ ...priceChartData.datasets[0], label: 'Per-Property', data: avgPriceDataArray }]
			}
		});
	};

	linkQuerySelect = async (city) => {
		return await fetch(`http://localhost:3123/api/stats?city=${city}`, {})
			.then((res) => res.json())
			.then((data) => this.updateState(data))
			.catch((err) => console.log(err));
	}

	handleSelectChange = async (selectedOption) => {
		await this.setState({ selectedOption });
		this.linkQuerySelect(selectedOption.value)
		this.props.history.push("?city=" + this.state.selectedOption.value)
	};

	render() {
		const {
			selectedOption, priceChartData, sqrmChartData, priceChartTitle, sqrChartTitle, options } = this.state;

		const chartHeader = typeof this.state.selectedOption === 'undefined' || !priceChartData.datasets[0].data.length ? `Properties price trend in selected city for the last 10 days ...` : `Properties price trend in ${selectedOption.value} for the last 10 days ...`;
		return (
			<div className="container">
				<Select
					className="select-main"
					value={selectedOption}
					onChange={this.handleSelectChange}
					options={options}
					placeholder="Select City..."
				/>
				<h2 className="price-heading">{chartHeader}</h2>
				<div className="charts-div"><div className="test"><DrawChart data={priceChartData} text={priceChartTitle} /></div>
					<div className="test"><DrawChart data={sqrmChartData} text={sqrChartTitle} /></div>
				</div>

			</div>
		);
	}
}
export default CityChart;

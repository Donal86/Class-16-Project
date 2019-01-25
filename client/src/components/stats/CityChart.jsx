import React, { Component } from 'react';
import Select from 'react-select';
import DrawChart from './DrawChart';
import queryString from 'query-string';
import './chart.css';
import moment from 'moment';
moment().format();

const CHART_RANGE = 20;

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
					pointBorderColor: 'rgba(0, 51, 0,0.5)',
					pointBackgroundColor: 'rgba(110, 180, 0,0.4)',
					pointBorderWidth: 1,
					pointHoverRadius: 4,
					pointHoverBackgroundColor: 'rgba(110, 180, 0,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 5,
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
					pointBorderColor: 'rgba(255, 51, 0,0.5)',
					pointBackgroundColor: 'rgba(255, 104, 0,0.4)',
					pointBorderWidth: 1,
					pointHoverRadius: 4,
					pointHoverBackgroundColor: 'rgba(255, 104, 0,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 5,
					pointHitRadius: 10
				}
			]
		},
		options: [],
		selectedOption: null,
		priceChartTitle: 'Average price per property',
		sqrChartTitle: 'Average price per square meter ',
		noData: false,
		cityNotFound: false,
		noCities: false
	};

	componentDidMount() {
		this.getCitiesName();
		const parsedQuery = queryString.parse(this.props.location.search);
		if (this.props.location.search) {
			if (parsedQuery.city) {
				this.setState({ selectedOption: { value: parsedQuery.city, label: parsedQuery.city } })
				this.startFetchRequest(parsedQuery.city);
			}
		}
	}

	getCitiesName = async () => {
		return await fetch(`/api/city-name`)
			.then(res => {
				if (res.status === 404) {
					this.setState({ noCities: true })
				} else {
					return res.json().then((cities) => {
						this.groupCitiesForSelect(cities);
					})
				}
			})
			.catch((err) => console.log(err));
	};

	groupCitiesForSelect = (citiesList) => {
		this.setState({ cityNotFound: false })
		const parsedQuery = queryString.parse(this.props.location.search);
		const citiesObjValues = []
		for (let i = 0; i < citiesList.length; i++) {
			citiesObjValues.push(citiesList[i].city)
			if (this.props.location.search) {
				if (!citiesObjValues.includes(parsedQuery.city)) {
					this.setState({ cityNotFound: true })
				} else { this.setState({ cityNotFound: false }) }
			}
		}
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
			const date = moment(market_date);
			const avgSqrNum = parseFloat(avgSqr.replace(/,/g, ''));
			const avgPriceNum = parseFloat(averagePrice.replace(/,/g, ''));
			return { avgPriceNum, avgSqrNum, date };
		});
		allAveragesArray.push(averagesObjByDate);
		const currentDay = moment();
		let daysRangeDisplayed = moment(currentDay).subtract(20, 'd');
		const days = [];
		while (moment(daysRangeDisplayed).isBefore(currentDay)) {
			days.push(daysRangeDisplayed);
			daysRangeDisplayed = moment(daysRangeDisplayed).add(1, 'days');
		}
		allAveragesArray.forEach((eachAvgObj) => {
			let lastAvgSqr = null;
			let lastAvgPrice = null;
			let currentIndex = 0;
			const min = days[0];
			const max = days[days.length - 1];
			for (let day = min; day <= max; day = moment(day).add(1, 'days')) {
				if (day >= eachAvgObj[currentIndex].date) {
					lastAvgSqr = eachAvgObj[currentIndex].avgSqrNum;
					lastAvgPrice = eachAvgObj[currentIndex].avgPriceNum;
					if (currentIndex < eachAvgObj.length - 1) currentIndex++;
				}
				avgPriceSqrArray.push(lastAvgSqr);
				avgPriceDataArray.push(lastAvgPrice);
			}
		});

		const daysNewFormat = days.map(day => {
			return day = moment(day).format("MMM D")
		})

		const { sqrmChartData, priceChartData } = this.state;
		this.setState({
			sqrmChartData: {
				...sqrmChartData, labels: daysNewFormat, datasets: [{ ...sqrmChartData.datasets[0], label: 'M² price', data: avgPriceSqrArray }]
			},
			priceChartData: {
				...priceChartData, labels: daysNewFormat, datasets: [{ ...priceChartData.datasets[0], label: 'Property price', data: avgPriceDataArray }]
			}
		});
	};

	startFetchRequest = async (city) => {
		return await fetch(`/api/stats?city=${city}`, {})
			.then((res) => res.json())
			.then((data) => data.length < 1 ? this.setState({ noData: true }) : this.updateState(data))
			.catch((err) => console.log(err));
	}

	handleSelectChange = async (selectedOption) => {
		await this.setState({ selectedOption, noData: false, cityNotFound: false });
		this.startFetchRequest(selectedOption.value)
		this.props.history.push('/citychart?city=' + this.state.selectedOption.value)
	};

	render() {
		const {
			selectedOption, priceChartData, sqrmChartData, priceChartTitle, sqrChartTitle, options, noData, cityNotFound, noCities } = this.state;

		const chartDivStyle = selectedOption === null || noData ? {
			display: "none"
		} : { display: "" }
		const imageClass = selectedOption === null ? "image-display" : "image-not-display"
		const headerDisplayInWrongEntry = cityNotFound ? { display: "none" } : { display: "" }

		const chartHeader = noCities && selectedOption === null ? <h2 className="no-cities">Sorry no cities available now</h2>
			: typeof this.state.selectedOption === 'undefined' || !priceChartData.datasets[0].data.length ? <h2 className="price-heading" style={headerDisplayInWrongEntry}> Select a city from the<span className="list-word"> list</span> to display average price charts per property and Sqrm for the last {CHART_RANGE} days...</h2>
				: <h2 className="price-heading">Price trend in {selectedOption.value} for the last {CHART_RANGE} days ...</h2>;

		const renderError = cityNotFound ? <h2 className="wrong-entry-header">Wrong Entry... Please select from the list</h2> : ""
		return (
			<React.Fragment >
				<Select
					className="select-main"
					value={selectedOption}
					onChange={this.handleSelectChange}
					options={options}
					placeholder="Select City..."
				/>
				{chartHeader}
				{renderError}
				<img className={imageClass} src="https://i.postimg.cc/GtN0HkZd/man-pointing-to-chart-600x400.gif" alt="man pointing to chart"></img>
				<div className="charts-div" style={chartDivStyle}>
					<div className="chart-box"><DrawChart data={priceChartData} text={priceChartTitle} /></div>
					<div className="chart-box"><DrawChart data={sqrmChartData} text={sqrChartTitle} /></div>
				</div>
			</React.Fragment>
		);
	}
}
export default CityChart;

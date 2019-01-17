import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class DrawChart extends Component {
	state = {
		width: 275,
		options: {
			responsive: true,
			title: {
				display: true,
				fontSize: 20,
			},
			layout: {
				padding: {
					left: 40,
					right: 40,
					top: 0,
					bottom: 50
				}
			},
			legend: {
				display: true,
				labels: {
					fontColor: '#000',
					fontSize: 13
				}
			},
			tooltips: {
				enabled: true,
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true,

			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Days',
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Average'
					},
				}]
			}
		}
	};
	render() {
		const { title } = this.state.options;
		const { text } = this.props;
		return (
			<div className="chart">
				<Line
					data={this.props.data}
					width={this.state.width}
					options={{
						...this.state.options,
						title: { ...title, title, text: text }
					}}
				/>
			</div>
		);
	}
}
export default DrawChart;

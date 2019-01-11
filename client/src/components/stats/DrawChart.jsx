import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class DrawChart extends Component {
	state = {
		options: {
			backgroundColor: 'red',
			title: {
				display: true,
				fontSize: 25
			},
			layout: {
				padding: {
					left: 50,
					right: 50,
					top: 0,
					bottom: 50
				}
			},
			legend: {
				display: true,
				labels: {
					fontColor: '#000'
				}
			},
			tooltips: {
				enabled: true
			}
		}
	};
	render() {
		const { title } = this.state.options;
		const { text } = this.props;
		return (
			<div className="container">
				<Line
					data={this.props.data}
					height={85}
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

import React, { Component } from 'react';
import Select from 'react-select';

class SelectList extends Component {
	state = {
		options: [],
		selectedOption: 'Athens-Center'
	};
	componentDidMount() {
		this.getCitiesName();
	}

	groupCitiesForSelect = (citiesList) => {
		const optionsObj = citiesList.map((option) => ({ value: option.city, label: option.city }));
		this.setState({
			options: [ ...optionsObj ]
		});
	};

	getCitiesName = () => {
		fetch(` http://localhost:3123/api/city-name`)
			.then((res) => res.json())
			.then((res) => this.groupCitiesForSelect(res))
			.catch((err) => console.log(err));
	};
	render() {
		return (
			<Select
				className="select-main"
				value={this.state.selectedOption}
				onChange={this.props.changeHandler}
				options={this.state.options}
				placeholder="Select City..."
			/>
		);
	}
}
export default SelectList;

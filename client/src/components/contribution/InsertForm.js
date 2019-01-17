import React from "react";
import { inject, observer } from "mobx-react";

const TYPES = ["json", "url", "file"];

@inject("PropertiesStore")
@observer
class InsertForm extends React.Component {
  state = {
    type: TYPES[0],
    fileData: []
  };

  valueField = React.createRef();

  insertJson = e => {
    e.preventDefault();
    if (this.state.type === "json") {
      const jsonFromText = {
        type: "json",
        json: this.valueField.current.value
      };
      this.props.PropertiesStore.createProperty(jsonFromText);
    } else if (this.state.type === "url") {
      const jsonFromUrl = { type: "url", url: this.valueField.current.value };
      this.props.PropertiesStore.createProperty(jsonFromUrl);
    } else if (this.state.type === "file") {
      this.props.PropertiesStore.createProperty(this.state.fileData);
    }
  };

  handleChange = e => {
    let file = e.target.files[0];
    let formData = new FormData();
    formData.append("type", "file");
    formData.append("selectedFile", file);

    this.setState((state, props) => ({ fileData: formData }));
  };

  render() {
    const { state } = this;
    const { PropertiesStore } = this.props;
    return (
      <div className="insert-form">
        {PropertiesStore.properties.insertStatus === "error" ? (
          <p className="error">{PropertiesStore.properties.errorMessage} <a href='www.google.com'>see our guide</a>.</p>
        ) : null}
        <form onSubmit={e => this.insertJson(e)}>
          {TYPES.map((type, i) => {
            return (
              <div
                key={i}
                className="custom-control custom-radio"
                onClick={() => {
                  this.setState({ type });
                }}
              >
                <input
                  type="radio"
                  name="customRadio"
                  className="custom-control-input"
                  checked={type === state.type}
                />
                <label className="custom-control-label" htmlFor="customRadio2">
                  {type}
                </label>
              </div>
            );
          })}
          {state.type === "file" && (
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                accept="application/JSON"
                onChange={e => this.handleChange(e)}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {/* TODO change the text to the file name after uploading the file */}
                {this.clicked ? this.file.name : 'Choose file'}
              </label>
            </div>
          )}
          {state.type === "url" && (
            <inpu
              type="url"
              className="form-control"
              placeholder="Enter api for JSON url"
              ref={this.valueField}
            />
          )}
          {state.type === "json" && (
            <textarea
              className="form-control"
              placeholder="insert JSON"
              ref={this.valueField}
            />
          )}
          <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-2">
              Insert
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default InsertForm;

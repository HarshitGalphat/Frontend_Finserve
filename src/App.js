import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");

  const dropdownOptions = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  const handleSubmit = async () => {
    try {
      setError("");
      setResponseData(null);

      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput || !Array.isArray(parsedInput.data)) {
        setError("Invalid JSON format. Expected format: { 'data': [...] }");
        return;
      }
      // console.log("Payload sent to backend:", parsedInput);
      const response = await axios.post("https://backend-finserve.onrender.com/bfhl", parsedInput);
      setResponseData(response.data);
    } catch (err) {
      setError("Error processing the request. Ensure the input format is correct.");
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const filteredResponse = {};
    selectedOptions.forEach((option) => {
      if (responseData[option.value]) {
        filteredResponse[option.label] = responseData[option.value];
      }
    });

    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>BFHL Frontend</h1>
      <textarea
        rows="8"
        cols="50"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON: e.g., { "data": ["A", "1", "b"] }'
        style={{ marginBottom: "20px", width: "100%" }}
      />
      <button onClick={handleSubmit} style={{ padding: "10px 20px", marginBottom: "20px" }}>
        Submit
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {responseData && (
        <div>
          <h2>Filter Response:</h2>
          <Select
            options={dropdownOptions}
            isMulti
            onChange={setSelectedOptions}
            placeholder="Select filters"
          />
          {renderResponse()}
        </div>
      )}
    </div>
  );
};

export default App;

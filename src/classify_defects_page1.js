import React, { useState } from 'react';
import './classify_defects_page1.css'; // Import the CSS file

function ClassifyDefectsPage1({ setCurrentPage }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    setDropdownOpen(false);

    if (option === "Device") {
      document.getElementById('fileInput').click();
    } else if (option === "Google Drive") {
      openGoogleDrivePicker();
    }
  };

  const openGoogleDrivePicker = () => {
    console.log("Opening Google Drive picker...");
    // Implement Google Drive picker logic here
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFileName(selectedFile.name);
    setFileToUpload(selectedFile);
  };

  const handleUploadButtonClick = async () => {
    if (fileToUpload) {
      console.log("Uploading file:", fileToUpload.name);
      try {
        const formData = new FormData();
        formData.append('file', fileToUpload);

        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        console.log("Upload response:", data);
        // Handle response data as needed (e.g., display result)

        // Clear file input and selected file name after successful upload
        document.getElementById('fileInput').value = '';
        setSelectedFileName(null);
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error (e.g., display error message to user)
      }
    } else {
      console.log("No file selected.");
    }
  };

  const handleBackToHomeClick = () => {
    setCurrentPage('homepage');
  };

  return (
    <div className="App">
      <header className="header">
        <div className="left">
          <p className="util">UTIL</p>
        </div>
        <div className="center">
          <p className="classifyDefects">Classify Defects</p>
        </div>
        <div className="right">
          <button className="homeButton" onClick={handleBackToHomeClick}>
            Back to Home
          </button>
        </div>
      </header>
      <main className="content">
        <p className="uploadText">Upload your excel file of defect report</p>
        <div className="dropdown">
          <button className="chooseFileButton" onClick={handleDropdownToggle}>
            Choose File
            {dropdownOpen ? (
              <span>&#9650;</span>
            ) : (
              <span>&#9660;</span>
            )}
          </button>
          <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileInputChange} />
          <div className="selectedFileName">{selectedFileName}</div>
          {dropdownOpen && (
            <div className="dropdownContent">
              <p className="option" onClick={() => handleOptionClick("Device")}>
                Choose file from device
              </p>
              <p className="option" onClick={() => handleOptionClick("Google Drive")}>
                Choose file from Google Drive
              </p>
            </div>
          )}
        </div>
        <button className="uploadButton" onClick={handleUploadButtonClick}>Upload</button>
      </main>
    </div>
  );
}

export default ClassifyDefectsPage1;

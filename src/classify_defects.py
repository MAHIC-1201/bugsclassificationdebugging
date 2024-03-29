from flask import Flask, request, jsonify
import pandas as pd
import joblib
import logging
import nltk
import re
from bs4 import BeautifulSoup

nltk.download('stopwords')
from nltk.corpus import stopwords

app = Flask(__name__)

# Load the ML model
model_cat1 = joblib.load('D:/TY-Sem/EDI/error/bugsclassificationdebugging/sgd_category1.pkl')  # Update with correct path
model_cat2 = joblib.load('D:/TY-Sem2/EDI/error/bugsclassificationdebugging/sgd_category2.pkl')  # Update with correct path

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    # If user does not select file, browser also submit an empty part without filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Read Excel file into a DataFrame
    try:
        df = pd.read_excel(file)

        # Clean text data
        df['Issue Summary'] = df['Issue Summary'].apply(clean_text)

        # Predict Category 1 using the first model
        predictions_cat1 = model_cat1.predict(df['Issue Summary'])

        # Predict Category 2 using the second model
        predictions_cat2 = model_cat2.predict(df['Issue Summary'])

        # Create DataFrame with predictions for both categories
        final_result = pd.DataFrame({'Issue Summary': df['Issue Summary'], 
                                     'Category1': predictions_cat1,
                                     'Category2': predictions_cat2})

        # Return the final result as JSON
        return final_result.to_json(orient='records')

    except Exception as e:
        return jsonify({'error': str(e)})

def clean_text(text):
    """
    Clean and preprocess text data.
    """
    REPLACE_BY_SPACE_RE = re.compile('[/(){}\\[\\]\\|@,;]')
    BAD_SYMBOLS_RE = re.compile('[^0-9a-z #+_]')
    STOPWORDS = set(stopwords.words('english'))

    text = BeautifulSoup(text, "lxml").text  # HTML decoding
    text = text.lower()  # lowercase text
    text = REPLACE_BY_SPACE_RE.sub(' ', text)  # replace REPLACE_BY_SPACE_RE symbols by space in text
    text = BAD_SYMBOLS_RE.sub('', text)  # delete symbols which are in BAD_SYMBOLS_RE from text
    text = ' '.join(word for word in text.split() if word not in STOPWORDS)  # delete stopwors from text
    return text

if __name__ == '__main__':
    app.run(debug=True)

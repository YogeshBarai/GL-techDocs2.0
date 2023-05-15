from flask import Flask, render_template, request, jsonify, Blueprint
import requests
from language_tool_python import LanguageTool

grammarCheckerBlueprint = Blueprint('GrammarChecker',__name__)
tool = LanguageTool('en-US')  # Create a LanguageTool instance

@grammarCheckerBlueprint.route('/check_grammar', methods=['POST'])
def check_grammar():
    text = request.form['text']

    # LanguageTool API endpoint for grammar checking
    api_url = 'https://languagetool.org/api/v2/check'

    # Parameters for the API request
    params = {
        'text': text,
        'language': 'en-US',  # Adjust language code as needed
    }

    # Send POST request to the LanguageTool API
    response = requests.post(api_url, params=params)

    # Extract grammar suggestions from the API response
    suggestions = response.json()

    return jsonify(suggestions)


@grammarCheckerBlueprint.route('/check_grammar_v2', methods=['POST'])
def check_grammar_v2():
    document = request.form['document']
    matches = tool.check(document)  # Perform grammar check using LanguageTool

    # Generate response with corrected suggestions
    response = {
        'matches': []
    }
    for match in matches:
        response['matches'].append({
            'message': match.message,
            'replacements': match.replacements,
            'offset': match.offset,
            'length': match.length
        })

    return jsonify(response)
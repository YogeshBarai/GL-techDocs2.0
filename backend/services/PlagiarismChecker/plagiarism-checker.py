from flask import Blueprint, current_app,jsonify, request
import difflib

plagiarismCheckerBlueprint = Blueprint('PlagiarismChecker',__name__)



@plagiarismCheckerBlueprint.route('/api/check_plagiarism', methods=['GET'])
def check_plagiarism():
    files = request.files.getlist('files[]')
    file_contents = []
    for file in files:
        content = file.read().decode('utf-8')
        file_contents.append(content)

    # Check plagiarism using difflib's SequenceMatcher
    similarity_threshold = 0.8  # Adjust Similarity threshold. Default set to 80% 
    result = []
    for i in range(len(file_contents) - 1):
        for j in range(i + 1, len(file_contents)):
            similarity_ratio = difflib.SequenceMatcher(None, file_contents[i], file_contents[j]).ratio()
            if similarity_ratio >= similarity_threshold:
                result.append((i, j))
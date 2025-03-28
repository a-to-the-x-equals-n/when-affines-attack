from flask import Flask, request, jsonify
from config import app, db
from pprint import pprint

VERBOSE = False


# app = Flask(__name__, static_url_path = '', static_folder = '../pages')

# @app.route('/')
# def index():
#     return app.send_static_file('index.html')

# @app.route('/<path:filename>')
# def serve_statics(filename):
#     return app.send_static_file(filename)


@app.route('/get_classmates', methods = ['GET'])
def get():
    '''
    Loads classmates from the DataMan JSON file.

    Returns:
    --------
    tuple[Response, int]
        - JSON response containing the list of classmates.
        - HTTP status code (`200 OK` if successful, `500 Internal Server Error` if failed).

    Notes:
    ------
    - Calls `db.load()` to retrieve classmate data.
    - If loading fails, returns an error message with status `500`.
    '''
    data = db.load()

    if VERBOSE:
        print('\n[--RETURNING--]') 
        # pprint(data)  # Debugging
        print()
    
    if data:
        return jsonify(data), 200                                # HTTP 200 OK
    return jsonify({"error": "Failed to load classmates."}), 500 # HTTP 500 Internal Server Error


@app.route('/save_classmates', methods = ['POST'])
def save():
    '''
    Saves classmates data to the JSON file.

    Returns:
    --------
    tuple[Response, int]
        - JSON response indicating success or failure
        - HTTP status code: 
          - `200 OK` if successful
          - `400 Bad Request` if input is invalid
          - `500 Internal Server Error` if save fails
    '''
    data = request.json
    
    if VERBOSE:
        print('\n[--RECEIVED--]')
        pprint(data)  # Debugging
        print()

    if data is None:
        return jsonify({"error": "Invalid request. Expected JSON data."}), 400   # HTTP 400 bad request
    if db.save(data):
        return jsonify({"message": "Classmates data saved successfully."}), 200  # HTTP 200 OK
    return jsonify({"error": "Failed to save classmates."}), 500                 # HTTP 500 internal server error


@app.route('/favicon.ico')
def favicon():
    # stupid python server keeps throwing errors because I don't have a 'favicon.ico'... 
    return '', 204  



if __name__ == '__main__':
    app.run(host = 'localhost', port = 8003, debug = True, threaded = False)

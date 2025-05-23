from flask import request, jsonify
from app.state import app, goose
import app.settings as settings
from app.util import heimdahl

@app.route('/upload', methods = ['POST'])
def upload():
    heimdahl('[UPLOAD ROUTE]', unveil = (settings.VB or settings.DEV), threat = 2)
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded'}), 400

    im = request.files['image']
    desc = request.form.get('description')

    try:
        id = goose.add_img(im, desc = desc)
        if id is None:
            heimdahl('[UPLOAD FAILED]', unveil = (settings.VB or settings.DEV), threat = 3)
            return jsonify({'error': 'Image upload failed'}), 500
        return jsonify({'message':'Image uploaded successfully', 'id': id}), 201
    
    except Exception as e:
        heimdahl(f'{e}', unveil = (settings.VB or settings.DEV), threat = 3)
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/images', methods = ['GET'])
def get_images():
    heimdahl('[GET IMAGES ROUTE]', unveil = (settings.VB or settings.DEV), threat = 2)
    images = goose.get_images()
    if not images:
        heimdahl('[IMAGES NOT FOUND]', unveil = (settings.VB or settings.DEV), threat = 2)
        return jsonify({'message': 'No images found'}), 200
    return jsonify({'images': images}), 200


@app.route('/vote', methods = ['POST'])
def handle_vote():
    heimdahl('[VOTE ROUTE]', unveil = (settings.VB or settings.DEV), threat = 2)
    
    try:
        data = request.get_json()
        if not data or 'imageId' not in data or 'vote' not in data:
            heimdahl('[VOTE ERROR] Missing Required Fields', unveil = (settings.VB or settings.DEV), threat = 3)
            return jsonify({'error': 'Missing required fields'}), 400
            
        image_id = data['imageId']
        vote_value = 1 if str(data['vote']).lower() in ('1', 'up', 'true') else -1
        
        success = goose.register_vote(image_id, vote_value)
        if not success:
            heimdahl('[VOTE ERROR] Vote Registration Failed', unveil = (settings.VB or settings.DEV), threat = 3)
            return jsonify({'error': 'Vote registration failed'}), 500
            
        # return updated counts
        counts = goose.get_votes(image_id)
        heimdahl('[VOTE ROUTE] Votes Returned', unveil = (settings.VB or settings.DEV), threat = 3)
        return jsonify({
            'message': 'Vote recorded',
            'upvotes': counts['upvotes'],
            'downvotes': counts['downvotes']
        }), 200
            
    except Exception as e:
        heimdahl(f'[VOTE ERROR] {e}', unveil=(settings.VB or settings.DEV), threat=3)
        return jsonify({'error': 'Internal server error'}), 500
    
@app.route('/favicon.ico')
def favicon():
    # stupid python server keeps throwing errors because I don't have a 'favicon.ico'... 
    return '', 204  

@app.route('/ping', methods = ['GET'])
def pong():
    heimdahl('[PONG]', (settings.VB or settings.DEV), threat = 2)
    return jsonify({'message': 'pong'}), 200

@app.route('/', methods = ['GET'])
def sanity():
    '''
    Basic health check route.
    '''
    heimdahl('[INSANITY CHECK]', (settings.VB or settings.DEV), threat = 2)
    return jsonify({
        'message': 'you\'re not insane...',
        'status': 'OK'
    }), 200


if __name__ == '__main__':
    from app.settings import IP, PORT
    from app import settings

    settings.VB = True
    settings.DEV = True

    app.run(host = IP, port = int(PORT), debug = (settings.VB or settings.DEV), threaded = False)
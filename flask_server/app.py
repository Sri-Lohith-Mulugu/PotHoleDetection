from flask import Flask, request, jsonify
from flask_cors import CORS
#from cnn import process_image_cn
#from ann import process_image_ann
from enhanced_cnn import process_image_enhanced_cnn
from ann import process_image_ann


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/predict', methods=['POST'])
def predict():
    # Check if an image is uploaded
    if 'image' not in request.files:
        return jsonify({'message': 'No image file part'}), 401

    image = request.files['image']
    if image.filename == '':
        return jsonify({'message': 'No selected file'}), 402

    # Validate the file type
    if image and image.content_type.startswith('image/'):
        # Get the selected model from the form data
        selected_Model = request.form.get('model')
        if not selected_Model:
            return jsonify({'message': 'No model selected'}), 403
        # Route to the correct processing function
        try:
            if selected_Model == "ANN":
                result = process_image_ann(image)
            elif selected_Model == "CNN":
                result = process_image_enhanced_cnn(image)
            else:
                print(selected_Model)
                return jsonify({'message': 'Invalid model selected'}), 409

            # Return the result from the processing function
            return jsonify({
                    'message': f"Processing successful. Model: {selected_Model}, Result: {result}",
                    'model': selected_Model,
                    'result': result

            }), 200

        except Exception as e:
            print(selected_Model)
            return jsonify({'message': 'Error processing the image', 'error': str(e)}), 500

    else:
        return jsonify({'message': 'Invalid file type. Please upload an image.'}), 405


if __name__ == "__main__":
    app.run(debug=True)

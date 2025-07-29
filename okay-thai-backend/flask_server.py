# flask_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import datetime
import os
import json # Import json module to parse the environment variable

app = Flask(__name__)
CORS(app) # Enable CORS for all origins (for development)

# --- Firebase Admin SDK Initialization ---
try:
    # IMPORTANT: Read credentials from environment variable, NOT directly from file.
    # This is secure for deployment.
    service_account_json_str = os.environ.get('FIREBASE_ADMIN_SDK_CONFIG')
    
    # For local testing without setting an env var, you can temporarily
    # uncomment the line below and comment out the os.environ.get line.
    # Make sure 'firebase-adminsdk.json' is in the same directory as this script.
    # with open('firebase-adminsdk.json', 'r') as f:
    #     service_account_json_str = f.read()

    if not service_account_json_str:
        raise ValueError("FIREBASE_ADMIN_SDK_CONFIG environment variable not set. Cannot initialize Firebase.")

    # Parse the JSON string into a dictionary
    service_account_info = json.loads(service_account_json_str)
    
    cred = credentials.Certificate(service_account_info) # Pass dictionary directly
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"ERROR: Firebase Admin SDK initialization failed! Details: {e}")
    print("Please ensure 'FIREBASE_ADMIN_SDK_CONFIG' environment variable is correctly set and is a valid JSON string.")
    print("For local testing, ensure 'firebase-adminsdk.json' exists in the same directory if you are using the file-based loading.")
    # In a real app, you might want to exit or handle this more gracefully
    exit(1)

@app.route('/leads', methods=['POST'])
def handle_leads():
    if not request.is_json:
        return jsonify({"message": "Request must be JSON"}), 400

    lead_data = request.get_json()

    print("\n------------------------------------")
    print("NEW LEAD RECEIVED FROM OKAY THAI BOT (Flask):")
    print("------------------------------------")
    for key, value in lead_data.items():
        print(f"{key}: {value}")
    print("------------------------------------")

    try:
        # Add a timestamp if not already present from frontend
        if 'timestamp' not in lead_data:
            lead_data['timestamp'] = datetime.datetime.now(datetime.timezone.utc).isoformat() + 'Z'

        doc_ref = db.collection('leads').add(lead_data)
        print(f"SUCCESS: Lead saved to Firestore with ID: {doc_ref[1].id}")
        return jsonify({"message": "Lead received and saved successfully!"}), 200
    except Exception as e:
        print(f"ERROR: Failed to save lead to Firestore. Details: {e}")
        return jsonify({"message": f"Failed to process lead due to server error: {e}"}), 500

if __name__ == '__main__':
    # Run the Flask app on http://localhost:3000
    app.run(host='0.0.0.0', port=3000, debug=True) # debug=True for development, set to False in production

from flask import Flask, render_template, request, flash, jsonify
from flask_cors import CORS
from page_replacement_simulator import fifo, lru, optimal

app = Flask(__name__)
app.secret_key = 'development-key'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/simulate', methods=['POST'])
def simulate():
    try:
        data = request.get_json()
        frames = int(data.get('frames', 0))
        pages = list(map(int, data.get('pages', '').split()))
        if frames <= 0:
            return jsonify({'error': 'Number of frames must be positive'}), 400
        if not pages:
            return jsonify({'error': 'Please enter at least one page number'}), 400

        results = {
            "FIFO": fifo(frames, pages),
            "LRU": lru(frames, pages),
            "Optimal": optimal(frames, pages)
        }
        return jsonify(results)
    except ValueError:
        return jsonify({'error': 'Invalid input - please enter numbers only'}), 400

if __name__ == '__main__':
    app.run(debug=True)

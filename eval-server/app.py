from flask import Flask, request, jsonify, json
from flask_cors import CORS
import sys
from io import StringIO
import contextlib

app = Flask(__name__)
cors = CORS(app)

@app.route('/run', methods=['GET'])
def run_code():
    code = request.args.get('code')
    task = json.loads(request.args.get('task'))
    if code == '' or code == '# Enter your code here.':
        return jsonify(output='', error_message='Skriv din kode i editoren.')

    test_code = code + '\n' + task["test"]
    
    with stdoutIO() as s:
        try:
            exec(test_code)
        except AssertionError as error:
            return jsonify(output=s.getvalue(), error_message=str(error))
        except SyntaxError as error:
            return jsonify(output=s.getvalue(), error_message=str(error))
        except IndentationError as error:
            return jsonify(output=s.getvalue(), error_message=str(error))
        except NameError as error:
            return jsonify(output=s.getvalue(), error_message=task["error_hint"])
        except TypeError as error:
            return jsonify(output=s.getvalue(), error_message=str(error))
    return jsonify(output=s.getvalue(), error_message='', solved=True)


@contextlib.contextmanager
def stdoutIO(stdout=None):
    old = sys.stdout
    if stdout is None:
        stdout = StringIO()
    sys.stdout = stdout
    yield stdout
    sys.stdout = old


@app.errorhandler(500)
def server_error(e):
    logging.exception('An error occurred during a request. %s', e)
    return "An internal error occured", 500


if __name__ == '__main__':
    app.run()
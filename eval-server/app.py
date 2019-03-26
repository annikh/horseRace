from flask import Flask, request
from flask_cors import CORS
import sys
from io import StringIO
import contextlib

app = Flask(__name__)
cors = CORS(app)

@app.route('/run', methods=['GET'])
def run_code():
    code = request.args.get('code')
    print("code: ", code)
    with stdoutIO() as s:
        exec(code)
    print("value: ", s.getvalue())
    return s.getvalue()

@app.route('/hei', methods=['GET'])
def run_hei():
    code = request.args.get('code')
    print("code: ", code)
    test_code = code + '\nassert hei("Anniken") == "Anniken", "Should be Anniken"'
    with stdoutIO() as s:
        try:
            exec(test_code)
        except AssertionError as error:
            return str(error)
        except SyntaxError as error:
            return str(error)
        except IndentationError as error:
            return str(error)
        except NameError as error:
            return "Har du husket å definere en funksjon som heter hei?"
        except TypeError as error:
            return str(error)
    return s.getvalue()


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
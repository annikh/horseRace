from flask import Flask, request, jsonify, json
from flask_cors import CORS
import sys
from io import StringIO
import contextlib
import logging

app = Flask(__name__)
cors = CORS(app)

@app.route('/run', methods=['GET'])
def run_code():
    code = request.args.get('code')
    task = json.loads(request.args.get('task'))
    default_code = task['default_code']
    
    output_requirement = ''
    if 'output_requirement' in task:
        output_requirement = task['output_requirement']

    if code == '' or code == default_code:
        return jsonify(output='', error_message='Velg en oppgave og skriv din kode i editoren.')

    code_with_tests = code + '\n' + task["test"]
    
    with stdoutIO() as s:
        try:
            exec(code_with_tests, {})
            if len(output_requirement) > 0 and output_requirement not in s.getvalue():
                return jsonify(output=s.getvalue(), error_message=task["error_hint"])
        except AssertionError as error:
            return jsonify(output=s.getvalue(), error_message=str(error))
        except IndentationError:
            return jsonify(output=s.getvalue(), error_message=str("Det ser ut til å være en feil med innrykkene dine"))
        except NameError:
            return jsonify(output=s.getvalue(), error_message=task["error_hint"])
        except TypeError:
            return jsonify(output=s.getvalue(), error_message=str("Kontrollér at du bruker riktige datatyper"))
        except SyntaxError:
            return jsonify(output=s.getvalue(), error_message=str("Noe er ikke helt som det skal med syntaxen"))
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
    app.run(host="0.0.0.0", port=int("5000"))
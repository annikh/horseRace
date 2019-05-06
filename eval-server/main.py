from flask import Flask, request, jsonify, json
from flask_cors import CORS
import sys
from io import StringIO
import contextlib
import logging
import time
import signal

app = Flask(__name__)
cors = CORS(app)


class Timeout():
    """Timeout class using ALARM signal."""
    class Timeout(Exception):
        pass
 
    def __init__(self, sec):
        self.sec = sec
 
    def __enter__(self):
        signal.signal(signal.SIGALRM, self.raise_timeout)
        signal.alarm(self.sec)
 
    def __exit__(self, *args):
        signal.alarm(0)    # disable alarm
 
    def raise_timeout(self, *args):
        raise Timeout.Timeout()


@app.route('/run', methods=['GET'])
def run_code():
    code = request.args.get('code')
    task = json.loads(request.args.get('task'))
    default_code = task['default_code']
    
    error_hints = []
    if 'error_hints' in task:
        error_hints = task['error_hints']
    while(len(error_hints) < 3):
        error_hints.append("")
    
    output_requirement = ""
    if 'output_requirement' in task:
        output_requirement = task['output_requirement']

    code_requirements = []
    if 'code_requirements' in task:
        code_requirements = task['code_requirements']

    code_with_tests = code + '\n' + task["test"]
    
    for code_requirement in code_requirements:
        if (code_requirement not in code):
            return jsonify(output='', error_message=error_hints[0])
    
    with stdoutIO() as s:
        try:
            with Timeout(3):
                exec(code_with_tests, {})
                if output_requirement not in s.getvalue():
                    return jsonify(output=s.getvalue(), error_message=error_hints[1])
        except Timeout.Timeout:
            return jsonify(output='', error_message="Woops, koden din tar lang tid å utføre. Kan det være du har laget en uendelig løkke?")
        except AssertionError as error:
            return jsonify(output=s.getvalue(), error_message=error_hints[2])
        except IndentationError:
            return jsonify(output=s.getvalue(), error_message="IdentationError: Det ser ut til å være en feil med innrykkene dine")
        except NameError as error:
            return jsonify(output=s.getvalue(), error_message=str(error))
        except TypeError as error:
            return jsonify(output=s.getvalue(), error_message=str(error))
        except SyntaxError as error:
            return jsonify(output=s.getvalue(), error_message=str(error))
        except IndexError as error:
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
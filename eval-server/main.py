import random
from flask import Flask, request
from flask_cors import CORS
import sys
from io import StringIO
import contextlib


app = Flask(__name__)
cors = CORS(app)

@app.route('/run')
def run_code():
    code = request.args.get('code')
    print("code: ", code)
    with stdoutIO() as s:
        exec(code)
    print("value: ", s.getvalue())
    return s.getvalue()


@contextlib.contextmanager
def stdoutIO(stdout=None):
    old = sys.stdout
    if stdout is None:
        stdout = StringIO()
    sys.stdout = stdout
    yield stdout
    sys.stdout = old


if __name__ == '__main__':
    app.run()
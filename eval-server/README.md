## Before you begin

If this is the first time you run the eval-server, you first need to install virtualenv.

### `pip3 install virtualenv`

To create a new virtual environment, named "env":

### `virtualenv env`


## Running the server

Activate the virtual environment

### `source env/bin/activate`

If this is the first time you run it, or there are new dependencies, install these. Note that we now use pip, not pip3.

### `pip install -r requirements.txt`

Now you can start the server

### `python app.py`

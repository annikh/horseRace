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

If you want to deactivate the virtual environment

### `deactivate`

## Deploying the server

### `gcloud auth application-default login`

### `gcloud config set project python-eval-239407`

### `gcloud init`

### `gcloud app deploy app.yaml`

Steps 1 and 3 are only needed the first time you deploy. 

To see error logs for deployed app
https://console.cloud.google.com/errors

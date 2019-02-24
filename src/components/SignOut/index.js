import React from 'react';
import { Button } from 'react-bootstrap';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <Button type="button" onClick={firebase.doSignOut}>
    Logg ut
  </Button>
);

export default withFirebase(SignOutButton);
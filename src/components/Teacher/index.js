import React from 'react';
import Navigation from '../Navigation';
import { withAuthentication } from '../Session';

const Teacher = () => (
  <Navigation/>
)

export default withAuthentication(Teacher);
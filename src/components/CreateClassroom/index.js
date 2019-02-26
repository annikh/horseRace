import React from 'react';
import { withAuthorization } from '../Session';

const CreateClassroom = () => (
    <div>
        <h1>Opprett et klasserom</h1>
        <p>The Home Page is accessible by every signed in user.</p>
    </div>
)

const condition = authUser => !!authUser;

export default withAuthorization(condition)(CreateClassroom);
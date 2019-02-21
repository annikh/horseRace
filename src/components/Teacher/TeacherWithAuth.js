import React from 'react';
import './Teacher.css';
import Teacher from './Teacher';

import { SignIn } from "aws-amplify-react";
import config from "../../aws-exports";
import { TeacherSignIn } from "./TeacherSignIn";
import { Authenticator } from "aws-amplify-react/dist/Auth";


const TeacherWithAuth = () => {
  return (
    <div className="TeacherSignIn">
      <Authenticator hide={[SignIn]} amplifyConfig={config}>
        <TeacherSignIn />
        <Teacher />
      </Authenticator>
    </div>
  );
}


export default TeacherWithAuth;
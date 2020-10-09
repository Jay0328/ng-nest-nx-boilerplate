import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class LoginMutation extends Mutation<any> {
  document = gql`
    mutation LoginMutation($email: string, $password: string) {
      login(email: $email, password: $password) {
        accessToken
        refreshToken
      }
    }
  `;
}

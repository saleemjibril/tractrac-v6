// lib/graphql.js
import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient('https://msps.tractrac.co/graphql');
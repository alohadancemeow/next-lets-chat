import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// const httpLink = new HttpLink({
//     uri: 'http:/localhost:4000/graphql',
//     credentials: 'include'
// })

export const client = new ApolloClient({
    uri: "http:/localhost:4000/graphql",
    cache: new InMemoryCache(),
});
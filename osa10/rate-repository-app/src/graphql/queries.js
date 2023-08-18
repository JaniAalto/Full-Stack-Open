import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query Query($orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, 
    $searchKeyword: String, $first: Int, $after: String) {
   repositories(orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword,
    first: $first, after: $after) {
      edges {
        node {
          description
          id
          language
          forksCount
          openIssuesCount
          ownerAvatarUrl
          stargazersCount
          url
          userHasReviewed
          watchersCount
          ratingAverage
          reviewCount
          fullName
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_REPOSITORY = gql`
  query getRepository($repositoryId: ID!, $first: Int, $after: String) {
    repository(id: $repositoryId) {
      description
      language
      forksCount
      openIssuesCount
      ownerAvatarUrl
      reviews(first: $first, after: $after) {
        edges {
          node {
            user {
              username
              id
            }
            text
            rating
            createdAt
            id
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
        }
      }
      stargazersCount
      url
      userHasReviewed
      watchersCount
      ratingAverage
      reviewCount
      fullName
    }
  }
`;

export const GET_USER = gql`
  query getUser($includeReviews: Boolean = false) {
    me {
      username
      id
      reviews @include(if: $includeReviews) {
        edges {
          node {
            rating
            repository {
              fullName
              id
            }
            createdAt
            text
            id
          }
        }
      }
    }
  }
`;
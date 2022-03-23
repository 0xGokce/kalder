import { gql } from "@apollo/client";

/**
 *
 * @param email string
 * @returns customer
 */

export const GET_CUSTOMER_BY_EMAIL = (email: string) => gql`
  query GET_CUSTOMER_BY_EMAIL {
    customer(where: { EMAIL: { _eq: ${email} } })
  }
`;

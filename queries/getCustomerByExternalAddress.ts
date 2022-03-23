import { gql } from "@apollo/client";

/**
 *
 * @param address PLEASE VERIFY ADDRESS BEFORE QUERYING
 * @returns customer
 */

export const GET_CUSTOMER_BY_EXTERNAL_ADDRESS = (address: string) => {
  return gql`
      query MyQuery {
        customer(where: { external_address: { _eq: ${address} } })
      }
    `;
};

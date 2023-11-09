import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import { CountryCode, Products } from "plaid";

const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:5173/";

export default {
  createLinkToken: async (request: Request, response: Response) => {
    //   Get the client_user_id by searching for the current user);
    const clientUserId = request.body.id;

    // Configuring plaid request
    const plaidRequest = {
      // client_id: process.env.PLAID_CLIENT_ID,
      // secret: process.env.PLAID_SECRET,
      user: {
        client_user_id: clientUserId,
      },
      client_name: "BudgetBuddy",
      products: [
        Products.Transactions,
        Products.Investments,
        Products.Liabilities,
      ],
      language: "en",
      redirect_uri: REDIRECT_URI,
      country_codes: [CountryCode.Us],
      link_customization_name: "Budget Buddy",
    };
    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(
        plaidRequest
      );
      response.status(200).json(createTokenResponse.data);
    } catch (error) {
      console.error(error);
      response.status(500).send("failure");
    }
  },
};

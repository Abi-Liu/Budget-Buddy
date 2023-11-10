import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import { CountryCode, Products } from "plaid";
import { createItem } from "../database/items";

const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:5173/";

export default {
  // start the link flow by sending client a public token.
  // They can then use that public token to request for an access token that will allow us to connect their accounts
  createLinkToken: async (request: Request, response: Response) => {
    //   Get the client_user_id by searching for the current user);
    const clientUserId = request.body.id;

    // Configuring plaid request
    const plaidRequest = {
      user: {
        client_user_id: clientUserId,
      },
      client_name: "BudgetBuddy",
      products: [Products.Transactions],
      language: "en",
      redirect_uri: REDIRECT_URI,
      country_codes: [CountryCode.Us],
    };
    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(
        plaidRequest
      );
      response.status(200).json(createTokenResponse.data);
    } catch (error) {
      console.error(error.response.data);
      response.status(500).send("failure");
    }
  },
  // Exchange token flow - exchange a Link public_token for
  // an API access_token
  setAccessToken: async (req: Request, res: Response) => {
    const { publicToken, institutionId, userId } = req.body;

    try {
      const tokenResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      // store these in a database
      const accessToken = tokenResponse.data.access_token;
      const itemId = tokenResponse.data.item_id;
      // db query
      await createItem(userId, accessToken, itemId, institutionId);
    } catch (error) {
      console.log(error.response.data);
      res.status(500).send("Exchange Failed");
    }
  },
};

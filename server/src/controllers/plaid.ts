import { Request, Response } from "express";
import { plaidClient } from "src/config/plaid";
import { CountryCode, Products } from "plaid";

const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:5173";

export default {
  createLinkToken: async (request: Request, response: Response) => {
    //   Get the client_user_id by searching for the current user);
    const clientUserId = request.body.id;
    console.log(clientUserId);
    const plaidRequest = {
      user: {
        client_user_id: clientUserId,
      },
      client_name: "BudgetBuddy",
      products: [
        Products.Transactions,
        Products.Balance,
        Products.Investments,
        Products.Liabilities,
        Products.CreditDetails,
        Products.RecurringTransactions,
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

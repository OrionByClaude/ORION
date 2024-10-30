import { Token, User, Action, ActionExample, HandlerCallback, IAgentRuntime, State, UUID } from "../core/types.ts";
import { log_to_file } from "../core/logger.ts";

export default {
  name: "MINT_TOKEN",
  description: "Mints a new token, representing an idea or value of the creator.",
  validate: async (runtime: IAgentRuntime, user: User, state: State) => {
    return !!runtime.getSetting("MINTING_API_KEY");
  },
  handler: async (
    runtime: IAgentRuntime,
    user: User,
    state: State,
    options: any,
    callback: HandlerCallback,
  ) => {
    const tokenName = options.tokenName || "SOUL_TOKEN";
    const userId = user.id;
    const creationTime = new Date().toISOString();

    // Create token metadata
    const newToken: Token = {
      id: `token_${Date.now()}`,
      name: tokenName,
      creator: userId as UUID,
      creationTime,
      metadata: {
        purpose: "Spiritual growth and exchange of value.",
      },
    };

    // Log the token creation event
    log_to_file(`token_minted_${userId}_${Date.now()}`, newToken);

    // Return callback with new token info
    callback({
      text: `New token ${tokenName} minted successfully.`,
      action: "TOKEN_MINTED",
      attachments: [{ id: newToken.id, description: "A token representing value in the chain of SOUL." }],
    });
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "I want to create a new token called SOUL_COIN." },
      },
      {
        user: "{{user2}}",
        content: { text: "Sure, let me mint that for you.", action: "MINT_TOKEN" },
      },
    ],
  ] as ActionExample[][],
} as Action;

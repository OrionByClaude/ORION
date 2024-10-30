import { Action, State, HandlerCallback, IAgentRuntime } from "../core/types.ts";
import { verifyBlockchain } from "../core/blockchain.ts";
import { log_to_file } from "../core/logger.ts";

export default {
  name: "VERIFY_CHAIN",
  description: "Verifies the integrity of the blockchain to ensure all transactions are valid.",
  validate: async (runtime: IAgentRuntime, message: any, state: State) => {
    return state.network === "SOUL_CHAIN";
  },
  handler: async (
    runtime: IAgentRuntime,
    message: any,
    state: State,
    options: any,
    callback: HandlerCallback,
  ) => {
    const isValid = await verifyBlockchain(state);

    log_to_file(`chain_verification_${Date.now()}`, { isValid });

    callback({
      text: isValid ? "Blockchain is valid." : "Blockchain verification failed!",
      action: "CHAIN_VERIFIED",
      attachments: [],
    });
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Verify the blockchain." },
      },
      {
        user: "{{user2}}",
        content: { text: "Verifying...", action: "VERIFY_CHAIN" },
      },
    ],
  ] as ActionExample[][],
} as Action;

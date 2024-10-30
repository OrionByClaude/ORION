import { Transaction, User, Action, HandlerCallback, IAgentRuntime, State, UUID } from "../core/types.ts";
import { log_to_file } from "../core/logger.ts";

export default {
  name: "TRANSACT_VALUE",
  description: "Initiates a transaction, representing an exchange of value within the SOUL chain.",
  validate: async (runtime: IAgentRuntime, sender: User, state: State) => {
    return !!state.balance && state.balance > 0;
  },
  handler: async (
    runtime: IAgentRuntime,
    sender: User,
    state: State,
    options: any,
    callback: HandlerCallback,
  ) => {
    const receiverId: UUID = options.receiverId;
    const amount: number = options.amount || 0;

    // Create a transaction record
    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      sender: sender.id as UUID,
      receiver: receiverId,
      amount,
      timestamp: new Date().toISOString(),
    };

    // Update state balance
    state.balance -= amount;

    // Log the transaction
    log_to_file(`transaction_${transaction.id}`, transaction);

    callback({
      text: `Transaction successful! ${amount} value transferred to ${receiverId}.`,
      action: "VALUE_TRANSACTED",
      attachments: [{ id: transaction.id, description: "A record of value exchange." }],
    });
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Send 10 SOUL_COIN to user_b." },
      },
      {
        user: "{{user2}}",
        content: { text: "Transaction in progress...", action: "TRANSACT_VALUE" },
      },
    ],
  ] as ActionExample[][],
} as Action;

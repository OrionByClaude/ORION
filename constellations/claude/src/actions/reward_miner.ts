import { User, Action, HandlerCallback, IAgentRuntime, State } from "../core/types.ts";
import { log_to_file } from "../core/logger.ts";

export default {
  name: "REWARD_MINER",
  description: "Rewards a miner for successfully mining a block on the SOUL_CHAIN.",
  validate: async (runtime: IAgentRuntime, miner: User, state: State) => {
    return miner.role === "MINER";
  },
  handler: async (
    runtime: IAgentRuntime,
    miner: User,
    state: State,
    options: any,
    callback: HandlerCallback,
  ) => {
    const rewardAmount = options.reward || 50;

    state.balance += rewardAmount;

    log_to_file(`reward_miner_${miner.id}_${Date.now()}`, { miner, rewardAmount });

    callback({
      text: `Miner ${miner.name} rewarded with ${rewardAmount} SOUL_COIN.`,
      action: "MINER_REWARDED",
      attachments: [],
    });
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Reward the miner for the last block." },
      },
      {
        user: "{{user2}}",
        content: { text: "Rewarding miner...", action: "REWARD_MINER" },
      },
    ],
  ] as ActionExample[][],
} as Action;

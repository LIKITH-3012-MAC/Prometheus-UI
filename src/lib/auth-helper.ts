export const checkUsageLimit = (session: any) => {
  if (!session) {
    // Guest User: Limited to 10 messages (Logic to be linked with Redis)
    return { isPro: false, limit: 10 };
  }
  // Registered Google User: Unlimited
  return { isPro: true, limit: Infinity };
};

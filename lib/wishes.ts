export const WISH_CATEGORIES = ["art", "music", "volunteer", "social", "food", "language"] as const;
export type WishCategory = (typeof WISH_CATEGORIES)[number];

import type { WeekOverWeekInsight } from "@/lib/services/transaction-service";

export function getWeekInsightMessage(insight: WeekOverWeekInsight): string {
  switch (insight.kind) {
    case "no-data":
      return "Chưa có giao dịch chi tiêu nào trong 2 tuần gần đây.";
    case "new-spending":
      return "Đây là tuần đầu tiên bạn có chi tiêu được ghi nhận.";
    case "change":
      return insight.direction === "down"
        ? `Bạn đã chi tiêu ít hơn ${insight.percent}% tuần này so với tuần trước.`
        : `Bạn đã chi tiêu nhiều hơn ${insight.percent}% tuần này so với tuần trước.`;
  }
}

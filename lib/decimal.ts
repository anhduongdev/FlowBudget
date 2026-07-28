import type { Decimal } from "@prisma/client/runtime/client";

export function decimalToNumber(value: Decimal | null | undefined): number {
  return value ? value.toNumber() : 0;
}

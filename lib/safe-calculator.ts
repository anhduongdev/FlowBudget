type Token =
  | { kind: "number"; value: number }
  | { kind: "operator"; value: "+" | "-" | "*" | "/" };

function tokenize(expression: string): Token[] | null {
  const tokens: Token[] = [];
  let cursor = 0;

  while (cursor < expression.length) {
    const char = expression[cursor];

    if (char === "+" || char === "-" || char === "*" || char === "/") {
      tokens.push({ kind: "operator", value: char });
      cursor += 1;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let numberText = "";
      while (cursor < expression.length && /[0-9.]/.test(expression[cursor])) {
        numberText += expression[cursor];
        cursor += 1;
      }
      const value = Number(numberText);
      if (Number.isNaN(value)) return null;
      tokens.push({ kind: "number", value });
      continue;
    }

    return null;
  }

  return tokens;
}

/**
 * Đánh giá biểu thức số học cơ bản (+ - * /) do người dùng nhập trên bàn
 * phím máy tính, theo đúng thứ tự ưu tiên nhân/chia trước cộng/trừ.
 * Không dùng eval/Function — chỉ parse thủ công các token số + toán tử.
 * Trả về null nếu biểu thức rỗng hoặc không hợp lệ (vd chia cho 0, hai
 * toán tử liền nhau, kết thúc bằng toán tử).
 */
export function evaluateArithmeticExpression(
  expression: string,
): number | null {
  const trimmed = expression.trim();
  if (trimmed === "") return null;

  const tokens = tokenize(trimmed);
  if (!tokens || tokens.length === 0) return null;
  if (tokens[0].kind === "operator") return null;
  if (tokens[tokens.length - 1].kind === "operator") return null;

  // Pass 1: resolve * and / left-to-right into a simplified +/- sequence.
  const simplified: Token[] = [tokens[0]];
  for (let i = 1; i < tokens.length; i += 2) {
    const operatorToken = tokens[i];
    const nextValueToken = tokens[i + 1];
    if (
      !operatorToken ||
      operatorToken.kind !== "operator" ||
      !nextValueToken ||
      nextValueToken.kind !== "number"
    ) {
      return null;
    }

    const previous = simplified[simplified.length - 1];
    if (previous.kind !== "number") return null;

    if (operatorToken.value === "*" || operatorToken.value === "/") {
      if (operatorToken.value === "/" && nextValueToken.value === 0) {
        return null;
      }
      const result =
        operatorToken.value === "*"
          ? previous.value * nextValueToken.value
          : previous.value / nextValueToken.value;
      simplified[simplified.length - 1] = { kind: "number", value: result };
    } else {
      simplified.push(operatorToken, nextValueToken);
    }
  }

  // Pass 2: resolve + and - left-to-right.
  let total = (simplified[0] as { kind: "number"; value: number }).value;
  for (let i = 1; i < simplified.length; i += 2) {
    const operatorToken = simplified[i];
    const valueToken = simplified[i + 1];
    if (
      !operatorToken ||
      operatorToken.kind !== "operator" ||
      !valueToken ||
      valueToken.kind !== "number"
    ) {
      return null;
    }
    total =
      operatorToken.value === "+"
        ? total + valueToken.value
        : total - valueToken.value;
  }

  return Number.isFinite(total) ? total : null;
}

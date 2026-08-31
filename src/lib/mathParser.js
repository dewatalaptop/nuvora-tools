// Hand-rolled recursive-descent parser/evaluator for the Scientific
// Calculator — deliberately not eval() (section 19 of the spec explicitly
// requires this). Supports + - * / ^, unary minus, parentheses, postfix
// factorial, sin/cos/tan/log/ln/sqrt, and the constants pi/e.

const FUNCTIONS = new Set(["sin", "cos", "tan", "log", "ln", "sqrt"]);
const CONSTANTS = { pi: Math.PI, e: Math.E };

function tokenize(input) {
  const tokens = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (/\s/.test(c)) {
      i++;
    } else if (/[0-9.]/.test(c)) {
      let n = "";
      while (i < input.length && /[0-9.]/.test(input[i])) n += input[i++];
      tokens.push({ type: "num", value: parseFloat(n) });
    } else if (/[a-zA-Z]/.test(c)) {
      let w = "";
      while (i < input.length && /[a-zA-Z]/.test(input[i])) w += input[i++];
      tokens.push({ type: "word", value: w });
    } else if ("+-*/^()!".includes(c)) {
      tokens.push({ type: "op", value: c });
      i++;
    } else {
      throw new Error(`Karakter tidak dikenal: ${c}`);
    }
  }
  return tokens;
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) throw new Error("Faktorial hanya untuk bilangan bulat non-negatif");
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

class Parser {
  constructor(tokens, angleMode) {
    this.tokens = tokens;
    this.pos = 0;
    this.angleMode = angleMode; // "deg" | "rad"
  }
  peek() {
    return this.tokens[this.pos];
  }
  next() {
    return this.tokens[this.pos++];
  }
  parse() {
    const result = this.expr();
    if (this.pos < this.tokens.length) throw new Error("Ekspresi tidak valid");
    return result;
  }
  expr() {
    let value = this.term();
    while (this.peek() && this.peek().type === "op" && (this.peek().value === "+" || this.peek().value === "-")) {
      const op = this.next().value;
      const rhs = this.term();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }
  term() {
    let value = this.power();
    while (this.peek() && this.peek().type === "op" && (this.peek().value === "*" || this.peek().value === "/")) {
      const op = this.next().value;
      const rhs = this.power();
      value = op === "*" ? value * rhs : value / rhs;
    }
    return value;
  }
  power() {
    const base = this.unary();
    if (this.peek() && this.peek().type === "op" && this.peek().value === "^") {
      this.next();
      const exp = this.power();
      return Math.pow(base, exp);
    }
    return base;
  }
  unary() {
    if (this.peek() && this.peek().type === "op" && this.peek().value === "-") {
      this.next();
      return -this.unary();
    }
    return this.postfix();
  }
  postfix() {
    let value = this.primary();
    while (this.peek() && this.peek().type === "op" && this.peek().value === "!") {
      this.next();
      value = factorial(value);
    }
    return value;
  }
  primary() {
    const t = this.peek();
    if (!t) throw new Error("Ekspresi tidak lengkap");
    if (t.type === "num") {
      this.next();
      return t.value;
    }
    if (t.type === "op" && t.value === "(") {
      this.next();
      const value = this.expr();
      if (!this.peek() || this.peek().value !== ")") throw new Error("Kurung tidak seimbang");
      this.next();
      return value;
    }
    if (t.type === "word") {
      this.next();
      const name = t.value.toLowerCase();
      if (name in CONSTANTS) return CONSTANTS[name];
      if (FUNCTIONS.has(name)) {
        if (!this.peek() || this.peek().value !== "(") throw new Error(`${name} butuh tanda kurung`);
        this.next();
        const arg = this.expr();
        if (!this.peek() || this.peek().value !== ")") throw new Error("Kurung tidak seimbang");
        this.next();
        return this.applyFunction(name, arg);
      }
      throw new Error(`Fungsi tidak dikenal: ${name}`);
    }
    throw new Error("Ekspresi tidak valid");
  }
  applyFunction(name, arg) {
    const toRad = (x) => (this.angleMode === "deg" ? (x * Math.PI) / 180 : x);
    switch (name) {
      case "sin": return Math.sin(toRad(arg));
      case "cos": return Math.cos(toRad(arg));
      case "tan": return Math.tan(toRad(arg));
      case "log": return Math.log10(arg);
      case "ln": return Math.log(arg);
      case "sqrt": return Math.sqrt(arg);
      default: throw new Error(`Fungsi tidak dikenal: ${name}`);
    }
  }
}

export function evaluateExpression(input, angleMode = "deg") {
  if (!input.trim()) throw new Error("Ekspresi kosong");
  const tokens = tokenize(input);
  const parser = new Parser(tokens, angleMode);
  const result = parser.parse();
  if (!Number.isFinite(result)) throw new Error("Hasil tidak terdefinisi");
  // Trig/log functions leave float noise (e.g. sin(30°) = 0.49999999999999994
  // instead of 0.5) — round to 12 significant digits to hide it without
  // losing real precision for large or very small results.
  return Number(result.toPrecision(12));
}

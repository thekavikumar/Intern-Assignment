// ruleHelper.js

class ASTNode {
  constructor(type, left = null, right = null, value = null) {
    this.type = type; // 'operator' or 'operand'
    this.left = left;
    this.right = right;
    this.value = value; // Used for 'operand' nodes
  }
}

// Helper function to tokenize the rule string
function tokenizeRuleString(rule_string) {
  return rule_string
    .replace(/\(/g, ' ( ') // Add space around parentheses
    .replace(/\)/g, ' ) ')
    .split(/\s+/) // Split by spaces
    .filter((token) => token.length > 0); // Remove empty tokens
}

// Helper function to parse a comparison expression (e.g., age > 30)
function parseOperand(tokens) {
  const field = tokens.shift(); // Get the field (e.g., age)
  const operator = tokens.shift(); // Get the operator (e.g., >, <, =)
  const value = tokens.shift(); // Get the value (e.g., 30, 'Sales')

  return new ASTNode('operand', null, null, {
    field,
    operator,
    value: isNaN(value) ? value.replace(/['"]/g, '') : Number(value), // Handle both numbers and strings
  });
}

// Recursive function to build AST from tokens
function parseTokens(tokens) {
  let node = null;
  let operator = null;

  while (tokens.length > 0) {
    const token = tokens.shift();

    if (token === '(') {
      const subtree = parseTokens(tokens);
      if (!node) {
        node = subtree;
      } else {
        node.right = subtree;
      }
    } else if (token === ')') {
      return node;
    } else if (token === 'AND' || token === 'OR') {
      operator = token;
      const newNode = new ASTNode('operator', node, null, operator);
      node = newNode;
    } else {
      const operand = parseOperand([token, tokens.shift(), tokens.shift()]);
      if (!node) {
        node = operand;
      } else {
        node.right = operand;
      }
    }
  }
  return node;
}

// Parse rule string into an AST
function parseRuleToAST(rule_string) {
  const tokens = tokenizeRuleString(rule_string); // Tokenize the input string
  return parseTokens(tokens); // Recursively build the AST from tokens
}

// Evaluate a single operand (comparison operation)
function evaluateOperand(operand, userData) {
  const { field, operator, value } = operand.value;
  const userValue = userData[field];

  switch (operator) {
    case '>':
      return userValue > value;
    case '<':
      return userValue < value;
    case '=':
      return userValue == value; // Can handle both string and number comparison
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

// Recursive function to evaluate the AST
function evaluateAST(node, userData) {
  if (node.type === 'operand') {
    return evaluateOperand(node, userData);
  } else if (node.type === 'operator') {
    const leftResult = evaluateAST(node.left, userData);
    const rightResult = evaluateAST(node.right, userData);

    if (node.value === 'AND') {
      return leftResult && rightResult;
    } else if (node.value === 'OR') {
      return leftResult || rightResult;
    } else {
      throw new Error(`Unknown operator: ${node.value}`);
    }
  }
}

function countOperators(node, operatorCount) {
  if (!node) return;
  if (node.type === 'operator') {
    operatorCount[node.value] = (operatorCount[node.value] || 0) + 1;
    countOperators(node.left, operatorCount);
    countOperators(node.right, operatorCount);
  }
}

// Function to determine the most frequent operator (AND/OR)
function getMostFrequentOperator(rulesASTs) {
  const operatorCount = { AND: 0, OR: 0 };

  rulesASTs.forEach((ast) => countOperators(ast, operatorCount));

  // Return the operator with the highest count
  return operatorCount.AND >= operatorCount.OR ? 'AND' : 'OR';
}

// Function to combine two ASTs with the given operator
function combineTwoASTs(ast1, ast2, operator) {
  if (!ast1) return ast2;
  if (!ast2) return ast1;

  // Create a new root node with the operator
  return new ASTNode('operator', ast1, ast2, operator);
}

// Main function to combine multiple rule strings into a single AST
function combine_rules(ruleStrings) {
  const rulesASTs = ruleStrings.map((rule) => parseRuleToAST(rule));

  // Get the most frequent operator from all rules
  const frequentOperator = getMostFrequentOperator(rulesASTs);

  // Combine the ASTs into one, minimizing redundancy
  let combinedAST = null;
  rulesASTs.forEach((ast) => {
    combinedAST = combineTwoASTs(combinedAST, ast, frequentOperator);
  });

  return combinedAST; // Return the root node of the combined AST
}

module.exports = {
  parseRuleToAST,
  evaluateAST,
  combine_rules,
};

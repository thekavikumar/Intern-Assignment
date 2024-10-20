const express = require('express');
const Rule = require('../models/ruleModel'); // Mongoose model for rules
const router = express.Router();

// Helper functions for parsing and evaluating rules
const {
  parseRuleToAST,
  evaluateAST,
  combine_rules,
} = require('../helper/ruleHelper');

// POST: /create_rule - Create a rule
router.post('/create_rule', async (req, res) => {
  const { rule_string, name } = req.body;

  try {
    // Parse the rule into an AST
    const ast = parseRuleToAST(rule_string);
    if (!ast) {
      return res.status(400).json({ error: 'Invalid rule format' });
    }
    console.log(ast);
    // Create and save the rule in the database
    const newRule = new Rule({ name, ast });
    await newRule.save();

    // Return the created rule
    res.status(201).json(newRule);
  } catch (error) {
    res.status(400).json({ error: 'Invalid saving issue' });
  }
});

// POST: /combine_rules - Combine multiple rules into a single rule
router.post('/combine_rules', async (req, res) => {
  const { rule_strings, name } = req.body;

  try {
    const combinedAST = combine_rules(rule_strings);

    // Create and save the combined rule in the database
    const newRule = new Rule({ name, ast: combinedAST });
    await newRule.save();

    // Return the created rule
    res.status(201).json(newRule);
  } catch (error) {
    res.status(400).json({ error: 'Error combining rules' });
  }
});

// POST: /evaluate_rule - Evaluate the rule against user data
router.post('/evaluate_rule', async (req, res) => {
  const { ruleId, userData } = req.body;

  try {
    // Find the rule by ID
    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    // Evaluate the AST of the rule with the given user data
    const result = evaluateAST(rule.ast, userData);

    // Return the evaluation result (true/false)
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Error evaluating the rule' });
  }
});

module.exports = router;

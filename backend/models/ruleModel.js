const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for storing the rule and AST in MongoDB
const ruleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ast: {
      type: Schema.Types.Mixed, // Allows storing the AST as an object
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rule', ruleSchema);

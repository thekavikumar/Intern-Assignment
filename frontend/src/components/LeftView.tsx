'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from './ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Input } from './ui/input';

function validateRuleString(ruleString: string) {
  const operatorRegex = /[=><!]/; // Ensure the rule contains a comparison operator
  const comparisonRegex = /\b\d+\b/; // Ensure it has at least one number (for comparison)
  const allowedCharactersRegex = /^[a-zA-Z0-9\s=><!()'"]+$/; // Allowed characters

  console.log('Validating rule string:', ruleString);

  // Check if the rule is empty or contains only whitespace
  if (!ruleString.trim()) {
    throw new Error('Rule cannot be empty.');
  }

  // Check for allowed characters
  if (!allowedCharactersRegex.test(ruleString)) {
    throw new Error(
      'Rule contains invalid characters. Allowed: letters, numbers, spaces, =, >, <, !, (, and ).'
    );
  }

  // Check for comparison operator
  if (!operatorRegex.test(ruleString)) {
    throw new Error(
      'Rule must contain a comparison operator (e.g., =, >, <, !=).'
    );
  }

  // Check for valid comparison value
  if (!comparisonRegex.test(ruleString)) {
    throw new Error(
      'Rule must contain a valid comparison value (e.g., a number).'
    );
  }

  // Check for matching parentheses if you allow nested expressions
  const openBrackets = (ruleString.match(/\(/g) || []).length;
  const closeBrackets = (ruleString.match(/\)/g) || []).length;
  if (openBrackets !== closeBrackets) {
    throw new Error('Mismatched parentheses in the rule.');
  }
}

const CreateRuleFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters.',
  }),
  rule: z.string().min(3, {
    message: 'Rule must be at least 3 characters.',
  }),
});

const CombineRuleFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters.',
  }),
  combine_rules: z.string().min(10, {
    message: 'Rules must be at least 10 characters.',
  }),
});

const evaluateRuleFormSchema = z.object({
  age: z.string().min(0, {
    message: 'Age must be at least 0.',
  }),
  department: z.string().min(3, {
    message: 'Department must be at least 3 characters.',
  }),
  salary: z.string().min(0, {
    message: 'Salary must be at least 0.',
  }),
  experience: z.string().min(0, {
    message: 'Experience must be at least 0.',
  }),
  evaluate_rule: z.string().min(10, {
    message: 'Rules must be at least 10 characters.',
  }),
});

export function LeftView({
  setResponse,
}: {
  setResponse: (response: string) => void;
}) {
  const createRuleForm = useForm<z.infer<typeof CreateRuleFormSchema>>({
    resolver: zodResolver(CreateRuleFormSchema),
  });

  async function createRuleOnSubmit(
    data: z.infer<typeof CreateRuleFormSchema>
  ) {
    try {
      // Send POST request to Next.js API route

      // Validate the rule string
      validateRuleString(data.rule);

      const response = await fetch('/api/create_rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name, // Assuming 'name' is a field in your form
          rule_string: data.rule, // Assuming 'rule_string' is a field in your form
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create rule');
      }

      const responseData = await response
        .json()
        .then((data) => JSON.stringify(data, null, 2))
        .then((data) => JSON.parse(data));
      // console.log(responseData);
      // const parsedResponse = JSON.parse(responseData);
      // console.log(parsedResponse);
      // Update response in the right panel of the UI
      setResponse(responseData);
    } catch (err) {
      // Handle errors
      toast({
        title: 'Error',
        description: String(err),
        variant: 'destructive',
      });
    }
  }

  const combineRuleform = useForm<z.infer<typeof CombineRuleFormSchema>>({
    resolver: zodResolver(CombineRuleFormSchema),
  });

  async function combineRuleOnSubmit(
    data: z.infer<typeof CombineRuleFormSchema>
  ) {
    try {
      // Send POST request to Next.js API route

      const rules = data.combine_rules.split('\n').map((rule) => rule.trim());
      // remove empty strings
      const filteredRules = rules.filter((rule) => rule !== '');
      console.log(filteredRules);

      const response = await fetch('/api/combine_rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name, // Assuming 'name' is a field in your form
          rule_strings: filteredRules, // Assuming 'rule_string' is a field in your form
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create rule');
      }

      const responseData = await response
        .json()
        .then((data) => JSON.stringify(data, null, 2))
        .then((data) => JSON.parse(data));
      // console.log(responseData);
      // const parsedResponse = JSON.parse(responseData);
      // console.log(parsedResponse);
      // Update response in the right panel of the UI
      setResponse(responseData);
    } catch {
      // Handle errors
      toast({
        title: 'Error',
        description: 'There was an issue creating the rule. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const evaluateRuleform = useForm<z.infer<typeof evaluateRuleFormSchema>>({
    resolver: zodResolver(evaluateRuleFormSchema),
  });

  async function evaluateRuleOnSubmit(
    data: z.infer<typeof evaluateRuleFormSchema>
  ) {
    // console.log(data);
    const { evaluate_rule, ...rest } = data;

    const formattedData = {
      ...rest,
      age: Number(data.age),
      salary: Number(data.salary),
      experience: Number(data.experience),
    };

    console.log(formattedData);
    try {
      const response = await fetch('/api/evaluate_rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: formattedData,
          rule_string: data.evaluate_rule,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create rule');
      }

      const responseData = await response
        .json()
        .then((data) => JSON.stringify(data, null, 2))
        .then((data) => JSON.parse(data));
      // console.log(responseData);
      // const parsedResponse = JSON.parse(responseData);
      // console.log(parsedResponse);
      // Update response in the right panel of the UI
      setResponse(responseData);
    } catch (error) {
      // Handle errors
      toast({
        title: 'Error',
        description: String(error),
        variant: 'destructive',
      });
    }
  }

  return (
    <Tabs defaultValue="create_rule" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="create_rule">Create Rule</TabsTrigger>
        <TabsTrigger value="combine_rules">Combine Rules</TabsTrigger>
        <TabsTrigger value="evaluate_rule">Evaluate Rule</TabsTrigger>
      </TabsList>
      <TabsContent value="create_rule">
        <Form {...createRuleForm}>
          <form
            onSubmit={createRuleForm.handleSubmit(createRuleOnSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={createRuleForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type name for the rule" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createRuleForm.control}
              name="rule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule String</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type a rule here..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Type a rule in the text area above.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create Rule</Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="combine_rules">
        <Form {...combineRuleform}>
          <form
            onSubmit={combineRuleform.handleSubmit(combineRuleOnSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={combineRuleform.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type name for the rule" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={combineRuleform.control}
              name="combine_rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Combine Rules</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type rules here..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Type rules with each rule separated by a new line.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="evaluate_rule">
        <Form {...evaluateRuleform}>
          <form
            onSubmit={evaluateRuleform.handleSubmit(evaluateRuleOnSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={evaluateRuleform.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Type user's age"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={evaluateRuleform.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Type user's department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={evaluateRuleform.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Type user's salary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={evaluateRuleform.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Type user's experience"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={evaluateRuleform.control}
              name="evaluate_rule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluate Rule</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type AST here..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Type AST in the text area above.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}

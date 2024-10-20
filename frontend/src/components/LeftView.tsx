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

const CreateRuleFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters.',
  }),
  rule: z.string().min(10, {
    message: 'Rule must be at least 10 characters.',
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
    } catch {
      // Handle errors
      toast({
        title: 'Error',
        description: 'There was an issue creating the rule. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const combineRuleform = useForm<z.infer<typeof CombineRuleFormSchema>>({
    resolver: zodResolver(CombineRuleFormSchema),
  });

  function combineRuleOnSubmit(data: z.infer<typeof CombineRuleFormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const evaluateRuleform = useForm<z.infer<typeof evaluateRuleFormSchema>>({
    resolver: zodResolver(evaluateRuleFormSchema),
  });

  function evaluateRuleOnSubmit(data: z.infer<typeof evaluateRuleFormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
              name="evaluate_rule"
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
    </Tabs>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReadContract, useWriteContract } from "wagmi";
import ProposalJSON from "../../../../../abis/Proposal.json";
import ApplicationSubmission from "../../../../../abis/ApplicationSubmission.json";
import { usePathname } from "next/navigation";
import { Address } from "viem";
import { CodeBlock } from "react-code-blocks";
import { useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  salary: z.number(),
});

export default function Bid() {
  const path = usePathname();
  const proposalAddress = path.split("/")[2];

  const { data: timestamp } = useReadContract({
    address: proposalAddress as Address,
    abi: ProposalJSON.abi,
    functionName: "submission_phase_end_timestamp",
    args: [],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "John Smith",
      salary: 25,
      description: "I am a great worker",
    },
  });
  const [encryptedMessage, setEncryptedMessage] = useState<string | null>(null);

  //const { id } = router.query;
  const { writeContract } = useWriteContract();

  const { data: submissionAddress } = useReadContract({
    functionName: "applicationSubmissionAddress",
    args: [],
    abi: ProposalJSON.abi,
    address: proposalAddress as Address,
  });

  async function onSubmit(values: {
    name: string;
    salary: number;
    description: string;
  }) {
    const { salary } = values;
    const result = await fetch("http://localhost:3000/api/nano", {
      method: "POST",
      body: JSON.stringify({ salary, timestamp: timestamp?.toString() }),
    });
    const { body: encryptedBudget } = JSON.parse(await result.json());

    writeContract(
      {
        abi: ApplicationSubmission.abi,
        address: submissionAddress as Address,
        functionName: "submitApplication",
        args: [encryptedBudget, values.description],
      },
      {
        onSuccess: () => {
          toast("Your application has been submitted");
          setEncryptedMessage(encryptedBudget);
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to submit application");
        },
      }
    );
  }

  return (
    <>
      <Separator
        orientation="vertical"
        className="h-[1px] bg-[#000] w-100 my-2"
      />
      <Breadcrumb className="my-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/proposal/${proposalAddress}`}>
              {proposalAddress}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`#`}>Bid</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator
        orientation="vertical"
        className="h-[1px] bg-[#000] w-100 my-2"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="w-[200px]" {...field} />
                </FormControl>
                <FormDescription>Your name goes here</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input type="number" className="w-[200px]" {...field} />
                </FormControl>
                <FormDescription>This is my salary per hour</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea className="w-[400px]" {...field} />
                </FormControl>
                <FormDescription>This is my description.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Input
            type="submit"
            className="bg-secondary text-white inline-block w-auto"
            value={"Send an offer"}
          />
        </form>
        <div className="my-5 ">
          {encryptedMessage && (
            <>
              <h2 text-xl>Encrypted salary: </h2>
              <CodeBlock
                text={encryptedMessage}
                language="json"
                showLineNumbers={false}
              />
            </>
          )}
        </div>
      </Form>
    </>
  );
}

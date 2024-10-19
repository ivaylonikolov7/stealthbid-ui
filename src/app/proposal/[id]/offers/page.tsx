"use client";
import { usePathname } from "next/navigation";
import { useReadContract, useWriteContract } from "wagmi";
import ApplicationSubmission from "../../../../../abis/ApplicationSubmission.json";
import Proposal from "../../../../../abis/Proposal.json";
import { Address } from "viem";
import { Addreth } from "addreth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Application = {
  applicant_description: string;
  budget: string;
  isAccepted: boolean;
  applicant: string;
  votes: string;
};

export default function Offers() {
  const path = usePathname();
  const proposalAddress = path.split("/")[2];

  const { data: submissionddress } = useReadContract({
    functionName: "applicationSubmissionAddress",
    args: [],
    abi: Proposal.abi,
    address: proposalAddress as Address,
  });

  const { writeContract } = useWriteContract();

  const { data: applications } = useReadContract({
    functionName: "getApplications",
    args: [],
    abi: ApplicationSubmission.abi,
    address: submissionddress as Address,
  });

  console.log({ applications });
  // console.log({ submissionddress, applications });
  return (
    <div className="p-3">
      <h1 className="text-3xl">Offers</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Submitter</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead>Vote</TableHead>
          </TableRow>
        </TableHeader>
        {Array.isArray(applications) &&
          applications?.map(
            ({
              applicant_description,
              budget,
              isAccepted,
              applicant,
              votes,
            }: Application) => {
              return (
                <TableRow key={applicant}>
                  <TableCell>
                    <Addreth address={applicant as Address} />
                  </TableCell>
                  <TableCell>
                    <p>{applicant_description}</p>
                  </TableCell>
                  <TableCell>
                    <p>{budget.toString() || "No budget set"}</p>
                  </TableCell>
                  <TableCell>
                    <p>{isAccepted ? "Accepted" : "Not accepted"}</p>
                  </TableCell>
                  <TableCell>
                    <p>Votes - {votes || 0}</p>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="text-white"
                      onClick={() => {
                        writeContract(
                          {
                            address: proposalAddress as Address,
                            abi: Proposal.abi,
                            functionName: "vote",
                            args: [applicant, 1],
                          },
                          {
                            onSuccess: () => {
                              toast("Voted");
                            },
                            onError: (error) => {
                              toast.error("Error voting");
                              console.error(error);
                            },
                          }
                        );
                      }}
                    >
                      Vote
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }
          )}
      </Table>
    </div>
  );
}

import { Address } from "viem";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Addreth } from "addreth";
import ProposalJSON from "../../abis/Proposal.json";
import ApplicationSubmission from "../../abis/ApplicationSubmission.json";
import { useReadContract } from "wagmi";
import Link from "next/link";

export const Offers = ({ proposal }: { proposal: string }) => {
  const { data: submissionAddress } = useReadContract({
    functionName: "applicationSubmissionAddress",
    args: [],
    abi: ProposalJSON.abi,
    address: proposal as Address,
  });

  const { data: applications } = useReadContract({
    functionName: "getApplications",
    args: [],
    abi: ApplicationSubmission.abi,
    address: submissionAddress as Address,
  });

  if (!submissionAddress || !applications) {
    return <></>;
  }

  return (
    <Table>
      <TableCaption>
        <Link href={`/proposal/${proposal}/offers`}>
          A list of recent offers.
        </Link>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Submitter</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Votes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(applications) &&
          applications?.map(
            (application: {
              applicant: string;
              applicant_description: string;
              votes: bigint;
            }) => {
              const { applicant, applicant_description, votes } = application;

              return (
                <TableRow key={1}>
                  <TableCell>
                    <Addreth address={applicant as Address} />
                  </TableCell>
                  <TableCell>{applicant_description}</TableCell>
                  <TableCell>{votes.toString() || "0"}</TableCell>
                </TableRow>
              );
            }
          )}
      </TableBody>
    </Table>
  );
};

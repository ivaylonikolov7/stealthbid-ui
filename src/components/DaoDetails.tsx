import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";

import { useReadContract } from "wagmi";
import { Address } from "viem";
import ProposalJSON from "../../abis/Proposal.json";

export const DaoDetails = ({ dao }: { dao: string }) => {
  console.log(dao);
  const result = useReadContract({
    functionName: "getProposalDetails",
    args: [],
    abi: ProposalJSON.abi,
    address: dao as Address,
  });

  if (!result.data || !Array.isArray(result.data)) {
    return <></>;
  }

  console.log(result.data);
  const [description, author, , timestamp, executed] = result.data;

  let timestampString;
  if (typeof timestamp == "bigint") {
    timestampString = new Date(Number(timestamp) * 1000).toDateString();
  }

  console.log(timestampString);

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link href={`proposal/${dao}/`}>{description}</Link>
      </TableCell>
      <TableCell>{author.toString()}</TableCell>
      <TableCell>{timestampString?.toString() || "No date set"}</TableCell>
      <TableCell>{executed ? "✅ " : "❌"}</TableCell>
    </TableRow>
  );
};

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Progress } from "./ui/progress";
import { Offers } from "./Offers";
import { useReadContract } from "wagmi";
import ProposalJSON from "../../abis/Proposal.json";
import { Address } from "viem";

export const ProposalDao = ({ address }: { address: string }) => {
  const {
    data,
  }: {
    data: [string, string, string, string] | undefined;
  } = useReadContract({
    functionName: "getProposalDetails",
    args: [],
    abi: ProposalJSON.abi,
    address: address as Address,
  });

  if (!data && !Array.isArray(data)) {
    return <>Loading</>;
  }

  const [details, creator, budget, submission_phase_end_timestamp] = data;

  const humanReadableDate = new Date(
    Number(submission_phase_end_timestamp) * 1000
  ).toDateString();

  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Proposal Details</AccordionTrigger>
          <AccordionContent>{details}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Creator</AccordionTrigger>
          <AccordionContent>{creator}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Budget</AccordionTrigger>
          <AccordionContent>
            {budget.toString() + " 💲 per hour" || "Budget not revealed yet"}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Proposal Timeline</AccordionTrigger>
          <AccordionContent>
            {humanReadableDate}
            {<Progress value={90} />}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Offers sent</AccordionTrigger>
          <AccordionContent>
            <Offers proposal={address} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex">
        <div className="fancy">
          <Link
            href={`/proposal/${address}/unlock`}
            className="text-white pointer"
            id="offer"
          >
            🔓 Unlock
          </Link>
        </div>

        <div className="fancy">
          <Link
            href={`/proposal/${address}/bid`}
            className="text-white pointer"
            id="offer"
          >
            Send an offer
          </Link>
        </div>
      </div>
    </>
  );
};

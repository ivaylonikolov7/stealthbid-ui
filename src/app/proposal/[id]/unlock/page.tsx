"use client";
import { useReadContract, useWriteContract } from "wagmi";
import ProposalJSON from "../../../../../abis/Proposal.json";

import { Address, stringToHex } from "viem";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function Unlock() {
  const { writeContract } = useWriteContract();
  const [source, setSource] = useState();
  const path = usePathname();

  const subscriptionId = 3668;
  const gasLimit = 300_000;
  const donID = stringToHex("fun-ethereum-sepolia-1", { size: 32 });
  const proposalAddress = path.split("/")[2];

  const { data: lastResponse } = useReadContract({
    address: proposalAddress as Address,
    abi: ProposalJSON.abi,
    functionName: "s_lastResponse",
    args: [],
  });

  const { data: s_lastResponse } = useReadContract({
    address: proposalAddress as Address,
    abi: ProposalJSON.abi,
    functionName: "s_lastResponse",
    args: [],
  });

  if (typeof lastResponse === "string") {
    console.log(decodeResult(lastResponse));
  }

  useEffect(() => {
    async function getResult() {
      const data = await fetch("http://localhost:3000/api/source");
      const sourceResult = await data.json();
      setSource(sourceResult);
    }
    void getResult();
  }, []);

  return (
    <>
      {console.log(s_lastResponse)};
      <div className="text-center my-2">
        {s_lastResponse == "0x" ? (
          <Button
            className="text-white"
            onClick={() => {
              writeContract(
                {
                  functionName: "startRevealOfBudgets",
                  address: proposalAddress as Address,
                  args: [source, subscriptionId, gasLimit, donID],
                  abi: ProposalJSON.abi,
                },
                {
                  onError: (err) => {
                    toast.error("Error, pls fix!");
                    console.error(err);
                  },
                  onSuccess: () => {
                    toast.success("Reveal Budgets started");
                  },
                }
              );
            }}
          >
            Reveal Budgets
          </Button>
        ) : (
          <>
            <Button
              className="text-white"
              onClick={() => {
                writeContract(
                  {
                    functionName: "setBudgets",
                    address: proposalAddress as Address,
                    args: [[25, 25]],
                    abi: ProposalJSON.abi,
                  },
                  {
                    onSuccess: () => {
                      toast("Budgets set successfully");
                    },
                    onError: (err) => {
                      console.error(err);
                      toast.error("Error, pls fix!");
                    },
                  }
                );
              }}
            >
              Set Budgets
            </Button>
            <Link
              className="block underline text-xs"
              href={`/proposal/${proposalAddress}`}
            >
              Go back
            </Link>
          </>
        )}
      </div>
    </>
  );
}

function decodeResult(hexString: string) {
  hexString = hexString.slice(2);
  let decodedString = "";
  for (let i = 0; i < hexString.length; i += 2) {
    decodedString += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }

  decodedString = decodedString.slice(1, -1); // Removes the first "[" and last "]"
  const decodedArray = decodedString.split(",");
  console.log(decodedArray);
  return decodedArray.map(Number);
}

"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useReadContract, useWriteContract } from "wagmi";
import FactoryJSON from "../../abis/Factory.json";
import { DaoDetails } from "@/components/DaoDetails";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const FACTORY_PROPOSALS = "0x2AdA59d8f7443DE332C9311da97D39120c81563f";

export default function Home() {
  const { data: daos } = useReadContract({
    abi: FactoryJSON.abi,
    address: FACTORY_PROPOSALS,
    functionName: "getAllProposals",
  });
  const { writeContract } = useWriteContract();

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
        </BreadcrumbList>
      </Breadcrumb>
      <Separator
        orientation="vertical"
        className="h-[1px] bg-[#000] w-100 my-2"
      />
      <div className="mx-auto bg-primary text-white p-3">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <h1 className="text-4xl ">Task Allocation</h1>
              <span className="block my-5">
                A system that facilitates job market or task allocation for DAOs
                using a submit-reveal scheme. This approach helps prevent unfair
                advantages by ensuring that neither party (the DAO or the
                worker) knows the others budget or offer in advance. The idea
                introduces an element of privacy-preserving negotiation that can
                enhance fairness in task allocation. Here is how you can
                structure your project:
              </span>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <Table>
          <TableCaption>A list of recent proposals.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Description</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Voting Phase Date</TableHead>
              <TableHead>Executed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(daos) &&
              daos.map((dao) => {
                console.log(dao);
                return <DaoDetails key={dao} dao={dao} />;
              })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

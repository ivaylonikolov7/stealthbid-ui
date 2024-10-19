"use client";

import { ProposalDao } from "@/components/ProposalDAO";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function Home({
  params,
}: {
  params: {
    id: string;
  };
}) {
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
            <BreadcrumbLink href={`/proposal/${params.id}`}>
              {params.id}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <Separator
        orientation="vertical"
        className="h-[1px] bg-[#000] w-100 my-2"
      />
      <ProposalDao address={params.id} />
    </>
  );
}

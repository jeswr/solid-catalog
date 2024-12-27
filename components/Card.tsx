"use client";

import React, { Suspense, useContext, useMemo } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useSearchParams } from "next/navigation";

import { useGetShape } from "@/hooks/useGetShape";
import { SolidProjectResourceShapeShapeType } from "@/ldo/catalog.shapeTypes";
import { Categories } from "@/app/providers";

function toUrl(str: string | undefined): string {
  if (!str) return "https://solidproject.org/image/logo.svg";
  try {
    const res = new URL("favicon.ico", str);

    return res.toString();
  } catch {
    return "https://solidproject.org/image/logo.svg";
  }
}

export function ItemCard({ item }: { item: string }) {
  const params = useSearchParams();
  const info = useGetShape(SolidProjectResourceShapeShapeType, item);
  const href =
    info.homepage?.["@id"] ||
    info.repository?.["@id"] ||
    info.serviceEndpoint?.["@id"] ||
    info.webid?.["@id"] ||
    info["@id"];

  // const [homepage, setHomepage] = React.useState<string>(toUrl(href));
  const [homepage, setHomepage] = React.useState<string>(
    "https://solidproject.org/image/logo.svg",
  );

  // React.useEffect(() => {
  //   if (homepage !== 'https://solidproject.org/image/logo.svg') {
  //     fetch(homepage).then(res => {
  //       if (!res.ok) {
  //         setHomepage('https://solidproject.org/image/logo.svg');
  //       }
  //     }).catch(() => {
  //       setHomepage('https://solidproject.org/image/logo.svg');
  //     });
  //   }
  // }, [href]);

  const filter = params.get("filter");

  const hide = useMemo(() => {
    if (typeof filter !== "string" || filter.length === 0) return false;

    const lowerFilter = filter.toLowerCase();

    if (
      Array.isArray(info.keywords) &&
      info.keywords.some(
        (kw) =>
          typeof kw === "string" && kw.toLowerCase().includes(lowerFilter),
      )
    )
      return false;
    if (
      typeof info.name === "string" &&
      info.name?.toLowerCase().includes(lowerFilter)
    )
      return false;
    if (
      typeof info.description === "string" &&
      info.description?.toLowerCase().includes(lowerFilter)
    )
      return false;
    if (
      typeof info.label === "string" &&
      info.label?.toLowerCase().includes(lowerFilter)
    )
      return false;

    return true;
  }, [info, filter]);

  return hide ? undefined : (
    <Link href={href} isDisabled={!href} target="_blank">
      <Card key={item} isPressable shadow="sm">
        <CardBody className="overflow-visible p-0">
          <Image
            alt={info.name || info.alternateName}
            className="w-full object-cover h-[140px]"
            radius="lg"
            shadow="sm"
            // src={item.img}
            src={homepage}
            width="100%"
          />
        </CardBody>
        <CardFooter className="text-small justify-between">
          <div className="w-full">
            <b>{info.name || info.alternateName || info.label}</b>
            <br />
            <i>{info.description}</i>
            <ul>
              {info.license && <li>License: {info.license}</li>}
              {info.homepage && info.homepage["@id"] !== href ? (
                <li>
                  Homepage:{" "}
                  <Link href={info.homepage["@id"]}>
                    {info.homepage["@id"]}
                  </Link>
                </li>
              ) : undefined}
              {info.repository && (
                <li>
                  Repository:{" "}
                  <Link href={info.repository["@id"]}>
                    {info.repository["@id"]}
                  </Link>
                </li>
              )}
              {info.wiki && (
                <li>
                  Wiki: <Link href={info.wiki["@id"]}>{info.wiki["@id"]}</Link>
                </li>
              )}
              {info.webid && (
                <li>
                  WebID:{" "}
                  <Link href={info.webid["@id"]}>{info.webid["@id"]}</Link>
                </li>
              )}
            </ul>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function CardTable({
  category,
}: {
  category: string | null | undefined;
}) {
  const { categories, instanceLookup } = useContext(Categories);
  const list = useMemo(
    () =>
      typeof category === "string" && category in instanceLookup
        ? instanceLookup[category]
        : [],
    [category, categories],
  );

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {list.map((item, index) => (
        <ItemCard key={`${category}${index}`} item={item} />
      ))}
    </div>
  );
}

export function Cards() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardsRaw />
    </Suspense>
  );
}

export function CardsRaw() {
  const { categories } = useContext(Categories);

  return categories.map((cat) => (
    <div key={"section_" + cat["@id"]} id={cat["@id"]}>
      <Button key={"button_" + cat["@id"]} isDisabled className="w-full mb-2">
        {cat?.label}
      </Button>
      <CardTable key={"card_" + cat["@id"]} category={cat["@id"]} />
    </div>
  ));
}

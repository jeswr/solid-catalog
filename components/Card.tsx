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

function isUrl(str: string): boolean {
  try {
    new URL(str);

    return true;
  } catch {
    return false;
  }
}

const notUrl = [
  "https://raw.githubusercontent.com/solid-contrib/catalog/refs/heads/main/catalog-data.ttl",
  "http://example.org/catalog#",
];

export function ItemCard({ item, i }: { item: string; i: number }) {
  const params = useSearchParams();
  const info = useGetShape(SolidProjectResourceShapeShapeType, item);
  const _href =
    info.homepage?.["@id"] ||
    info.repository?.["@id"] ||
    info.serviceEndpoint?.["@id"] ||
    info.webid?.["@id"] ||
    info["@id"];

  const href =
    !_href || notUrl.some((url) => _href?.startsWith(url)) || !isUrl(_href)
      ? undefined
      : _href;

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
      <Card key={item} isPressable className="w-64 align-top" shadow="sm">
        <CardBody className="overflow-visible p-0">
          <Image
            alt={info.name || info.alternateName}
            className="w-full object-cover h-[140px]"
            fallbackSrc={`https://nextui.org/images/fruit-${(i % 6) + 1}.jpeg`}
            shadow="sm"
            // src={item.img}
            // src={homepage}
            // TODO: Make this fit content
            radius="lg"
            src={
              href ? `https://t1.gstatic.com/faviconV2?client=SOCIAL&fallback_opts=TYPE,SIZE,URL&url=${href}&size=256` : `https://nextui.org/images/fruit-${(i % 6) + 1}.jpeg`
            }
            width="fit"
            
            
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
        <ItemCard key={`${category}${index}`} i={index} item={item} />
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

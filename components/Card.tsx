"use client";

import React, { useContext, useMemo } from "react";
import { Categories } from "@/app/providers";
import {Listbox, ListboxItem} from "@nextui-org/listbox";
import { cn } from "@nextui-org/theme";
import {Card, CardBody, CardFooter} from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { useGetShape } from "@/hooks/useGetShape";
import { CatalogShapeShapeType, CategoryShapeShapeType, SolidProjectResourceShapeShapeType } from "@/ldo/catalog.shapeTypes";
import { Link } from "@nextui-org/link";
import { useSearchParams, usePathname } from "next/navigation";

function isUrl(str: string | undefined): boolean {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function ItemCard({ item }: { item: string }) {
  const info = useGetShape(SolidProjectResourceShapeShapeType, item);
  const href = info.homepage?.['@id'] || info.repository?.["@id"] || info.serviceEndpoint?.["@id"] || info.webid?.["@id"] || info["@id"];
  
  const [homepage, setHomepage] = React.useState<string>(
    // isUrl(href) ? new URL('favicon.ico', href).toString() : 
    'https://solidproject.org/image/logo.svg');

  React.useEffect(() => {
    if (homepage !== 'https://solidproject.org/image/logo.svg') {
      fetch(homepage).then(res => {
        if (!res.ok) {
          setHomepage('https://solidproject.org/image/logo.svg');
        }
      }).catch(() => {
        setHomepage('https://solidproject.org/image/logo.svg');
      });
    }
  }, [href]);

  console.log(info, href);
  return (
    <Link href={href} isDisabled={!href} target="_blank">
    <Card key={item} isPressable shadow="sm" onPress={() => console.log("item pressed")}>
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
      <b>{info.name || info.alternateName || info.label}</b>
      {/* <p className="text-default-500">{item.price}</p> */}
    </CardFooter>
  </Card>
    </Link>
  )
}

function useCategory() {
  const params = useSearchParams();
  return params.get('category');
}

export function CardTable() {
  const { categories, instanceLookup } = useContext(Categories);
  const category = useCategory();
  const list = useMemo(() => (typeof category === 'string' && category in instanceLookup) ? instanceLookup[category] : [], [category, categories]);
  
  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {list.map((item, index) => <ItemCard key={index} item={item} />)}
    </div>
  );
}

export function Cards() {
  const { categories } = useContext(Categories);
  const category = useCategory();
  const name = useMemo(() => categories.find((cat) => cat['@id'] === category)?.label, [category, categories]);
  return (
    <div>
      <Button isDisabled className="w-full mb-2">
        {name}
      </Button>
      <CardTable />
    </div>
  );
}



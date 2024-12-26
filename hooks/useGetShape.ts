import { CatalogData } from "@/app/providers";
import { useContext, useMemo } from "react";
import { CatalogShapeShapeType } from "@/ldo/catalog.shapeTypes";
import { LdoBase, ShapeType } from "@ldo/ldo";
import { SubjectNode } from "@ldo/rdf-utils";
import { catalogIri } from "@/config/site";
import { DataFactory as DF } from "n3";

export function useGetShape<T extends LdoBase>(shape: ShapeType<T>, subject: string | SubjectNode): T {
  const CategoryData = useContext(CatalogData);
  return useMemo(() => CategoryData.usingType(shape).fromSubject(subject), [CategoryData]);
}

export function useGetCategories() {
  const CategoryData = useContext(CatalogData);
  const shape = useGetShape(CatalogShapeShapeType, catalogIri);
  return useMemo(() => {
    const categories = shape.category ?? [];
    const lookup: Record<string, string[]> = {};
    for (const cat of categories) {
      lookup[cat['@id']!] = [];
      CategoryData.match(null, DF.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), DF.namedNode(cat['@id']!)).every((match) => {
        lookup[cat['@id']!].push(match.object.value);
        return true;
      });
    }
    return {
      categories,
      instanceLookup: lookup,
    }
  }, [shape]);
}

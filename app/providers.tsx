"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { parse } from "rdf-dereference-store";
import { Store as _Store } from "n3";
import { DatasetFactory } from "@rdfjs/types";
import { createLdoDataset, LdoDataset } from "@ldo/ldo";

import { useGetCategories } from "@/hooks/useGetShape";
const Store = { dataset: () => new _Store() } as unknown as DatasetFactory;

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export const CatalogData = React.createContext(createLdoDataset());
export const Categories = React.createContext<
  ReturnType<typeof useGetCategories>
>({ categories: [], instanceLookup: {} });

export function CategoriesDataProvider({ children }: ProvidersProps) {
  const value = useGetCategories();

  return <Categories.Provider value={value}>{children}</Categories.Provider>;
}

async function deref(url: string) {
  const res = await fetch(url);

  return (
    await parse(await res.text(), {
      contentType: "text/turtle",
      baseIRI: res.url,
    })
  ).store;
}

async function derefAll(urls: string[]) {
  const stores = await Promise.all(urls.map(deref));

  return stores.reduce(
    (acc, store) => acc.union(store as any),
    Store.dataset(),
  );
}

export function CatalogDataProvider({ children }: ProvidersProps) {
  const [catalog, setCatalog] = React.useState<LdoDataset>(() =>
    createLdoDataset(),
  );

  React.useEffect(() => {
    derefAll([
      "https://raw.githubusercontent.com/solid-contrib/catalog/refs/heads/main/catalog-data.ttl",
      "/catalog.ttl",
    ])
      .then((store) => {
        setCatalog(createLdoDataset(store));
      })
      .catch((error) => {
        alert(
          "Unable to load catalog data, reload the page or try again later" +
            error,
        );
      });
  }, []);

  return (
    <CatalogData.Provider value={catalog}>{children}</CatalogData.Provider>
  );
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <CatalogDataProvider>
      <CategoriesDataProvider>
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </NextUIProvider>
      </CategoriesDataProvider>
    </CatalogDataProvider>
  );
}

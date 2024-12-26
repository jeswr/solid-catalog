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
const Store = { dataset: () => new _Store()} as unknown as DatasetFactory;

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
export const Categories = React.createContext<ReturnType<typeof useGetCategories>>({ categories: [], instanceLookup: {} });
export const CurrentCategory = React.createContext<ReturnType<typeof React.useState<string>>>([undefined, () => {}]);

export function CurrentCategoryProvider({ children }: ProvidersProps) {
  const { categories } = React.useContext(Categories);
  const state = React.useState<string>();

  React.useEffect(() => {
    if (typeof state[0] !== 'string' && categories.length > 0) {
      state[1](categories[0]['@id']!);
    }
  }, [categories]);

  return <CurrentCategory.Provider value={state}>{children}</CurrentCategory.Provider>;
}

export function CategoriesDataProvider({ children, themeProps }: ProvidersProps) {
  const value = useGetCategories();

  return (
    <Categories.Provider value={value}>
      {children}
    </Categories.Provider>
  );
}

export function CatalogDataProvider({ children, themeProps }: ProvidersProps) {
  const [catalog, setCatalog] = React.useState<LdoDataset>(() => createLdoDataset());

  React.useEffect(() => {
    Promise.all([
      "https://raw.githubusercontent.com/solid-contrib/catalog/refs/heads/main/catalog-data.ttl",
      "/catalog.ttl"
    ].map((url) => fetch(url)))
    .then(res => res.map((res) => res.text()))
    .then((texts) => Promise.all(texts))
    .then((texts) => texts.map((text) => parse(text, { contentType: "text/turtle" })))
    .then((promises) => Promise.all(promises))
    .then((stores) => {
      const store = stores.reduce((acc, store) => {
        return acc.union(store.store as any);
      }, Store.dataset());
      setCatalog(createLdoDataset(store));
    })
    .catch((error) => { alert("Unable to load catalog data, reload the page or try again later" + error); });
  }, []);

  console.log(catalog.size);
  
  return <CatalogData.Provider value={catalog}>{children}</CatalogData.Provider>;
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

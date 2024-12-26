import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { ScrollShadow } from "@nextui-org/scroll-shadow"

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { CateogoryList } from "@/components/ListBox";
import { useGetCategories } from "@/hooks/useGetShape";

export default function Home() {


  return (
    <div className="flex flex-row items-start justify-between">
      <section className="flex flex-col items-left justify-left gap-4">
        <ScrollShadow className="h-1/5">
          <CateogoryList />
        </ScrollShadow>
      </section>
      <section className="flex flex-col items-right justify-right gap-4">
        Hello World
      </section>
    </div>
  );
}

import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { Cards } from "@/components/Card";
import { CateogoryList } from "@/components/ListBox";

export default function Home() {
  return (
    <div className="flex flex-row items-start justify-between">
      <section className="flex flex-col items-left justify-left gap-4">
        <ScrollShadow className="h-1/5">
          <CateogoryList />
        </ScrollShadow>
      </section>
      <section className="flex flex-col items-right justify-right gap-4 pl-5">
        <Cards />
      </section>
    </div>
  );
}

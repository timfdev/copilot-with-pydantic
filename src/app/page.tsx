"use client";

import Link from "next/link";
import { EuiProvider, EuiPageTemplate, EuiButton } from "@elastic/eui";
import { WfoSearch } from "@/app/components/WfoSearch";

export default function Home() {
  return (
    <EuiProvider colorMode="light">
      <EuiPageTemplate>
        <EuiPageTemplate.Header
          rightSideItems={[
            <Link href="/agent" key="agent-link" passHref>
              <EuiButton fill>Open Agent</EuiButton>
            </Link>,
          ]}
        >
          <h1>My App</h1>
        </EuiPageTemplate.Header>

        <EuiPageTemplate.Section>
          <WfoSearch />
        </EuiPageTemplate.Section>
      </EuiPageTemplate>
    </EuiProvider>
  );
}

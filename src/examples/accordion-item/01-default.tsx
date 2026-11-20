/**
 * @title Accordion Item
 * @description Show and hide sections of related content, like FAQs. Each header is a button.
 */
"use client";
import { Accordion, AccordionItem } from "@/components/ui/nav-extra";

export default function Example() {
  return (
    <Accordion defaultOpen={["plan"]}>
      <AccordionItem id="plan" title="What is included in the plan?">Every plan includes unlimited projects, 10 GB of storage per member and email support.</AccordionItem>
      <AccordionItem title="Can I change plans later?">Yes. Upgrades apply right away; downgrades apply at the next billing date.</AccordionItem>
      <AccordionItem title="How do refunds work?">Annual plans can be refunded within 30 days of purchase.</AccordionItem>
    </Accordion>
  );
}

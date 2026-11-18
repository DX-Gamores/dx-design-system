import { llmsFullTxt } from "@/site/llms";

export const dynamic = "force-static";
export const GET = () => new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });

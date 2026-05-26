import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

function InlineCode(props: ComponentPropsWithoutRef<"code">) {
  return <code className="inline-code" {...props} />;
}

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 className="prose-heading" {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="prose-subheading" {...props} />,
  p: (props: ComponentPropsWithoutRef<"p">) => <p className="prose-paragraph" {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="prose-list" {...props} />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => <ol className="prose-list prose-list-ordered" {...props} />,
  li: (props: ComponentPropsWithoutRef<"li">) => <li {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="prose-quote" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => <pre className="code-block" {...props} />,
  code: InlineCode,
  a: ({
    href = "",
    children,
    ...props
  }: ComponentPropsWithoutRef<"a"> & { href?: string }) =>
    href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noreferrer" className="text-link" {...props}>
        {children}
      </a>
    ) : (
      <Link href={href} className="text-link" {...props}>
        {children}
      </Link>
    )
};

export type MarkdownFile = {
  frontmatter: {
    title: string
    description: string
    authors: string
    eventDate: Date
    featuredImage: string
    excerpt: string
  }
  url: string
}
